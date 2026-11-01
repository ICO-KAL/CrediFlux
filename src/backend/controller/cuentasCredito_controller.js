import mongoose from 'mongoose';
import '../models/cuenta_credito.js';
import '../models/estado_cuenta.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function listarCuentasCredito(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        if (req.query.estado !== undefined) filtro.estado = req.query.estado;
        const [cuentas, total] = await Promise.all([
            mongoose.model('CuentaCredito').find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('CuentaCredito').countDocuments(filtro)
        ]);
        return res.status(200).json({ cuentas, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar cuentas de crédito');
    }
}

export async function obtenerCuentaCredito(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de cuenta inválido' });
        const cuenta = await mongoose.model('CuentaCredito').findById(req.params.id);
        if (!cuenta) return res.status(404).json({ message: 'Cuenta de crédito no encontrada' });
        return res.status(200).json({ cuenta });
    } catch (error) {
        return responderError(res, error, 'Error al obtener la cuenta de crédito');
    }
}

export async function listarEstadosCuenta(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        if (req.query.periodo !== undefined) filtro.periodo = String(req.query.periodo);
        const [estados, total] = await Promise.all([
            mongoose.model('EstadoCuenta').find(filtro).sort({ periodo: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('EstadoCuenta').countDocuments(filtro)
        ]);
        return res.status(200).json({ estadosCuenta: estados, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar estados de cuenta');
    }
}

export async function obtenerEstadoCuenta(req, res) {
    try {
        const { clienteId, periodo } = req.params;
        if (!esObjectId(clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
        const estadoCuenta = await mongoose.model('EstadoCuenta').findOne({ clienteId, periodo });
        if (!estadoCuenta) return res.status(404).json({ message: 'Estado de cuenta no encontrado' });
        return res.status(200).json({ estadoCuenta });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el estado de cuenta');
    }
}
