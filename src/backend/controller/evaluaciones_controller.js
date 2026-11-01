import mongoose from 'mongoose';
import '../models/evaluacion_crediticia.js';
import '../models/decision_credito.js';
import '../models/solicitud_credito.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function crearEvaluacionCrediticia(req, res) {
    try {
        const { solicitudId, scoreBuro, relacionDeudaIngreso, comentariosRiesgo } = req.body ?? {};
        if (!esObjectId(solicitudId)) return res.status(400).json({ message: 'ID de solicitud inválido' });
        if (typeof scoreBuro !== 'number' || !Number.isFinite(scoreBuro) || scoreBuro < 0 ||
            typeof relacionDeudaIngreso !== 'number' || !Number.isFinite(relacionDeudaIngreso) || relacionDeudaIngreso < 0) {
            return res.status(400).json({ message: 'Score y relación deuda/ingreso deben ser números no negativos' });
        }

        const solicitud = await mongoose.model('SolicitudCredito').findById(solicitudId);
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
        if (solicitud.estado !== 'en_revision') return res.status(409).json({ message: 'La solicitud debe estar en revisión' });
        if (await mongoose.model('EvaluacionCrediticia').exists({ solicitudId })) {
            return res.status(409).json({ message: 'La solicitud ya tiene una evaluación' });
        }

        const evaluacion = await mongoose.model('EvaluacionCrediticia').create({
            solicitudId, scoreBuro, relacionDeudaIngreso, comentariosRiesgo
        });
        return res.status(201).json({ message: 'Evaluación registrada', evaluacion });
    } catch (error) {
        return responderError(res, error, 'Error al registrar la evaluación');
    }
}

export async function listarEvaluacionesCrediticias(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.solicitudId !== undefined) {
            if (!esObjectId(req.query.solicitudId)) return res.status(400).json({ message: 'ID de solicitud inválido' });
            filtro.solicitudId = req.query.solicitudId;
        }
        const [evaluaciones, total] = await Promise.all([
            mongoose.model('EvaluacionCrediticia').find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('EvaluacionCrediticia').countDocuments(filtro)
        ]);
        return res.status(200).json({ evaluaciones, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar evaluaciones');
    }
}

export async function listarDecisionesCredito(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.solicitudId !== undefined) {
            if (!esObjectId(req.query.solicitudId)) return res.status(400).json({ message: 'ID de solicitud inválido' });
            filtro.solicitudId = req.query.solicitudId;
        }
        const [decisiones, total] = await Promise.all([
            mongoose.model('DecisionCredito').find(filtro)
                .populate('evaluacionId', 'scoreBuro relacionDeudaIngreso')
                .sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('DecisionCredito').countDocuments(filtro)
        ]);
        return res.status(200).json({ decisiones, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar decisiones de crédito');
    }
}

export async function decidirSolicitudCredito(req, res) {
    let session;
    try {
        session = await mongoose.startSession();
        const { solicitudId } = req.params;
        const { estado, montoAprobado, razonDecision } = req.body ?? {};
        const usuarioId = req.usuario?.id;
        if (!esObjectId(solicitudId) || !esObjectId(usuarioId)) {
            return res.status(400).json({ message: 'ID de solicitud o usuario inválido' });
        }
        if (!['aprobada', 'rechazada'].includes(estado)) {
            return res.status(400).json({ message: 'La decisión debe ser aprobada o rechazada' });
        }
        if (estado === 'aprobada' &&
            (typeof montoAprobado !== 'number' || !Number.isFinite(montoAprobado) || montoAprobado <= 0)) {
            return res.status(400).json({ message: 'Una aprobación requiere un monto aprobado mayor que cero' });
        }
        if (estado === 'rechazada' && (typeof razonDecision !== 'string' || !razonDecision.trim())) {
            return res.status(400).json({ message: 'Una solicitud rechazada requiere una razón' });
        }
        if (razonDecision !== undefined && (typeof razonDecision !== 'string' || razonDecision.length > 2000)) {
            return res.status(400).json({ message: 'La razón no puede superar 2000 caracteres' });
        }

        let decisionCreada;
        await session.withTransaction(async () => {
            const solicitud = await mongoose.model('SolicitudCredito').findOne({
                _id: solicitudId,
                estado: 'en_revision'
            }).session(session);
            if (!solicitud) {
                const actual = await mongoose.model('SolicitudCredito').findById(solicitudId).session(session);
                const err = new Error(actual ? 'La solicitud no está en revisión' : 'Solicitud no encontrada');
                err.status = actual ? 409 : 404;
                throw err;
            }

            const evaluacion = await mongoose.model('EvaluacionCrediticia').findOne({ solicitudId }).session(session);
            if (!evaluacion) {
                const err = new Error('La solicitud necesita una evaluación antes de decidirse');
                err.status = 409;
                throw err;
            }
            if (estado === 'aprobada' && montoAprobado > solicitud.montoSolicitado) {
                const err = new Error('El monto aprobado no puede superar el monto solicitado');
                err.status = 400;
                throw err;
            }

            [decisionCreada] = await mongoose.model('DecisionCredito').create([{
                solicitudId,
                evaluacionId: evaluacion._id,
                aprobadoPor: usuarioId,
                ...(estado === 'aprobada' ? { montoAprobado } : {}),
                razonDecision
            }], { session });
            solicitud.estado = estado;
            await solicitud.save({ session });
        });
        return res.status(201).json({ message: `Solicitud ${estado}`, decision: decisionCreada });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        return responderError(res, error, 'Error al registrar la decisión');
    } finally {
        await session?.endSession();
    }
}
