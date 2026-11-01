import { createHash } from 'node:crypto';
import mongoose from 'mongoose';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';
import '../models/autorizacion_tarjeta.js';
import '../models/clave_idempotencia.js';
import '../models/movimiento_tarjeta.js';
import '../models/tarjeta_credito.js';
import '../models/transaccion_financiera.js';

const expiracionIdempotenciaMs = 24 * 60 * 60 * 1000;

export async function autorizarCompraTarjeta(req, res) {
    let session;
    let idempotencyKey;
    try {
        session = await mongoose.startSession();
        const { tarjetaId, monto, comercio } = req.body ?? {};
        const usuarioId = req.usuario?.id;
        const claveCliente = req.get('Idempotency-Key');

        if (!esObjectId(usuarioId)) return res.status(401).json({ message: 'Se requiere una sesión autenticada' });
        if (!esObjectId(tarjetaId)) return res.status(400).json({ message: 'ID de tarjeta inválido' });
        if (typeof monto !== 'number' || !Number.isFinite(monto) || monto <= 0 ||
            Math.abs(monto * 100 - Math.round(monto * 100)) > 1e-8) {
            return res.status(400).json({ message: 'El monto debe ser positivo y tener máximo dos decimales' });
        }
        if (typeof comercio !== 'string' || !comercio.trim() || comercio.trim().length > 200) {
            return res.status(400).json({ message: 'El comercio es requerido y no puede superar 200 caracteres' });
        }
        if (typeof claveCliente !== 'string' || !/^[\w.-]{8,128}$/.test(claveCliente)) {
            return res.status(400).json({ message: 'Envía Idempotency-Key con 8 a 128 caracteres seguros' });
        }
        idempotencyKey = createHash('sha256').update(`${usuarioId}:${claveCliente}`).digest('hex');
        const requestFingerprint = createHash('sha256')
            .update(JSON.stringify({ tarjetaId, monto, comercio: comercio.trim() }))
            .digest('hex');

        const existente = await mongoose.model('ClaveIdempotencia').findOne({
            clave: idempotencyKey,
            expiraEn: { $gt: new Date() }
        });
        if (existente) {
            if (existente.resultado?.fingerprint !== requestFingerprint) {
                return res.status(409).json({ message: 'La clave de idempotencia ya se usó con otros datos' });
            }
            if (!existente.resultado?.body) return res.status(409).json({ message: 'La solicitud con esa clave aún está procesándose' });
            return res.status(existente.resultado.status ?? 200)
                .json({ ...existente.resultado.body, repetida: true });
        }

        const autorizacionId = new mongoose.Types.ObjectId();
        let respuesta;
        let estadoHttp = 201;

        await session.withTransaction(async () => {
            await mongoose.model('ClaveIdempotencia').deleteOne(
                { clave: idempotencyKey, expiraEn: { $lte: new Date() } },
                { session }
            );
            await mongoose.model('ClaveIdempotencia').create([{
                clave: idempotencyKey,
                expiraEn: new Date(Date.now() + expiracionIdempotenciaMs)
            }], { session });

            const tarjeta = await mongoose.model('TarjetaCredito').findById(tarjetaId).session(session);
            if (!tarjeta) {
                const error = new Error('Tarjeta no encontrada');
                error.status = 404;
                throw error;
            }

            let tarjetaActualizada = null;
            let estadoAutorizacion = 'rechazada';
            let motivo;
            if (tarjeta.estado !== 'activa') {
                motivo = 'La tarjeta no está activa';
            } else {
                tarjetaActualizada = await mongoose.model('TarjetaCredito').findOneAndUpdate(
                    { _id: tarjetaId, estado: 'activa', saldoDisponible: { $gte: monto } },
                    { $inc: { saldoDisponible: -monto } },
                    { new: true, runValidators: true, session }
                );
                if (tarjetaActualizada) estadoAutorizacion = 'aprobada';
                else motivo = 'Saldo disponible insuficiente';
            }

            const [autorizacion] = await mongoose.model('AutorizacionTarjeta').create([{
                _id: autorizacionId,
                tarjetaId,
                monto,
                comercio: comercio.trim(),
                estadoAutorizacion
            }], { session });

            if (estadoAutorizacion === 'aprobada') {
                await mongoose.model('MovimientoTarjeta').create([{
                    tarjetaId,
                    monto,
                    descripcion: `Compra autorizada en ${comercio.trim()}`,
                    tipoMovimiento: 'cargo'
                }], { session });
                await mongoose.model('TransaccionFinanciera').create([{
                    referenciaId: autorizacion._id,
                    tipoTransaccion: 'compra_tarjeta',
                    monto,
                    moneda: 'DOP'
                }], { session });
            }

            respuesta = {
                message: estadoAutorizacion === 'aprobada' ? 'Compra aprobada' : 'Compra rechazada',
                autorizacion,
                ...(motivo ? { motivo } : {}),
                ...(tarjetaActualizada ? { saldoDisponible: tarjetaActualizada.saldoDisponible } : {})
            };
            estadoHttp = estadoAutorizacion === 'aprobada' ? 201 : 200;

            await mongoose.model('ClaveIdempotencia').updateOne(
                { clave: idempotencyKey },
                { $set: { resultado: { fingerprint: requestFingerprint, status: estadoHttp, body: respuesta } } },
                { session }
            );
        });

        return res.status(estadoHttp).json(respuesta);
    } catch (error) {
        if (error?.code === 11000) {
            try {
                const registro = await mongoose.model('ClaveIdempotencia').findOne({
                    clave: idempotencyKey,
                    expiraEn: { $gt: new Date() }
                });
                if (registro?.resultado?.body) {
                    if (registro.resultado.fingerprint !== requestFingerprint) {
                        return res.status(409).json({ message: 'La clave de idempotencia ya se usó con otros datos' });
                    }
                    return res.status(registro.resultado.status ?? 200)
                        .json({ ...registro.resultado.body, repetida: true });
                }
                return res.status(409).json({ message: 'La clave de idempotencia ya fue utilizada' });
            } catch (lookupError) {
                return responderError(res, lookupError, 'No se pudo verificar la clave de idempotencia');
            }
        }
        if (error.status) return res.status(error.status).json({ message: error.message });
        return responderError(res, error, 'Error al autorizar la compra con tarjeta');
    } finally {
        await session?.endSession();
    }
}

export async function listarAutorizacionesTarjeta(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.tarjetaId !== undefined) {
            if (!esObjectId(req.query.tarjetaId)) return res.status(400).json({ message: 'ID de tarjeta inválido' });
            filtro.tarjetaId = req.query.tarjetaId;
        }
        if (req.query.estadoAutorizacion !== undefined) {
            if (!['aprobada', 'rechazada'].includes(req.query.estadoAutorizacion)) {
                return res.status(400).json({ message: 'Estado de autorización inválido' });
            }
            filtro.estadoAutorizacion = req.query.estadoAutorizacion;
        }
        const [autorizaciones, total] = await Promise.all([
            mongoose.model('AutorizacionTarjeta').find(filtro)
                .sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('AutorizacionTarjeta').countDocuments(filtro)
        ]);
        return res.status(200).json({
            autorizaciones,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar autorizaciones de tarjeta');
    }
}

export async function obtenerAutorizacionTarjeta(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de autorización inválido' });
        const autorizacion = await mongoose.model('AutorizacionTarjeta').findById(req.params.id);
        if (!autorizacion) return res.status(404).json({ message: 'Autorización no encontrada' });
        return res.status(200).json({ autorizacion });
    } catch (error) {
        return responderError(res, error, 'Error al obtener la autorización');
    }
}
