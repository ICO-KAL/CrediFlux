import mongoose from 'mongoose';
import rol from '../models/rol.js';
import permisoModel from '../models/permiso.js';
import usuarioModel from '../models/usuario.js';
import {esObjectId,responderError,validarPermisos} from '../helpers/controlador.js';

export async function crearRol(req, res) {
    try {
        const { nombre, descripcion, permisos = [] } = req.body ?? {};
        if (typeof nombre !== 'string' || nombre.trim().length === 0) {
            return res.status(400).json({ message: 'El nombre del rol es requerido' });
        }
        if (nombre.trim().length > 100) {
            return res.status(400).json({ message: 'El nombre no puede superar 100 caracteres' });
        }
        if (descripcion !== undefined && (typeof descripcion !== 'string' || descripcion.trim().length > 1000)) {
            return res.status(400).json({ message: 'La descripción debe ser texto y no superar 1000 caracteres' });
        }
        if (!await validarPermisos(permisos)) {
            return res.status(400).json({ message: 'Uno o más IDs de permisos son inválidos o no existen' });
        }

        const rolExistente = await rol.getRol({
            nombre: { $regex: `^${nombre.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
        });
        if (rolExistente) return res.status(409).json({ message: 'Ya existe un rol con ese nombre' });

        const nuevoRol = await rol.crearRol({
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() ?? '',
            permisos: [...new Set(permisos)]
        });
        return res.status(201).json({ message: 'Rol creado correctamente', rol: nuevoRol });
    } catch (error) {
        return responderError(res, error, 'Error al crear el rol');
    }
}

export async function listarRoles(req, res) {
    try {
        const roles = await rol.allRol();
        return res.status(200).json({ roles });
    } catch (error) {
        return responderError(res, error, 'Error al listar los roles');
    }
}

export async function obtenerRolId(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) {
            return res.status(400).json({ message: 'El ID del rol no es válido' });
        }

        const encontrado = await rol.getRol({ _id: id }, { incluirPermisos: true });
        if (!encontrado) return res.status(404).json({ message: 'No se encontró el rol' });
        return res.status(200).json({ rol: encontrado });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el rol');
    }
}

export async function actualizarRol(req, res) {
    try {
        const { id } = req.params;
        const { nombre, descripcion, permisos } = req.body ?? {};
        if (!esObjectId(id)) {
            return res.status(400).json({ message: 'El ID del rol no es válido' });
        }
        if (nombre === undefined && descripcion === undefined && permisos === undefined) {
            return res.status(400).json({ message: 'Indica al menos un campo para actualizar' });
        }

        const cambios = {};
        if (nombre !== undefined) {
            if (typeof nombre !== 'string' || nombre.trim().length === 0 || nombre.trim().length > 100) {
                return res.status(400).json({ message: 'El nombre debe tener entre 1 y 100 caracteres' });
            }
            const otroRol = await rol.getRol({
                nombre: { $regex: `^${nombre.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
                _id: { $ne: new mongoose.Types.ObjectId(id) }
            });
            if (otroRol) return res.status(409).json({ message: 'Ya existe otro rol con ese nombre' });
            cambios.nombre = nombre.trim();
        }
        if (descripcion !== undefined) {
            if (typeof descripcion !== 'string' || descripcion.trim().length > 1000) {
                return res.status(400).json({ message: 'La descripción no puede superar 1000 caracteres' });
            }
            cambios.descripcion = descripcion.trim();
        }
        if (permisos !== undefined) {
            if (!await validarPermisos(permisos)) {
                return res.status(400).json({ message: 'Uno o más IDs de permisos son inválidos o no existen' });
            }
            cambios.permisos = [...new Set(permisos)];
        }

        const actualizado = await rol.actualizarRol(id, { $set: cambios });
        if (!actualizado) return res.status(404).json({ message: 'No se encontró el rol' });
        return res.status(200).json({ message: 'Rol actualizado correctamente', rol: actualizado });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar el rol');
    }
}

export async function eliminarRol(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) {
            return res.status(400).json({ message: 'El ID del rol no es válido' });
        }

        const encontrado = await rol.getRol({ _id: id }, { incluirPermisos: true });
        if (!encontrado) return res.status(404).json({ message: 'No se encontró el rol' });

        const usuariosAsignados = await usuarioModel.contarUsuariosConRol(id);
        if (usuariosAsignados > 0) {
            return res.status(409).json({
                message: 'No se puede eliminar el rol porque está asignado a usuarios',
                usuariosAsignados
            });
        }

        await rol.eliminarRol(id);
        return res.status(200).json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
        return responderError(res, error, 'Error al eliminar el rol');
    }
}

export async function agregarPermisoARol(req, res) {
    try {
        const { id, permisoId } = req.params;
        if (!esObjectId(id) || !esObjectId(permisoId)) {
            return res.status(400).json({ message: 'El ID del rol o del permiso no es válido' });
        }

        const [encontrado, permisoEncontrado] = await Promise.all([
            rol.getRol({ _id: id }, { incluirPermisos: true }),
            permisoModel.getPermiso({ _id: permisoId })
        ]);
        if (!encontrado) return res.status(404).json({ message: 'No se encontró el rol' });
        if (!permisoEncontrado) return res.status(404).json({ message: 'No se encontró el permiso' });

        const actualizado = await rol.actualizarRol(id, { $addToSet: { permisos: new mongoose.Types.ObjectId(permisoId) } });
        if (!actualizado) return res.status(404).json({ message: 'No se encontró el rol' });
        return res.status(200).json({ message: 'Permiso agregado al rol', rol: actualizado });
    } catch (error) {
        return responderError(res, error, 'Error al agregar el permiso al rol');
    }
}

export async function quitarPermisoDeRol(req, res) {
    try {
        const { id, permisoId } = req.params;
        if (!esObjectId(id) || !esObjectId(permisoId)) {
            return res.status(400).json({ message: 'El ID del rol o del permiso no es válido' });
        }

        const [encontrado, permisoEncontrado] = await Promise.all([
            rol.getRol({ _id: id }, { incluirPermisos: true }),
            permisoModel.getPermiso({ _id: permisoId })
        ]);
        if (!encontrado) return res.status(404).json({ message: 'No se encontró el rol' });
        if (!permisoEncontrado) return res.status(404).json({ message: 'No se encontró el permiso' });

        const permiso = new mongoose.Types.ObjectId(permisoId);
        const actualizado = await rol.actualizarRol(id, { $pull: { permisos: permiso } }, { permisos: permiso });
        if (!actualizado) {
            return res.status(404).json({ message: 'Ese permiso no estaba asignado al rol' });
        }
        return res.status(200).json({ message: 'Permiso retirado del rol', rol: actualizado });
    } catch (error) {
        return responderError(res, error, 'Error al quitar el permiso del rol');
    }
}
