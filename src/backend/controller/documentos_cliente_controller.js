import mongoose from 'mongoose';
import documentos from '../models/documento_cliente.js';
import clientes from '../models/cliente.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function registrarDocumentoCliente(req, res) {
    try {
        const { clienteId, tipoDocumento, numeroDocumento, urlArchivo } = req.body ?? {};
        if (![clienteId, tipoDocumento, numeroDocumento, urlArchivo].every((valor) => typeof valor === 'string' && valor.trim())) {
            return res.status(400).json({ message: 'Faltan campos requeridos del documento' });
        }
        if (!esObjectId(clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
        if (!await clientes.getIdCliente(clienteId)) return res.status(404).json({ message: 'Cliente no encontrado' });
        if (!['cedula', 'pasaporte', 'licencia'].includes(tipoDocumento)) {
            return res.status(400).json({ message: 'Tipo de documento no permitido' });
        }
        const documento = await documentos.crearDocumentoCliente({
            clienteId, tipoDocumento, numeroDocumento, urlArchivo, verificado: false
        });
        return res.status(201).json({ message: 'Documento registrado para verificación', documento });
    } catch (error) {
        return responderError(res, error, 'Error al registrar el documento');
    }
}

export async function listarDocumentosCliente(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        if (req.query.verificado !== undefined) {
            if (!['true', 'false'].includes(req.query.verificado)) return res.status(400).json({ message: 'Filtro verificado inválido' });
            filtro.verificado = req.query.verificado === 'true';
        }
        const [documentosLista, total] = await Promise.all([
            mongoose.model('DocumentoCliente').find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('DocumentoCliente').countDocuments(filtro)
        ]);
        return res.status(200).json({ documentos: documentosLista, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar documentos');
    }
}

export async function verificarDocumentoCliente(req, res) {
    try {
        const { id } = req.params;
        const { verificado } = req.body ?? {};
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de documento inválido' });
        if (typeof verificado !== 'boolean') return res.status(400).json({ message: 'verificado debe ser booleano' });
        const documento = await mongoose.model('DocumentoCliente').findByIdAndUpdate(
            id, { $set: { verificado } }, { new: true, runValidators: true }
        );
        if (!documento) return res.status(404).json({ message: 'Documento no encontrado' });
        return res.status(200).json({ message: 'Estado de verificación actualizado', documento });
    } catch (error) {
        return responderError(res, error, 'Error al verificar el documento');
    }
}
