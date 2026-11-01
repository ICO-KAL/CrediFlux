import mongoose from 'mongoose';
import direcciones from '../models/direccion.js';
import clientes from '../models/cliente.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function crearDireccion(req, res) {
    try {
        const { clienteId, calle, ciudad, provincia } = req.body ?? {};
        if (![clienteId, calle, ciudad, provincia].every((valor) => typeof valor === 'string' && valor.trim())) {
            return res.status(400).json({ message: 'clienteId, calle, ciudad y provincia son requeridos' });
        }
        if (!esObjectId(clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
        if (!await clientes.getIdCliente(clienteId)) return res.status(404).json({ message: 'Cliente no encontrado' });
        const direccion = await direcciones.crearDireccion(req.body);
        return res.status(201).json({ message: 'Dirección creada', direccion });
    } catch (error) {
        return responderError(res, error, 'Error al crear la dirección');
    }
}

export async function listarDirecciones(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        const [items, total] = await Promise.all([
            mongoose.model('Direccion').find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Direccion').countDocuments(filtro)
        ]);
        return res.status(200).json({ direcciones: items, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar direcciones');
    }
}

export async function obtenerDireccion(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de dirección inválido' });
        const direccion = await direcciones.getIdDireccion(req.params.id);
        if (!direccion) return res.status(404).json({ message: 'Dirección no encontrada' });
        return res.status(200).json({ direccion });
    } catch (error) {
        return responderError(res, error, 'Error al obtener la dirección');
    }
}

export async function actualizarDireccion(req, res) {
    try {
        const { id } = req.params;
        const { calle, numero, ciudad, provincia, codigoPostal, pais } = req.body ?? {};
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de dirección inválido' });
        const cambios = {};
        for (const [campo, valor] of Object.entries({ calle, numero, ciudad, provincia, codigoPostal, pais })) {
            if (valor !== undefined) {
                if (typeof valor !== 'string' || !valor.trim()) return res.status(400).json({ message: `${campo} debe ser texto no vacío` });
                cambios[campo] = valor.trim();
            }
        }
        if (!Object.keys(cambios).length) return res.status(400).json({ message: 'Indica campos para actualizar' });
        const direccion = await direcciones.actualizarDireccion(id, { $set: cambios }, { runValidators: true });
        if (!direccion) return res.status(404).json({ message: 'Dirección no encontrada' });
        return res.status(200).json({ message: 'Dirección actualizada', direccion });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar la dirección');
    }
}

export async function eliminarDireccion(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de dirección inválido' });
        const direccion = await direcciones.eliminarDireccion(req.params.id);
        if (!direccion) return res.status(404).json({ message: 'Dirección no encontrada' });
        return res.status(200).json({ message: 'Dirección eliminada' });
    } catch (error) {
        return responderError(res, error, 'Error al eliminar la dirección');
    }
}
