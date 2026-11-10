import mongoose from 'mongoose';
import permisoModel from '../models/permiso.js';

export function esObjectId(id) {
    return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

export function validarPaginacion(query) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        return null;
    }
    return { page, limit, skip: (page - 1) * limit };
}

export function validarCamposTexto(campos) {
    const cambios = {};
    for (const [campo, valor, maximo] of campos) {
        if (valor === undefined) continue;
        if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > maximo) {
            return { error: `${campo} debe ser texto no vacío de hasta ${maximo} caracteres` };
        }
        cambios[campo] = valor.trim();
    }
    return { cambios };
}

export async function validarPermisos(permisos) {
    if (!Array.isArray(permisos) || permisos.some((id) => !esObjectId(id))) {
        return false;
    }

    const permisosUnicos = [...new Set(permisos)];
    const encontrados = await Promise.all(
        permisosUnicos.map((id) => permisoModel.getPermiso({ _id: id }))
    );
    return encontrados.every(Boolean);
}

export function responderError(res, error, mensaje, { soloInterno = false } = {}) {
    if (!soloInterno && error?.code === 11000) {
        return res.status(409).json({ message: 'Ya existe un registro con esos datos únicos' });
    }
    if (!soloInterno && (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError)) {
        return res.status(400).json({ message: 'Los datos enviados no son válidos' });
    }
    console.error(mensaje, error);
    return res.status(500).json({ message: mensaje });
}

export function validarProducto(datos) {
    const { nombre, tasaInteresAnual, plazoMaximosMeses, montoMinimo, montoMaximo } = datos;
    if (nombre !== undefined && (typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 150)) {
        return 'Nombre inválido';
    }
    if (tasaInteresAnual !== undefined && (typeof tasaInteresAnual !== 'number' || !Number.isFinite(tasaInteresAnual) || tasaInteresAnual < 0)) {
        return 'La tasa anual debe ser un número mayor o igual a cero';
    }
    if (plazoMaximosMeses !== undefined && (!Number.isInteger(plazoMaximosMeses) || plazoMaximosMeses < 1)) {
        return 'El plazo máximo debe ser un entero mayor que cero';
    }
    if (montoMinimo !== undefined && (typeof montoMinimo !== 'number' || !Number.isFinite(montoMinimo) || montoMinimo < 0)) {
        return 'El monto mínimo debe ser un número no negativo';
    }
    if (montoMaximo !== undefined && (typeof montoMaximo !== 'number' || !Number.isFinite(montoMaximo) || montoMaximo < 0)) {
        return 'El monto máximo debe ser un número no negativo';
    }
    return null;
}

export function errorPlanAmortizacion(mensaje) {
    const error = new Error(mensaje);
    error.status = 409;
    return error;
}

export function sumarMesesConTope(fecha, meses) {
    const anio = fecha.getUTCFullYear();
    const mesObjetivo = fecha.getUTCMonth() + meses;
    const ultimoDia = new Date(Date.UTC(anio, mesObjetivo + 1, 0)).getUTCDate();
    const dia = Math.min(fecha.getUTCDate(), ultimoDia);
    return new Date(Date.UTC(
        anio,
        mesObjetivo,
        dia,
        fecha.getUTCHours(),
        fecha.getUTCMinutes(),
        fecha.getUTCSeconds(),
        fecha.getUTCMilliseconds()
    ));
}

export const expiracionIdempotenciaMs = 24 * 60 * 60 * 1000;

export const tiposCuenta = ['activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto'];
