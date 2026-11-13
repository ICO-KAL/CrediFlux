import mongoose from 'mongoose';
import '../models/cuota.js';
import '../models/plan_amortizacion.js';
import '../models/prestamo.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';
import { calcularPenalizacionMora } from '../helpers/mora.js';

export async function listarCuotas(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.prestamoId !== undefined) {
            if (!esObjectId(req.query.prestamoId)) return res.status(400).json({ message: 'ID de préstamo inválido' });
            filtro.prestamoId = req.query.prestamoId;
        }
        if (req.query.estado !== undefined) filtro.estado = req.query.estado;
        const [cuotas, total] = await Promise.all([
            mongoose.model('Cuota').find(filtro).sort({ prestamoId: 1, numeroCuota: 1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Cuota').countDocuments(filtro)
        ]);
        const prestamos = cuotas.length
            ? await mongoose.model('Prestamo').find({ _id: { $in: [...new Set(cuotas.map((cuota) => cuota.prestamoId.toString()))] } })
            : [];
        const prestamosPorId = new Map(prestamos.map((prestamo) => [prestamo._id.toString(), prestamo]));
        const cuotasConMora = cuotas.map((cuota) => {
            const item = cuota.toObject();
            const prestamo = prestamosPorId.get(item.prestamoId.toString());
            const penalizacion = calcularPenalizacionMora(item, prestamo);
            return {
                ...item,
                montoPenalizacionMora: penalizacion,
                montoTotalConMora: Math.round((item.montoTotal + penalizacion) * 100) / 100
            };
        });
        return res.status(200).json({ cuotas: cuotasConMora, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar cuotas');
    }
}

export async function obtenerCuota(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de cuota inválido' });
        const cuota = await mongoose.model('Cuota').findById(req.params.id);
        if (!cuota) return res.status(404).json({ message: 'Cuota no encontrada' });
        return res.status(200).json({ cuota });
    } catch (error) {
        return responderError(res, error, 'Error al obtener la cuota');
    }
}

export async function obtenerPlanAmortizacion(req, res) {
    try {
        if (!esObjectId(req.params.prestamoId)) return res.status(400).json({ message: 'ID de préstamo inválido' });
        const plan = await mongoose.model('PlanAmortizacion')
            .findOne({ prestamoId: req.params.prestamoId })
            .populate('cuotasIds');
        if (!plan) return res.status(404).json({ message: 'Plan de amortización no encontrado' });
        return res.status(200).json({ plan });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el plan de amortización');
    }
}
