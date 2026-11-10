import mongoose from 'mongoose';
import '../models/creadiflux.js';
import { esObjectId, responderError, validarCamposTexto, validarPaginacion } from '../helpers/controlador.js';

export async function listarModulosCrediflux(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.nombreModulo !== undefined) {
            if (typeof req.query.nombreModulo !== 'string' || !req.query.nombreModulo.trim()) {
                return res.status(400).json({ message: 'El nombre del módulo debe ser texto no vacío' });
            }
            filtro.nombreModulo = req.query.nombreModulo.trim();
        }
        const [modulos, total] = await Promise.all([
            mongoose.model('Creadiflux').find(filtro).sort({ nombreModulo: 1, version: -1 })
                .skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Creadiflux').countDocuments(filtro)
        ]);
        return res.status(200).json({
            modulos,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar módulos CrediFlux');
    }
}

export async function registrarModuloCrediflux(req, res) {
    try {
        const { nombreModulo, version, parametros } = req.body ?? {};
        if (typeof nombreModulo !== 'string' || !nombreModulo.trim() || nombreModulo.trim().length > 100 ||
            typeof version !== 'string' || !version.trim() || version.trim().length > 50) {
            return res.status(400).json({ message: 'Nombre del módulo y versión son requeridos y deben respetar sus límites' });
        }
        if (parametros !== undefined && (parametros === null || typeof parametros !== 'object' || Array.isArray(parametros))) {
            return res.status(400).json({ message: 'Los parámetros deben ser un objeto' });
        }
        const modulo = await mongoose.model('Creadiflux').create({
            nombreModulo: nombreModulo.trim(),
            version: version.trim(),
            parametros
        });
        return res.status(201).json({ message: 'Módulo CrediFlux registrado', modulo });
    } catch (error) {
        return responderError(res, error, 'Error al registrar el módulo CrediFlux');
    }
}

export async function actualizarModuloCrediflux(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de módulo inválido' });
        const { nombreModulo, version, parametros } = req.body ?? {};
        const { cambios, error } = validarCamposTexto([
            ['nombreModulo', nombreModulo, 100],
            ['version', version, 50]
        ]);
        if (error) return res.status(400).json({ message: error });
        if (parametros !== undefined) {
            if (parametros === null || typeof parametros !== 'object' || Array.isArray(parametros)) {
                return res.status(400).json({ message: 'Los parámetros deben ser un objeto' });
            }
            cambios.parametros = parametros;
        }
        if (!Object.keys(cambios).length) return res.status(400).json({ message: 'Indica campos para actualizar' });
        const modulo = await mongoose.model('Creadiflux').findByIdAndUpdate(
            id, { $set: cambios }, { new: true, runValidators: true }
        );
        if (!modulo) return res.status(404).json({ message: 'Módulo CrediFlux no encontrado' });
        return res.status(200).json({ message: 'Módulo CrediFlux actualizado', modulo });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar el módulo CrediFlux');
    }
}

export async function eliminarModuloCrediflux(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de módulo inválido' });
        const modulo = await mongoose.model('Creadiflux').findByIdAndDelete(req.params.id);
        if (!modulo) return res.status(404).json({ message: 'Módulo CrediFlux no encontrado' });
        return res.status(200).json({ message: 'Módulo CrediFlux eliminado' });
    } catch (error) {
        return responderError(res, error, 'Error al eliminar el módulo CrediFlux');
    }
}
