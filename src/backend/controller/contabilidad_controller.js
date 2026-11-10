import mongoose from 'mongoose';
import '../models/asiento_contable.js';
import '../models/cuenta_contable.js';
import '../models/movimiento_contable.js';
import { esObjectId, responderError, validarCamposTexto, validarPaginacion, tiposCuenta } from '../helpers/controlador.js';


export async function listarCuentasContables(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.tipo !== undefined) {
            if (!tiposCuenta.includes(req.query.tipo)) return res.status(400).json({ message: 'Tipo de cuenta inválido' });
            filtro.tipo = req.query.tipo;
        }
        const [cuentas, total] = await Promise.all([
            mongoose.model('CuentaContable').find(filtro).sort({ codigo: 1 })
                .skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('CuentaContable').countDocuments(filtro)
        ]);
        return res.status(200).json({
            cuentas,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar cuentas contables');
    }
}

export async function crearCuentaContable(req, res) {
    try {
        const { codigo, nombre, tipo } = req.body ?? {};
        if (typeof codigo !== 'string' || !codigo.trim() || codigo.trim().length > 30 ||
            typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 150 ||
            !tiposCuenta.includes(tipo)) {
            return res.status(400).json({ message: 'Código, nombre y tipo de cuenta válidos son requeridos' });
        }
        const cuenta = await mongoose.model('CuentaContable').create({
            codigo: codigo.trim(), nombre: nombre.trim(), tipo
        });
        return res.status(201).json({ message: 'Cuenta contable creada', cuenta });
    } catch (error) {
        return responderError(res, error, 'Error al crear la cuenta contable');
    }
}

export async function actualizarCuentaContable(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de cuenta inválido' });
        const { codigo, nombre, tipo } = req.body ?? {};
        const { cambios, error } = validarCamposTexto([['codigo', codigo, 30], ['nombre', nombre, 150]]);
        if (error) return res.status(400).json({ message: error });
        if (tipo !== undefined) {
            if (!tiposCuenta.includes(tipo)) return res.status(400).json({ message: 'Tipo de cuenta inválido' });
            cambios.tipo = tipo;
        }
        if (!Object.keys(cambios).length) return res.status(400).json({ message: 'Indica campos para actualizar' });
        const cuenta = await mongoose.model('CuentaContable').findByIdAndUpdate(
            id, { $set: cambios }, { new: true, runValidators: true }
        );
        if (!cuenta) return res.status(404).json({ message: 'Cuenta contable no encontrada' });
        return res.status(200).json({ message: 'Cuenta contable actualizada', cuenta });
    } catch (error) {
        return responderError(res, error, 'Error al actualizar la cuenta contable');
    }
}

export async function eliminarCuentaContable(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectId(id)) return res.status(400).json({ message: 'ID de cuenta inválido' });
        const cuenta = await mongoose.model('CuentaContable').findById(id);
        if (!cuenta) return res.status(404).json({ message: 'Cuenta contable no encontrada' });
        if (await mongoose.model('MovimientoContable').exists({ cuentaContableId: id })) {
            return res.status(409).json({ message: 'No se puede eliminar una cuenta con movimientos contables' });
        }
        await cuenta.deleteOne();
        return res.status(200).json({ message: 'Cuenta contable eliminada' });
    } catch (error) {
        return responderError(res, error, 'Error al eliminar la cuenta contable');
    }
}

export async function listarAsientosContables(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.referencia !== undefined) {
            if (typeof req.query.referencia !== 'string') return res.status(400).json({ message: 'La referencia debe ser texto' });
            filtro.referencia = req.query.referencia.trim();
        }
        const [asientos, total] = await Promise.all([
            mongoose.model('AsientoContable').find(filtro).sort({ fecha: -1, createdAt: -1 })
                .skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('AsientoContable').countDocuments(filtro)
        ]);
        return res.status(200).json({
            asientos,
            paginacion: { page: paginacion.page, limit: paginacion.limit, total }
        });
    } catch (error) {
        return responderError(res, error, 'Error al listar asientos contables');
    }
}

