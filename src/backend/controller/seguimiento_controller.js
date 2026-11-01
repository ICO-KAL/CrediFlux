import mongoose from 'mongoose';
import '../models/pago.js';
import '../models/desembolso.js';
import '../models/comision.js';
import '../models/incidencia_riesgo.js';
import '../models/notificacion.js';
import '../models/asignacion_pago.js';
import '../models/movimiento_tarjeta.js';
import '../models/autorizacion_tarjeta.js';
import '../models/transaccion_financiera.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

async function listarModelo(req, res, nombreModelo, claveRespuesta, mensajeError, filtrosPermitidos) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        for (const campo of filtrosPermitidos) {
            if (req.query[campo] !== undefined) {
                if (typeof req.query[campo] !== 'string') {
                    return res.status(400).json({ message: `El filtro ${campo} debe ser texto` });
                }
                if (campo.endsWith('Id') && !esObjectId(req.query[campo])) {
                    return res.status(400).json({ message: `El filtro ${campo} no es válido` });
                }
                if (campo === 'leida') {
                    if (!['true', 'false'].includes(req.query[campo])) {
                        return res.status(400).json({ message: 'El filtro leida debe ser true o false' });
                    }
                    filtro[campo] = req.query[campo] === 'true';
                } else {
                    filtro[campo] = req.query[campo];
                }
            }
        }
        const Modelo = mongoose.model(nombreModelo);
        const [items, total] = await Promise.all([
            Modelo.find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            Modelo.countDocuments(filtro)
        ]);
        return res.status(200).json({
            [claveRespuesta]: items,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, mensajeError);
    }
}

export const listarPagos = (req, res) =>
    listarModelo(req, res, 'Pago', 'pagos', 'Error al listar pagos', ['clienteId']);

export const listarDesembolsos = (req, res) =>
    listarModelo(req, res, 'Desembolso', 'desembolsos', 'Error al listar desembolsos', ['prestamoId']);

export const listarComisiones = (req, res) =>
    listarModelo(req, res, 'Comision', 'comisiones', 'Error al listar comisiones', ['prestamoId']);

export const listarIncidenciasRiesgo = (req, res) =>
    listarModelo(req, res, 'IncidenciaRiesgo', 'incidencias', 'Error al listar incidencias de riesgo', ['clienteId', 'nivelRiesgo']);

export const listarNotificaciones = (req, res) =>
    listarModelo(req, res, 'Notificacion', 'notificaciones', 'Error al listar notificaciones', ['clienteId', 'leida']);

export const listarAsignacionesPago = (req, res) =>
    listarModelo(req, res, 'AsignacionPago', 'asignaciones', 'Error al listar asignaciones de pago', ['pagoId', 'cuotaId']);

export const listarMovimientosTarjeta = (req, res) =>
    listarModelo(req, res, 'MovimientoTarjeta', 'movimientos', 'Error al listar movimientos de tarjeta', ['tarjetaId', 'tipoMovimiento']);

export const listarAutorizacionesTarjeta = (req, res) =>
    listarModelo(req, res, 'AutorizacionTarjeta', 'autorizaciones', 'Error al listar autorizaciones', ['tarjetaId', 'estadoAutorizacion']);

export const listarTransacciones = (req, res) =>
    listarModelo(req, res, 'TransaccionFinanciera', 'transacciones', 'Error al listar transacciones', ['referenciaId', 'tipoTransaccion']);

export async function marcarNotificacionLeida(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de notificación inválido' });
        const notificacion = await mongoose.model('Notificacion').findByIdAndUpdate(
            req.params.id, { $set: { leida: true } }, { new: true, runValidators: true }
        );
        if (!notificacion) return res.status(404).json({ message: 'Notificación no encontrada' });
        return res.status(200).json({ message: 'Notificación marcada como leída', notificacion });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar la notificación');
    }
}
