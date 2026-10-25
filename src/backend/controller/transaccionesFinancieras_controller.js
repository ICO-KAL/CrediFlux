import mongoose from 'mongoose';
import transaccion from '../models/transaccion_financiera.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function obtenerTransacciones(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.referenciaId !== undefined) {
            if (!esObjectId(req.query.referenciaId)) return res.status(400).json({ message: 'ID de referencia inválido' });
            filtro.referenciaId = req.query.referenciaId;
        }
        if (req.query.tipoTransaccion !== undefined) filtro.tipoTransaccion = req.query.tipoTransaccion;
        const [transacciones, total] = await Promise.all([
            mongoose.model('TransaccionFinanciera').find(filtro)
                .sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('TransaccionFinanciera').countDocuments(filtro)
        ]);
        return res.status(200).json({
            transacciones,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar transacciones financieras');
    }
}

export async function obtenerTransaccionesPorId(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de transacción inválido' });
        const transaccionEncontrada = await transaccion.getIdTransaccionFinanciera(id);
        if (!transaccionEncontrada) return res.status(404).json({ message: 'Transacción no encontrada' });
        return res.status(200).json({ transaccion: transaccionEncontrada });
    } catch (error) {
        return responderError(res, error, 'Error al obtener la transacción financiera');
    }
}

export async function crearTransacciones(req, res) {
    try {
        const { referenciaId, tipoTransaccion, monto, moneda } = req.body ?? {};
        if (!esObjectId(referenciaId)) return res.status(400).json({ message: 'ID de referencia inválido' });
        if (typeof tipoTransaccion !== 'string' || !tipoTransaccion.trim() || tipoTransaccion.length > 100) {
            return res.status(400).json({ message: 'Tipo de transacción inválido' });
        }
        if (typeof monto !== 'number' || !Number.isFinite(monto) || monto <= 0) {
            return res.status(400).json({ message: 'El monto debe ser mayor que cero' });
        }
        if (moneda !== undefined &&
            (typeof moneda !== 'string' || !/^[A-Za-z]{3}$/.test(moneda.trim()))) {
            return res.status(400).json({ message: 'La moneda debe usar un código de tres letras' });
        }
        const creada = await transaccion.crearTransaccionFinanciera({
            referenciaId, tipoTransaccion: tipoTransaccion.trim(), monto, moneda
        });
        return res.status(201).json({ message: 'Transacción registrada', transaccion: creada });
    } catch (error) {
        return responderError(res, error, 'Error al registrar la transacción');
    }
}

export async function actualizarTransaccion(req, res) {
    return res.status(405).json({ message: 'Las transacciones financieras son inmutables; registra una reversión' });
}

export async function eliminarTransaccion(req, res) {
    return res.status(405).json({ message: 'Las transacciones financieras no se eliminan; registra una reversión' });
}
