import mongoose from 'mongoose';
import consentimientos from '../models/consentimiento.js';
import clientes from '../models/cliente.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function registrarConsentimiento(req, res) {
    try {
        const { clienteId, tipoConsentimiento, aceptado } = req.body ?? {};
        if (!esObjectId(clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
        if (typeof tipoConsentimiento !== 'string' || !tipoConsentimiento.trim() || typeof aceptado !== 'boolean') {
            return res.status(400).json({ message: 'Tipo de consentimiento y respuesta booleana son requeridos' });
        }
        if (!await clientes.getIdCliente(clienteId)) return res.status(404).json({ message: 'Cliente no encontrado' });
        const consentimiento = await consentimientos.crearConsentimiento({ clienteId, tipoConsentimiento, aceptado });
        return res.status(201).json({ message: 'Consentimiento registrado', consentimiento });
    } catch (error) {
        return responderError(res, error, 'Error al registrar consentimiento');
    }
}

export async function listarConsentimientos(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        const [items, total] = await Promise.all([
            mongoose.model('Consentimiento').find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Consentimiento').countDocuments(filtro)
        ]);
        return res.status(200).json({ consentimientos: items, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar consentimientos');
    }
}
