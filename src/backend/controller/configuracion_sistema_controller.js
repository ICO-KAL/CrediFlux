import mongoose from 'mongoose';
import '../models/configuracion_sistema.js';
import { esObjectId, responderError, validarCamposTexto, validarPaginacion } from '../helpers/controlador.js';

const claveUmbralAprobacion = 'montoMaximoAprobacionAnalista';

function valorUmbralValido(claveConfig, valorConfig) {
    if (claveConfig !== claveUmbralAprobacion) return true;
    const monto = Number(valorConfig);
    return Number.isFinite(monto) && monto >= 0;
}

export async function listarConfiguraciones(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const [configuraciones, total] = await Promise.all([
            mongoose.model('ConfiguracionSistema').find().sort({ claveConfig: 1 })
                .skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('ConfiguracionSistema').countDocuments()
        ]);
        return res.status(200).json({
            configuraciones,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar configuraciones');
    }
}

export async function obtenerConfiguracion(req, res) {
    try {
        const { clave } = req.params;
        if (typeof clave !== 'string' || !clave.trim()) {
            return res.status(400).json({ message: 'La clave de configuración es inválida' });
        }
        const configuracion = await mongoose.model('ConfiguracionSistema').findOne({ claveConfig: clave.trim() });
        if (!configuracion) return res.status(404).json({ message: 'Configuración no encontrada' });
        return res.status(200).json({ configuracion });
    } catch (error) {
        return responderError(res, error, 'Error al obtener la configuración');
    }
}

export async function crearConfiguracion(req, res) {
    try {
        const { claveConfig, valorConfig } = req.body ?? {};
        if (typeof claveConfig !== 'string' || !claveConfig.trim() || claveConfig.trim().length > 100 ||
            typeof valorConfig !== 'string' || !valorConfig.trim() || valorConfig.trim().length > 5000) {
            return res.status(400).json({ message: 'claveConfig y valorConfig son requeridos y deben respetar sus límites' });
        }
        if (!valorUmbralValido(claveConfig.trim(), valorConfig.trim())) {
            return res.status(400).json({ message: 'El umbral de aprobación debe ser un monto numérico no negativo' });
        }
        const configuracion = await mongoose.model('ConfiguracionSistema').create({
            claveConfig: claveConfig.trim(),
            valorConfig: valorConfig.trim()
        });
        return res.status(201).json({ message: 'Configuración creada', configuracion });
    } catch (error) {
        return responderError(res, error, 'Error al crear la configuración');
    }
}

export async function actualizarConfiguracion(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de configuración inválido' });
        const { claveConfig, valorConfig } = req.body ?? {};
        const { cambios, error } = validarCamposTexto([
            ['claveConfig', claveConfig, 100],
            ['valorConfig', valorConfig, 5000]
        ]);
        if (error) return res.status(400).json({ message: error });
        if (!Object.keys(cambios).length) return res.status(400).json({ message: 'Indica campos para actualizar' });
        const existente = await mongoose.model('ConfiguracionSistema').findById(id);
        if (!existente) return res.status(404).json({ message: 'Configuración no encontrada' });
        const claveFinal = cambios.claveConfig ?? existente.claveConfig;
        const valorFinal = cambios.valorConfig ?? existente.valorConfig;
        if (!valorUmbralValido(claveFinal, valorFinal)) {
            return res.status(400).json({ message: 'El umbral de aprobación debe ser un monto numérico no negativo' });
        }

        const configuracion = await mongoose.model('ConfiguracionSistema').findByIdAndUpdate(
            id, { $set: cambios }, { new: true, runValidators: true }
        );
        if (!configuracion) return res.status(404).json({ message: 'Configuración no encontrada' });
        return res.status(200).json({ message: 'Configuración actualizada', configuracion });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar la configuración');
    }
}

export async function eliminarConfiguracion(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de configuración inválido' });
        const configuracion = await mongoose.model('ConfiguracionSistema').findByIdAndDelete(req.params.id);
        if (!configuracion) return res.status(404).json({ message: 'Configuración no encontrada' });
        return res.status(200).json({ message: 'Configuración eliminada' });
    } catch (error) {
        return responderError(res, error, 'Error al eliminar la configuración');
    }
}
