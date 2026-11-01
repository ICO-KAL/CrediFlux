import mongoose from 'mongoose';
import '../models/desembolso.js';
import '../models/prestamo.js';
import '../models/cuota.js';
import '../models/plan_amortizacion.js';
import '../models/transaccion_financiera.js';
import { esObjectId, responderError } from '../helpers/controlador.js';
import * as seguimiento from './seguimiento_controller.js';

export const listarDesembolsos = seguimiento.listarDesembolsos;

function errorPlanAmortizacion(mensaje) {
    const error = new Error(mensaje);
    error.status = 409;
    return error;
}

function sumarMesesConTope(fecha, meses) {
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

export function crearCuotasFrancesas(prestamo, tasaAnual, fechaPrimerPago) {
    const principalCentavos = Math.round(prestamo.montoPrincipal * 100);
    const cantidadCuotas = prestamo.plazoMeses;
    const tasaMensual = tasaAnual / 100 / 12;
    const cuotaRegularCentavos = tasaMensual === 0
        ? Math.round(principalCentavos / cantidadCuotas)
        : Math.round(
            ((principalCentavos / 100) * tasaMensual /
                (1 - (1 + tasaMensual) ** -cantidadCuotas)) * 100
        );

    if (!Number.isSafeInteger(principalCentavos) || principalCentavos <= 0 ||
        !Number.isSafeInteger(cuotaRegularCentavos) || cuotaRegularCentavos <= 0) {
        throw errorPlanAmortizacion('El principal o la cuota calculada están fuera del rango monetario permitido');
    }

    let saldoCentavos = principalCentavos;
    const cuotas = [];
    for (let indice = 0; indice < cantidadCuotas; indice += 1) {
        const interesCentavos = Math.round(saldoCentavos * tasaMensual);
        const capitalCentavos = indice === cantidadCuotas - 1
            ? saldoCentavos
            : cuotaRegularCentavos - interesCentavos;

        if (!Number.isSafeInteger(interesCentavos) || interesCentavos < 0 ||
            capitalCentavos <= 0 || capitalCentavos > saldoCentavos) {
            throw errorPlanAmortizacion('La cuota no amortiza el principal; revisa la tasa y el plazo');
        }

        const fechaVencimiento = sumarMesesConTope(fechaPrimerPago, indice);
        const montoCapital = capitalCentavos / 100;
        const montoInteres = interesCentavos / 100;
        cuotas.push({
            _id: new mongoose.Types.ObjectId(),
            prestamoId: prestamo._id,
            numeroCuota: indice + 1,
            montoCapital,
            montoInteres,
            montoTotal: (capitalCentavos + interesCentavos) / 100,
            fechaVencimiento,
            estado: 'pendiente'
        });
        saldoCentavos -= capitalCentavos;
    }

    if (saldoCentavos !== 0) throw errorPlanAmortizacion('El plan no amortiza el principal completo');
    return cuotas;
}

export async function registrarDesembolso(req, res) {
    let session;
    try {
        session = await mongoose.startSession();
        const { prestamoId, montoDesembolsado, metodoPago, referenciaBancaria, fechaPrimerPago } = req.body ?? {};
        if (!esObjectId(prestamoId)) return res.status(400).json({ message: 'ID de préstamo inválido' });
        if (typeof montoDesembolsado !== 'number' || !Number.isFinite(montoDesembolsado) || montoDesembolsado <= 0) {
            return res.status(400).json({ message: 'El monto desembolsado debe ser mayor que cero' });
        }
        if (Math.abs(montoDesembolsado * 100 - Math.round(montoDesembolsado * 100)) > 1e-8) {
            return res.status(400).json({ message: 'El monto debe tener un máximo de dos decimales' });
        }
        if (!['transferencia', 'cheque', 'efectivo'].includes(metodoPago)) {
            return res.status(400).json({ message: 'Método de desembolso inválido' });
        }
        if (fechaPrimerPago !== undefined &&
            (typeof fechaPrimerPago !== 'string' ||
                !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(fechaPrimerPago))) {
            return res.status(400).json({ message: 'fechaPrimerPago debe ser una fecha en formato ISO' });
        }
        const primeraFecha = fechaPrimerPago === undefined
            ? sumarMesesConTope(new Date(), 1)
            : new Date(fechaPrimerPago);
        if (Number.isNaN(primeraFecha.getTime()) || primeraFecha <= new Date()) {
            return res.status(400).json({ message: 'La fecha de la primera cuota debe ser una fecha futura válida' });
        }

        let desembolso;
        await session.withTransaction(async () => {
            const prestamo = await mongoose.model('Prestamo').findOneAndUpdate(
                { _id: prestamoId, estado: 'activo' },
                { $inc: { __v: 1 } },
                { new: true, session }
            );
            if (!prestamo) {
                const existe = await mongoose.model('Prestamo').exists({ _id: prestamoId }).session(session);
                const error = new Error(existe ? 'El préstamo no está disponible para desembolso' : 'Préstamo no encontrado');
                error.status = existe ? 409 : 404;
                throw error;
            }
            const yaDesembolsado = await mongoose.model('Desembolso').exists({ prestamoId }).session(session);
            if (yaDesembolsado) {
                const error = new Error('El préstamo ya tiene un desembolso registrado');
                error.status = 409;
                throw error;
            }
            const planExistente = await mongoose.model('PlanAmortizacion')
                .exists({ prestamoId }).session(session);
            if (planExistente) {
                const error = new Error('El préstamo ya tiene un plan de amortización');
                error.status = 409;
                throw error;
            }
            if (Math.abs(prestamo.montoPrincipal * 100 - Math.round(prestamo.montoPrincipal * 100)) > 1e-8 ||
                Math.round(montoDesembolsado * 100) !== Math.round(prestamo.montoPrincipal * 100)) {
                const error = new Error('El desembolso debe coincidir con el principal aprobado');
                error.status = 400;
                throw error;
            }
            if (typeof prestamo.tasaInteres !== 'number' || !Number.isFinite(prestamo.tasaInteres) ||
                prestamo.tasaInteres < 0 || !Number.isInteger(prestamo.plazoMeses) || prestamo.plazoMeses < 1) {
                const error = new Error('La tasa o el plazo del préstamo no permiten generar un plan válido');
                error.status = 409;
                throw error;
            }
            [desembolso] = await mongoose.model('Desembolso').create([{
                prestamoId,
                montoDesembolsado,
                metodoPago,
                referenciaBancaria
            }], { session });
            const cuotas = crearCuotasFrancesas(prestamo, prestamo.tasaInteres, primeraFecha);
            await mongoose.model('Cuota').create(cuotas, { session });
            await mongoose.model('PlanAmortizacion').create([{
                prestamoId: prestamo._id,
                cuotasIds: cuotas.map((cuota) => cuota._id)
            }], { session });
            await mongoose.model('TransaccionFinanciera').create([{
                referenciaId: prestamo._id,
                tipoTransaccion: 'desembolso_prestamo',
                monto: montoDesembolsado,
                moneda: 'DOP'
            }], { session });
        });
        return res.status(201).json({
            message: 'Desembolso registrado y plan de amortización francés generado',
            desembolso
        });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return responderError(res, error, 'Error al registrar el desembolso');
    } finally {
        await session?.endSession();
    }
}
