import mongoose from 'mongoose';
import notificaciones from '../models/notificacion.js';
import '../models/cliente.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function listarNotificaciones(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        if (req.query.leida !== undefined) {
            if (!['true', 'false'].includes(req.query.leida)) return res.status(400).json({ message: 'El filtro leida debe ser true o false' });
            filtro.leida = req.query.leida === 'true';
        }
        const [notificaciones, total] = await Promise.all([
            mongoose.model('Notificacion').find(filtro).sort({ createdAt: -1 })
                .skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Notificacion').countDocuments(filtro)
        ]);
        return res.status(200).json({
            notificaciones,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar notificaciones');
    }
}

export async function crearNotificacion(req, res) {
    try {
        const { clienteId, titulo, mensaje } = req.body ?? {};
        if (!esObjectId(clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
        if (typeof titulo !== 'string' || !titulo.trim() || titulo.trim().length > 150 || typeof mensaje !== 'string' || !mensaje.trim() || mensaje.trim().length > 5000) {
            return res.status(400).json({ message: 'Título y mensaje son requeridos y deben respetar sus límites' });
        }
        if (!await mongoose.model('Cliente').exists({ _id: clienteId })) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        const notificacion = await notificaciones.crearNotificacion({
            clienteId, titulo: titulo.trim(), mensaje: mensaje.trim()
        });
        return res.status(201).json({ message: 'Notificación creada', notificacion });
    } catch (error) {
        return responderError(res, error, 'Error al crear la notificación');
    }
}

export async function marcarNotificacionLeida(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de notificación inválido' });
        const notificacion = await notificaciones.actualizarNotificacion(
            req.params.id, { $set: { leida: true } }, { runValidators: true }
        );
        if (!notificacion) return res.status(404).json({ message: 'Notificación no encontrada' });
        return res.status(200).json({ message: 'Notificación marcada como leída', notificacion });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar la notificación');
    }
}

export async function eliminarNotificacion(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de notificación inválido' });
        const notificacion = await notificaciones.eliminarNotificacion(req.params.id);
        if (!notificacion) return res.status(404).json({ message: 'Notificación no encontrada' });
        return res.status(200).json({ message: 'Notificación eliminada', notificacion });
    } catch (error) {
        return responderError(res, error, 'Error al eliminar la notificación');
    }
}
