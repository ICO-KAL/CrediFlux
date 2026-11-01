import mongoose from 'mongoose';
import '../models/cuota.js';
import '../models/plan_amortizacion.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

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
        return res.status(200).json({ cuotas, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
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
