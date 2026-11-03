import mongoose from 'mongoose';
import '../models/comision.js';
import '../models/prestamo.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function listarComisiones(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.prestamoId !== undefined) {
            if (!esObjectId(req.query.prestamoId)) return res.status(400).json({ message: 'ID de préstamo inválido' });
            filtro.prestamoId = req.query.prestamoId;
        }
        const [comisiones, total] = await Promise.all([
            mongoose.model('Comision').find(filtro).sort({ createdAt: -1 })
                .skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Comision').countDocuments(filtro)
        ]);
        return res.status(200).json({
            comisiones,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar comisiones');
    }
}

export async function registrarComision(req, res) {
    try {
        const { prestamoId, tipoComision, monto } = req.body ?? {};
        if (!esObjectId(prestamoId)) return res.status(400).json({ message: 'ID de préstamo inválido' });
        if (typeof tipoComision !== 'string' || !tipoComision.trim() || tipoComision.trim().length > 100) {
            return res.status(400).json({ message: 'El tipo de comisión es requerido y no puede superar 100 caracteres' });
        }
        if (typeof monto !== 'number' || !Number.isFinite(monto) || monto < 0) {
            return res.status(400).json({ message: 'El monto debe ser un número mayor o igual a cero' });
        }
        if (!await mongoose.model('Prestamo').exists({ _id: prestamoId })) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        const comision = await mongoose.model('Comision').create({
            prestamoId, tipoComision: tipoComision.trim(), monto
        });
        return res.status(201).json({ message: 'Comisión registrada', comision });
    } catch (error) {
        return responderError(res, error, 'Error al registrar la comisión');
    }
}
