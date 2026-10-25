import mongoose from 'mongoose';
import clientes from '../models/cliente.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function crearCliente(req, res) {
    try {
        const { nombres, apellidos, email, telefono, fechaNacimiento } = req.body ?? {};
        if (![nombres, apellidos, email, telefono, fechaNacimiento].every((valor) =>
            typeof valor === 'string' && valor.trim().length > 0)) {
            return res.status(400).json({ message: 'Nombres, apellidos, email, teléfono y fecha de nacimiento son requeridos' });
        }
        const fecha = new Date(fechaNacimiento);
        if (Number.isNaN(fecha.getTime()) || fecha > new Date()) {
            return res.status(400).json({ message: 'La fecha de nacimiento no es válida' });
        }
        const cliente = await clientes.crearCliente({
            nombres, apellidos, email, telefono, fechaNacimiento: fecha
        });
        return res.status(201).json({ message: 'Cliente creado', cliente });
    } catch (error) {
        return responderError(res, error, 'Error al crear el cliente');
    }
}

export async function listarClientes(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida (page >= 1 y limit entre 1 y 100)' });
        const filtro = {};
        if (req.query.estado) filtro.estado = req.query.estado;
        const [clientesLista, total] = await Promise.all([
            mongoose.model('Cliente').find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Cliente').countDocuments(filtro)
        ]);
        return res.status(200).json({
            clientes: clientesLista,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar clientes');
    }
}

export async function obtenerCliente(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de cliente inválido' });
        const cliente = await clientes.getIdCliente(req.params.id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
        return res.status(200).json({ cliente });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el cliente');
    }
}

export async function actualizarCliente(req, res) {
    try {
        const { id } = req.params;
        const { nombres, apellidos, email, telefono, fechaNacimiento, estado } = req.body ?? {};
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de cliente inválido' });
        const cambios = {};
        for (const [campo, valor] of Object.entries({ nombres, apellidos, email, telefono, estado })) {
            if (valor !== undefined) {
                if (typeof valor !== 'string' || !valor.trim()) return res.status(400).json({ message: `${campo} debe ser texto no vacío` });
                cambios[campo] = valor.trim();
            }
        }
        if (fechaNacimiento !== undefined) {
            const fecha = new Date(fechaNacimiento);
            if (Number.isNaN(fecha.getTime()) || fecha > new Date()) return res.status(400).json({ message: 'La fecha de nacimiento no es válida' });
            cambios.fechaNacimiento = fecha;
        }
        if (!Object.keys(cambios).length) return res.status(400).json({ message: 'Indica campos para actualizar' });
        const cliente = await mongoose.model('Cliente').findByIdAndUpdate(id, { $set: cambios }, { new: true, runValidators: true });
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
        return res.status(200).json({ message: 'Cliente actualizado', cliente });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar el cliente');
    }
}