export async function obtenerAsientoContable(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de asiento inválido' });
        const asiento = await mongoose.model('AsientoContable').findById(req.params.id);
        if (!asiento) return res.status(404).json({ message: 'Asiento contable no encontrado' });
        const movimientos = await mongoose.model('MovimientoContable').find({ asientoId: asiento._id })
            .populate('cuentaContableId');
        return res.status(200).json({ asiento, movimientos });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el asiento contable');
    }
}

export async function crearAsientoContable(req, res) {
    let session;
    try {
        const { descripcion, fecha, referencia, movimientos } = req.body ?? {};
        if (typeof descripcion !== 'string' || !descripcion.trim() || descripcion.trim().length > 500) {
            return res.status(400).json({ message: 'La descripción es requerida y no puede superar 500 caracteres' });
        }
        if (referencia !== undefined && (typeof referencia !== 'string' || referencia.length > 150)) {
            return res.status(400).json({ message: 'La referencia debe ser texto de hasta 150 caracteres' });
        }
        const fechaAsiento = fecha === undefined ? new Date() : new Date(fecha);
        if (Number.isNaN(fechaAsiento.getTime())) return res.status(400).json({ message: 'La fecha del asiento no es válida' });
        if (!Array.isArray(movimientos) || movimientos.length < 2 ||
            movimientos.some((movimiento) => !movimiento || !esObjectId(movimiento.cuentaContableId) ||
                typeof movimiento.debito !== 'number' || !Number.isFinite(movimiento.debito) || movimiento.debito < 0 ||
                typeof movimiento.credito !== 'number' || !Number.isFinite(movimiento.credito) || movimiento.credito < 0 ||
                ((movimiento.debito > 0) === (movimiento.credito > 0)))) {
            return res.status(400).json({ message: 'Incluye al menos dos movimientos válidos, con débito o crédito en cada uno' });
        }
        const importes = movimientos.flatMap(({ debito, credito }) => [debito, credito]);
        if (importes.some((monto) => Math.abs(monto * 100 - Math.round(monto * 100)) > 1e-8)) {
            return res.status(400).json({ message: 'Los importes deben tener un máximo de dos decimales' });
        }
        const totalDebitos = movimientos.reduce((total, movimiento) => total + Math.round(movimiento.debito * 100), 0);
        const totalCreditos = movimientos.reduce((total, movimiento) => total + Math.round(movimiento.credito * 100), 0);
        if (totalDebitos === 0 || totalDebitos !== totalCreditos) {
            return res.status(400).json({ message: 'El asiento debe tener débitos y créditos iguales mayores que cero' });
        }

        session = await mongoose.startSession();
        let asiento;
        let movimientosCreados;
        await session.withTransaction(async () => {
            const cuentaIds = [...new Set(movimientos.map((movimiento) => movimiento.cuentaContableId))];
            const cuentasExistentes = await mongoose.model('CuentaContable').countDocuments({
                _id: { $in: cuentaIds }
            }).session(session);
            if (cuentasExistentes !== cuentaIds.length) {
                const error = new Error('Una o más cuentas contables no existen');
                error.status = 404;
                throw error;
            }

            [asiento] = await mongoose.model('AsientoContable').create([{
                descripcion: descripcion.trim(),
                fecha: fechaAsiento,
                referencia: referencia?.trim()
            }], { session });
            movimientosCreados = await mongoose.model('MovimientoContable').create(
                movimientos.map(({ cuentaContableId, debito, credito }) => ({
                    asientoId: asiento._id, cuentaContableId, debito, credito
                })),
                { session }
            );
        });
        return res.status(201).json({ message: 'Asiento contable creado', asiento, movimientos: movimientosCreados });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return responderError(res, error, 'Error al crear el asiento contable');
    } finally {
        await session?.endSession();
    }
}
