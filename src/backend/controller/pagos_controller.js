import mongoose from 'mongoose';
import '../models/pago.js';
import '../models/asignacion_pago.js';
import '../models/cuota.js';
import '../models/prestamo.js';
import '../models/transaccion_financiera.js';
import { esObjectId, responderError } from '../helpers/controlador.js';
import * as seguimiento from './seguimiento_controller.js';

export const listarPagos = seguimiento.listarPagos;

export async function registrarPago(req, res) {
    let session;
    try {
        session = await mongoose.startSession();
        const { clienteId, montoTotal, metodoPago, referenciaExterna, asignaciones } = req.body ?? {};
        if (!esObjectId(clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
        if (typeof montoTotal !== 'number' || !Number.isFinite(montoTotal) || montoTotal <= 0) {
            return res.status(400).json({ message: 'El monto total debe ser mayor que cero' });
        }
        if (typeof metodoPago !== 'string' || !metodoPago.trim() || metodoPago.length > 50) {
            return res.status(400).json({ message: 'Método de pago inválido' });
        }
        if (!Array.isArray(asignaciones) || asignaciones.length === 0 ||
            asignaciones.some((item) => !item || typeof item !== 'object' ||
                !esObjectId(item.cuotaId) ||
                typeof item.montoAplicado !== 'number' ||
                !Number.isFinite(item.montoAplicado) ||
                item.montoAplicado <= 0)) {
            return res.status(400).json({ message: 'Incluye asignaciones válidas a cuotas' });
        }
        const cuotaIds = asignaciones.map((item) => item.cuotaId);
        if (new Set(cuotaIds).size !== cuotaIds.length) {
            return res.status(400).json({ message: 'No repitas cuotas en las asignaciones' });
        }
        if ([montoTotal, ...asignaciones.map((item) => item.montoAplicado)]
            .some((monto) => Math.abs(monto * 100 - Math.round(monto * 100)) > 1e-8)) {
            return res.status(400).json({ message: 'Los importes deben tener un máximo de dos decimales' });
        }
        const sumaAsignacionesCentavos = asignaciones.reduce(
            (suma, item) => suma + Math.round(item.montoAplicado * 100), 0
        );
        if (sumaAsignacionesCentavos !== Math.round(montoTotal * 100)) {
            return res.status(400).json({ message: 'La suma asignada debe coincidir con el pago total' });
        }

        let pagoCreado;
        await session.withTransaction(async () => {
            const cuotas = await mongoose.model('Cuota').find({
                _id: { $in: cuotaIds },
                estado: { $in: ['pendiente', 'vencida'] }
            }).session(session);
            if (cuotas.length !== cuotaIds.length) {
                const error = new Error('Una o más cuotas no existen o ya fueron pagadas');
                error.status = 409;
                throw error;
            }

            const prestamos = await mongoose.model('Prestamo').find({
                _id: { $in: cuotas.map((cuota) => cuota.prestamoId) },
                clienteId,
                estado: { $in: ['activo', 'en_mora'] }
            }).session(session);
            if (prestamos.length !== new Set(cuotas.map((cuota) => cuota.prestamoId.toString())).size) {
                const error = new Error('Las cuotas no pertenecen al cliente indicado');
                error.status = 400;
                throw error;
            }

            for (const asignacion of asignaciones) {
                const cuota = cuotas.find((item) => item._id.toString() === asignacion.cuotaId);
                if (Math.abs(cuota.montoTotal * 100 - Math.round(cuota.montoTotal * 100)) > 1e-8 ||
                    Math.round(cuota.montoTotal * 100) !== Math.round(asignacion.montoAplicado * 100)) {
                    const error = new Error('Este sistema requiere pagar cada cuota completa');
                    error.status = 400;
                    throw error;
                }
            }

            [pagoCreado] = await mongoose.model('Pago').create([{
                clienteId, montoTotal, metodoPago: metodoPago.trim(), referenciaExterna
            }], { session });
            await mongoose.model('AsignacionPago').create(asignaciones.map((item) => ({
                pagoId: pagoCreado._id,
                cuotaId: item.cuotaId,
                montoAplicado: item.montoAplicado
            })), { session });

            for (const item of cuotas) {
                const actualizada = await mongoose.model('Cuota').findOneAndUpdate(
                    { _id: item._id, estado: { $in: ['pendiente', 'vencida'] } },
                    { $set: { estado: 'pagada' } },
                    { new: true, runValidators: true, session }
                );
                if (!actualizada) {
                    const error = new Error('La cuota cambió mientras se procesaba el pago');
                    error.status = 409;
                    throw error;
                }
            }
            for (const prestamo of prestamos) {
                const cuotasPendientes = await mongoose.model('Cuota').countDocuments({
                    prestamoId: prestamo._id,
                    estado: { $ne: 'pagada' }
                }).session(session);
                if (cuotasPendientes === 0) {
                    await mongoose.model('Prestamo').updateOne(
                        { _id: prestamo._id, estado: { $in: ['activo', 'en_mora'] } },
                        { $set: { estado: 'saldado' } },
                        { runValidators: true, session }
                    );
                }
            }
            await mongoose.model('TransaccionFinanciera').create([{
                referenciaId: pagoCreado._id,
                tipoTransaccion: 'pago_cuota',
                monto: montoTotal,
                moneda: 'DOP'
            }], { session });
        });
        return res.status(201).json({ message: 'Pago registrado y aplicado', pago: pagoCreado });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return responderError(res, error, 'Error al registrar el pago');
    } finally {
        await session?.endSession();
    }
}
