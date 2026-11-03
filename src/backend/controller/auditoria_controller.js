import mongoose from 'mongoose';
import '../models/auditoria.js';
import '../models/usuario.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function registrarAuditoria(req, res) {
    try {
        const { accion, detalles } = req.body ?? {};
        if (typeof accion !== 'string' || !accion.trim() || accion.trim().length > 150) {
            return res.status(400).json({ message: 'La acción es requerida y no puede superar 150 caracteres' });
        }
        if (detalles !== undefined && (typeof detalles !== 'string' || detalles.length > 5000)) {
            return res.status(400).json({ message: 'Los detalles deben ser texto de hasta 5000 caracteres' });
        }
        if (!esObjectId(req.usuario?.id)) {
            return res.status(401).json({ message: 'Se requiere una sesión autenticada' });
        }

        const auditoria = await mongoose.model('Auditoria').create({
            usuarioId: req.usuario.id,
            accion: accion.trim(),
            detalles: detalles?.trim(),
            ip: req.ip
        });
        return res.status(201).json({ message: 'Evento de auditoría registrado', auditoria });
    } catch (error) {
        return responderError(res, error, 'Error al registrar el evento de auditoría');
    }
}

export async function listarAuditoria(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });

        const filtro = {};
        if (req.query.usuarioId !== undefined) {
            if (!esObjectId(req.query.usuarioId)) return res.status(400).json({ message: 'ID de usuario inválido' });
            filtro.usuarioId = req.query.usuarioId;
        }
        if (req.query.accion !== undefined) {
            if (typeof req.query.accion !== 'string' || !req.query.accion.trim()) {
                return res.status(400).json({ message: 'El filtro accion debe ser texto no vacío' });
            }
            filtro.accion = req.query.accion.trim();
        }

        const [eventos, total] = await Promise.all([
            mongoose.model('Auditoria').find(filtro).populate('usuarioId', 'username email')
                .sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Auditoria').countDocuments(filtro)
        ]);
        return res.status(200).json({
            auditoria: eventos,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar la auditoría');
    }
}

export async function obtenerEventoAuditoria(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de auditoría inválido' });
        const auditoria = await mongoose.model('Auditoria').findById(req.params.id)
            .populate('usuarioId', 'username email');
        if (!auditoria) return res.status(404).json({ message: 'Evento de auditoría no encontrado' });
        return res.status(200).json({ auditoria });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el evento de auditoría');
    }
}
