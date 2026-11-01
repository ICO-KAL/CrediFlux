import mongoose from 'mongoose';
import productos from '../models/producto_credito.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

function validarProducto(datos) {
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

export async function CrearProducto(req, res) {
    try {
        const datos = req.body ?? {};
        const error = validarProducto(datos);
        if (error) return res.status(400).json({ message: error });
        if (['nombre', 'tasaInteresAnual', 'plazoMaximosMeses', 'montoMinimo', 'montoMaximo'].some((campo) => datos[campo] === undefined)) {
            return res.status(400).json({ message: 'Todos los campos del producto son requeridos' });
        }
        if (datos.montoMaximo < datos.montoMinimo) return res.status(400).json({ message: 'El monto máximo debe ser mayor o igual al mínimo' });
        const producto = await productos.crearProductoCredito(datos);
        return res.status(201).json({ message: 'Producto creado', producto });
    } catch (error) {
        return responderError(res, error, 'Error al crear el producto');
    }
}

export async function listarProductos(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        const [items, total] = await Promise.all([
            mongoose.model('ProductoCredito').find(filtro).sort({ nombre: 1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('ProductoCredito').countDocuments(filtro)
        ]);
        return res.status(200).json({ productos: items, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar productos');
    }
}

export async function obtenerProducto(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de producto inválido' });
        const producto = await productos.getIdProductoCredito(req.params.id);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        return res.status(200).json({ producto });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el producto');
    }
}

export async function actualizarProducto(req, res) {
    try {
        const { id } = req.params;
        const datos = req.body ?? {};
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de producto inválido' });
        const error = validarProducto(datos);
        if (error) return res.status(400).json({ message: error });
        const actual = await productos.getIdProductoCredito(id);
        if (!actual) return res.status(404).json({ message: 'Producto no encontrado' });
        const minimo = datos.montoMinimo ?? actual.montoMinimo;
        const maximo = datos.montoMaximo ?? actual.montoMaximo;
        if (maximo < minimo) return res.status(400).json({ message: 'El monto máximo debe ser mayor o igual al mínimo' });
        const cambios = Object.fromEntries(Object.entries(datos).filter(([key]) =>
            ['nombre', 'tasaInteresAnual', 'plazoMaximosMeses', 'montoMinimo', 'montoMaximo'].includes(key)
        ));
        if (!Object.keys(cambios).length) return res.status(400).json({ message: 'No hay campos permitidos para actualizar' });
        const producto = await productos.actualizarProductoCredito(id, { $set: cambios });
        return res.status(200).json({ message: 'Producto actualizado', producto });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar el producto');
    }
}
