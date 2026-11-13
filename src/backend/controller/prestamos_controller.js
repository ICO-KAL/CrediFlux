import mongoose from 'mongoose';
import prestamos from '../models/prestamo.js';
import solicitudes from '../models/solicitud_credito.js';
import decisiones from '../models/decision_credito.js';
import '../models/cuota.js';
import '../models/pago.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function crearPrestamoDesdeSolicitud(req, res) {
    try {
        const { solicitudId } = req.body ?? {};
        if (!esObjectId(solicitudId)) return res.status(400).json({ message: 'ID de solicitud inválido' });
        const solicitud = await solicitudes.getSolicitudCredito({ _id: solicitudId });
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
        if (solicitud.estado !== 'aprobada') return res.status(409).json({ message: 'Solo se puede crear un préstamo desde una solicitud aprobada' });

        const decision = await decisiones.getDecisionCredito({ solicitudId });
        if (!decision || !decision.montoAprobado || decision.montoAprobado <= 0) {
            return res.status(409).json({ message: 'La solicitud no tiene una decisión aprobatoria con monto válido' });
        }
        const existente = await prestamos.getPrestamo({ solicitudId });
        if (existente) return res.status(409).json({ message: 'Ya existe un préstamo para esta solicitud', prestamo: existente });

        const producto = await mongoose.model('ProductoCredito').findById(solicitud.productoCreditoId);
        if (!producto) return res.status(409).json({ message: 'El producto asociado ya no existe' });

        const prestamo = await prestamos.crearPrestamo({
            clienteId: solicitud.clienteId,
            solicitudId: solicitud._id,
            montoPrincipal: decision.montoAprobado,
            tasaInteres: producto.tasaInteresAnual,
            tipoTasa: producto.tipoTasa,
            sistemaAmortizacion: producto.sistemaAmortizacion,
            frecuenciaPago: producto.frecuenciaPago,
            tipoMora: producto.tipoMora,
            multaMoraFija: producto.multaMoraFija,
            multaMoraPorcentaje: producto.multaMoraPorcentaje,
            multaMoraTope: producto.multaMoraTope,
            diasGracia: producto.diasGracia,
            plazoMeses: solicitud.plazoSolicitadoMeses,
            estado: 'activo'
        });
        return res.status(201).json({ message: 'Préstamo creado desde solicitud aprobada', prestamo });
    } catch (error) {
        return responderError(res, error, 'Error al crear el préstamo');
    }
}

export async function listarPrestamos(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        if (req.query.estado !== undefined) filtro.estado = req.query.estado;
        const [items, total] = await Promise.all([
            mongoose.model('Prestamo').find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Prestamo').countDocuments(filtro)
        ]);
        return res.status(200).json({ prestamos: items, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar préstamos');
    }
}

export async function obtenerPrestamo(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de préstamo inválido' });
        const prestamo = await prestamos.getPrestamo({ _id: req.params.id });
        if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
        return res.status(200).json({ prestamo });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el préstamo');
    }
}

export async function obtenerMetricasCartera(req, res) {
    try {
        const estadosActivos = ['activo', 'en_mora'];
        const [prestamosActivos, totalPrestamos] = await Promise.all([
            mongoose.model('Prestamo').find({ estado: { $in: estadosActivos } }).select('_id').lean(),
            mongoose.model('Prestamo').countDocuments()
        ]);
        const idsActivos = prestamosActivos.map((prestamo) => prestamo._id);
        const fechaLimitePar30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const saldosPorPrestamo = idsActivos.length
            ? await mongoose.model('Cuota').aggregate([
                {
                    $match: {
                        prestamoId: { $in: idsActivos },
                        estado: { $in: ['pendiente', 'vencida'] }
                    }
                },
                {
                    $group: {
                        _id: '$prestamoId',
                        capitalPendiente: { $sum: '$montoCapital' },
                        cuotasPar30: {
                            $sum: {
                                $cond: [{ $lte: ['$fechaVencimiento', fechaLimitePar30] }, 1, 0]
                            }
                        }
                    }
                }
            ])
            : [];
        const capitalColocado = saldosPorPrestamo.reduce((total, prestamo) => total + prestamo.capitalPendiente, 0);
        const exposicionPar30 = saldosPorPrestamo
            .filter((prestamo) => prestamo.cuotasPar30 > 0)
            .reduce((total, prestamo) => total + prestamo.capitalPendiente, 0);
        const inicioDiaUtc = new Date();
        inicioDiaUtc.setUTCHours(0, 0, 0, 0);
        const finDiaUtc = new Date(inicioDiaUtc.getTime() + 24 * 60 * 60 * 1000);
        const pagosHoy = await mongoose.model('Pago').aggregate([
            { $match: { createdAt: { $gte: inicioDiaUtc, $lt: finDiaUtc } } },
            { $group: { _id: null, total: { $sum: '$montoTotal' } } }
        ]);

        return res.status(200).json({
            metricas: {
                totalPrestamos,
                prestamosActivos: prestamosActivos.length,
                capitalColocado: Math.round(capitalColocado * 100) / 100,
                exposicionPar30: Math.round(exposicionPar30 * 100) / 100,
                par30Porcentaje: capitalColocado
                    ? Math.round((exposicionPar30 / capitalColocado) * 10000) / 100
                    : 0,
                prestamosMoraCritica: saldosPorPrestamo.filter((prestamo) => prestamo.cuotasPar30 > 0).length,
                cobradoHoy: Math.round((pagosHoy[0]?.total || 0) * 100) / 100
            }
        });
    } catch (error) {
        return responderError(res, error, 'Error al calcular las métricas de cartera');
    }
}
