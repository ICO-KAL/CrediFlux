import mongoose from 'mongoose';
import tarjetaCredito from '../models/tarjeta_credito.js';
import clientes from '../models/cliente.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function insertarTarjeta(req, res) {
    try {
        const { clienteId, numeroEnmascarado, limiteCredito, saldoDisponible, fechaExpiracion } = req.body ?? {};
        if (![clienteId, numeroEnmascarado, fechaExpiracion].every((valor) =>
            typeof valor === 'string' && valor.trim())) {
            return res.status(400).json({ message: 'Cliente, número enmascarado y fecha de expiración son requeridos' });
        }
        if (!esObjectId(clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
        if (!await clientes.getIdCliente(clienteId)) return res.status(404).json({ message: 'Cliente no encontrado' });
        if (typeof limiteCredito !== 'number' || !Number.isFinite(limiteCredito) || limiteCredito < 0 ||
            typeof saldoDisponible !== 'number' || !Number.isFinite(saldoDisponible) ||
            saldoDisponible < 0 || saldoDisponible > limiteCredito) {
            return res.status(400).json({ message: 'Límite o saldo disponible inválido' });
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaExpiracion)) {
            return res.status(400).json({ message: 'La fecha debe tener formato MM/AA' });
        }
        const tarjeta = await tarjetaCredito.crearTarjeta_credito({
            clienteId, numeroEnmascarado, limiteCredito, saldoDisponible, fechaExpiracion
        });
        return res.status(201).json({ message: 'Tarjeta registrada', tarjeta });
    } catch (error) {
        return responderError(res, error, 'Error al registrar la tarjeta');
    }
}

export async function obtenerTodasTarjetas(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        if (req.query.estado !== undefined) filtro.estado = req.query.estado;
        const [tarjetas, total] = await Promise.all([
            mongoose.model('TarjetaCredito').find(filtro)
                .sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('TarjetaCredito').countDocuments(filtro)
        ]);
        return res.status(200).json({ tarjetas, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar tarjetas');
    }
}

export async function obtenerTarjetaId(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de tarjeta inválido' });
        const tarjeta = await tarjetaCredito.getTarjeta_credito(id);
        if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
        return res.status(200).json({ tarjeta });
    } catch (error) {
        return responderError(res, error, 'Error al obtener la tarjeta');
    }
}

export async function actualizarTarjeta(req, res) {
    try {
        const { id } = req.params;
        const { numeroEnmascarado, fechaExpiracion } = req.body ?? {};
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de tarjeta inválido' });
        const cambios = {};
        if (numeroEnmascarado !== undefined) {
            if (typeof numeroEnmascarado !== 'string' || !numeroEnmascarado.trim() || numeroEnmascarado.length > 25) {
                return res.status(400).json({ message: 'Número enmascarado inválido' });
            }
            cambios.numeroEnmascarado = numeroEnmascarado.trim();
        }
        if (fechaExpiracion !== undefined) {
            if (typeof fechaExpiracion !== 'string' || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaExpiracion)) {
                return res.status(400).json({ message: 'La fecha debe tener formato MM/AA' });
            }
            cambios.fechaExpiracion = fechaExpiracion;
        }
        if (!Object.keys(cambios).length) return res.status(400).json({ message: 'Solo se permite actualizar número enmascarado o vencimiento' });
        const tarjeta = await tarjetaCredito.actualizarTarjeta_credito(id, { $set: cambios });
        if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
        return res.status(200).json({ message: 'Tarjeta actualizada', tarjeta });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar la tarjeta');
    }
}

export async function eliminarTarjeta(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de tarjeta inválido' });
        const tarjeta = await tarjetaCredito.actualizarTarjeta_credito(id, { $set: { estado: 'cancelada' } });
        if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
        return res.status(200).json({ message: 'Tarjeta cancelada', tarjeta });
    } catch (error) {
        return responderError(res, error, 'Error al cancelar la tarjeta');
    }
}
