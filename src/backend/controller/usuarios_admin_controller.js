import mongoose from 'mongoose';
import '../models/usuario.js';
import roles from '../models/rol.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

async function errorAlRevocarUltimoAdministrador(usuarioId, rolesPropuestos) {
    const [usuario, rolAdministrador] = await Promise.all([
        mongoose.model('Usuario').findById(usuarioId).populate('roles'),
        roles.getRol({ nombre: { $regex: /^administrador$/i } })
    ]);
    if (!usuario || !usuario.activo || !rolAdministrador) return null;
    const tieneRolAdministrador = usuario.roles.some((rol) => rol._id.equals(rolAdministrador._id));
    const conservaRolAdministrador = rolesPropuestos.some((rolId) => rolId.toString() === rolAdministrador._id.toString());
    if (!tieneRolAdministrador || conservaRolAdministrador) return null;

    const administradoresActivos = await mongoose.model('Usuario').countDocuments({
        activo: true,
        roles: rolAdministrador._id
    });
    return administradoresActivos <= 1
        ? 'No se puede retirar el último rol de administrador activo'
        : null;
}

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
        const rolesExistentes = await Promise.all(unicos.map((rolId) => roles.getRol({ _id: rolId }, { incluirPermisos: true })));
        if (rolesExistentes.some((rol) => !rol)) {
            return res.status(404).json({ message: 'Uno o más roles no existen' });
        }
        const errorUltimoAdministrador = await errorAlRevocarUltimoAdministrador(id, unicos);
        if (errorUltimoAdministrador) return res.status(409).json({ message: errorUltimoAdministrador });

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

export async function eliminarRolesUsuario(req, res) {
    try{
        const { id } = req.params;
        const { roles: rolesIds } = req.body ?? {};
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de usuario inválido' });
        if (!Array.isArray(rolesIds) || rolesIds.some((rolId) => !esObjectId(rolId))) {
            return res.status(400).json({ message: 'roles debe ser una lista de IDs válidos' });
        }
        const unicos = [...new Set(rolesIds)];
        const usuario = await mongoose.model('Usuario').findById(id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        const rolesPropuestos = usuario.roles.filter((rol) => !unicos.includes(rol.toString()));
        const errorUltimoAdministrador = await errorAlRevocarUltimoAdministrador(id, rolesPropuestos);
        if (errorUltimoAdministrador) return res.status(409).json({ message: errorUltimoAdministrador });
        usuario.roles = rolesPropuestos;
        await usuario.save();
        await usuario.populate('roles');
        return res.status(200).json({ message: 'Rol eliminados', usuario });
    }
    catch (error) {
        return responderError(res, error, 'Error al eliminar roles');
    }
}

export async function actualizarEstadoUsuario(req, res) {
    try {
        const { id } = req.params;
        const { activo } = req.body ?? {};
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de usuario inválido' });
        if (typeof activo !== 'boolean') return res.status(400).json({ message: 'activo debe ser un valor booleano' });
        if (!activo && req.usuario?.id === id) {
            return res.status(409).json({ message: 'No puedes desactivar tu propia cuenta' });
        }

        const usuario = await mongoose.model('Usuario').findById(id).populate('roles');
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        if (!activo && usuario.activo) {
            const tieneRolAdministrador = usuario.roles.some((rol) => rol.nombre?.toLowerCase() === 'administrador');
            if (tieneRolAdministrador) {
                const administradoresActivos = await mongoose.model('Usuario').countDocuments({
                    activo: true,
                    roles: { $in: usuario.roles.filter((rol) => rol.nombre?.toLowerCase() === 'administrador').map((rol) => rol._id) }
                });
                if (administradoresActivos <= 1) {
                    return res.status(409).json({ message: 'No se puede desactivar la última cuenta de administrador activa' });
                }
            }
        }

        usuario.activo = activo;
        await usuario.save();
        return res.status(200).json({
            message: activo ? 'Cuenta activada' : 'Cuenta desactivada; sus sesiones ya no tendrán acceso a la API',
            usuario: { _id: usuario._id, username: usuario.username, email: usuario.email, activo: usuario.activo }
        });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar el estado del usuario');
    }
}
