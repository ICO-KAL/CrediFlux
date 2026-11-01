import mongoose from 'mongoose';
import permisos from '../models/permiso.js';
import '../models/rol.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function listarPermisos(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.modulo !== undefined) filtro.modulo = req.query.modulo;
        const [items, total] = await Promise.all([
            mongoose.model('Permiso').find(filtro).sort({ modulo: 1, nombreAccion: 1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Permiso').countDocuments(filtro)
        ]);
        return res.status(200).json({ permisos: items, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar permisos');
    }
}

export async function crearPermiso(req, res) {
    try {
        const { nombreAccion, modulo } = req.body ?? {};
        if (typeof nombreAccion !== 'string' || !nombreAccion.trim() ||
            typeof modulo !== 'string' || !modulo.trim()) {
            return res.status(400).json({ message: 'nombreAccion y modulo son requeridos' });
        }
        const permiso = await permisos.crearPermiso({
            nombreAccion: nombreAccion.trim(),
            modulo: modulo.trim()
        });
        return res.status(201).json({ message: 'Permiso creado', permiso });
    } catch (error) {
        return responderError(res, error, 'Error al crear permiso');
    }
}

export async function eliminarPermiso(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de permiso inválido' });
        const permiso = await mongoose.model('Permiso').findById(id);
        if (!permiso) return res.status(404).json({ message: 'Permiso no encontrado' });
        const asignado = await mongoose.model('Rol').exists({ permisos: permiso._id });
        if (asignado) return res.status(409).json({ message: 'No se puede eliminar un permiso asignado a roles' });
        await permisos.eliminarPermiso(id);
        return res.status(200).json({ message: 'Permiso eliminado' });
    } catch (error) {
        return responderError(res, error, 'Error al eliminar permiso');
    }
}
