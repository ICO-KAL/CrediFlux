import mongoose from 'mongoose';
import '../models/usuario.js';
import roles from '../models/rol.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function listarUsuarios(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.activo !== undefined) {
            if (!['true', 'false'].includes(req.query.activo)) return res.status(400).json({ message: 'Filtro activo inválido' });
            filtro.activo = req.query.activo === 'true';
        }
        const [items, total] = await Promise.all([
            mongoose.model('Usuario').find(filtro).select('-passwordHash')
                .populate('roles').sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Usuario').countDocuments(filtro)
        ]);
        return res.status(200).json({ usuarios: items, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar usuarios');
    }
}

export async function asignarRolesUsuario(req, res) {
    try {
        const { id } = req.params;
        const { roles: rolesIds } = req.body ?? {};
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de usuario inválido' });
        if (!Array.isArray(rolesIds) || rolesIds.some((rolId) => !esObjectId(rolId))) {
            return res.status(400).json({ message: 'roles debe ser una lista de IDs válidos' });
        }
        const unicos = [...new Set(rolesIds)];
        const rolesExistentes = await Promise.all(unicos.map((rolId) => roles.getIdRol(rolId)));
        if (rolesExistentes.some((rol) => !rol)) {
            return res.status(404).json({ message: 'Uno o más roles no existen' });
        }

        const usuario = await mongoose.model('Usuario').findByIdAndUpdate(
            id,
            { $set: { roles: unicos } },
            { new: true, runValidators: true }
        ).populate('roles');
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        return res.status(200).json({ message: 'Roles asignados', usuario });
    } catch (error) {
        return responderError(res, error, 'Error al asignar roles');
    }
}
