import mongoose from 'mongoose';
import clientes from '../models/cliente.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

const nivelesRiesgo = ['bajo', 'medio', 'alto', 'critico'];

export async function crearIncidenciaRiesgo(req, res) {
    try {
        const { clienteId, nivelRiesgo, descripcion } = req.body ?? {};
        if (!esObjectId(clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
        if (!nivelesRiesgo.includes(nivelRiesgo)) return res.status(400).json({ message: 'Nivel de riesgo inválido' });
        if (typeof descripcion !== 'string' || !descripcion.trim() || descripcion.trim().length > 3000) {
            return res.status(400).json({ message: 'La descripción es requerida y no puede superar 3000 caracteres' });
        }
        if (!await clientes.getIdCliente(clienteId)) return res.status(404).json({ message: 'Cliente no encontrado' });
        const incidencia = await mongoose.model('IncidenciaRiesgo').create({
            clienteId, nivelRiesgo, descripcion: descripcion.trim()
        });
        return res.status(201).json({ message: 'Incidencia de riesgo registrada', incidencia });
    } catch (error) {
        return responderError(res, error, 'Error al registrar la incidencia de riesgo');
    }
}

export async function listarIncidenciasRiesgo(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        if (req.query.nivelRiesgo !== undefined) {
            if (!nivelesRiesgo.includes(req.query.nivelRiesgo)) return res.status(400).json({ message: 'Nivel de riesgo inválido' });
            filtro.nivelRiesgo = req.query.nivelRiesgo;
        }
        const [incidencias, total] = await Promise.all([
            mongoose.model('IncidenciaRiesgo').find(filtro)
                .sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('IncidenciaRiesgo').countDocuments(filtro)
        ]);
        return res.status(200).json({
            incidencias,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar incidencias de riesgo');
    }
}
