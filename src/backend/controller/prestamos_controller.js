import mongoose from 'mongoose';
import prestamos from '../models/prestamo.js';
import solicitudes from '../models/solicitud_credito.js';
import decisiones from '../models/decision_credito.js';
import { esObjectId, responderError, validarPaginacion } from '../helpers/controlador.js';

export async function crearPrestamoDesdeSolicitud(req, res) {
    try {
        const { solicitudId } = req.body ?? {};
        if (!esObjectId(solicitudId)) return res.status(400).json({ message: 'ID de solicitud inválido' });
        const solicitud = await solicitudes.getIdSolicitudCredito(solicitudId);
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
        if (solicitud.estado !== 'aprobada') return res.status(409).json({ message: 'Solo se puede crear un préstamo desde una solicitud aprobada' });

        const decision = await decisiones.getDecisionCredito({ solicitudId });
        if (!decision || !decision.montoAprobado || decision.montoAprobado <= 0) {
            return res.status(409).json({ message: 'La solicitud no tiene una decisión aprobatoria con monto válido' });
        }
        const existente = await prestamos.getPrestamo({ solicitudId });
        if (existente) return res.status(409).json({ message: 'Ya existe un préstamo para esta solicitud', prestamo: existente });

        const producto = await mongoose.model('ProductoCredito').findById(solicitud.productoCreditoId);
        if (!producto) return res.status(409).json({ message: 'El producto asociado ya no existe' });

        const prestamo = await prestamos.crearPrestamo({
            clienteId: solicitud.clienteId,
            solicitudId: solicitud._id,
            montoPrincipal: decision.montoAprobado,
            tasaInteres: producto.tasaInteresAnual,
            plazoMeses: solicitud.plazoSolicitadoMeses,
            estado: 'activo'
        });
        return res.status(201).json({ message: 'Préstamo creado desde solicitud aprobada', prestamo });
    } catch (error) {
        return responderError(res, error, 'Error al crear el préstamo');
    }
}

export async function listarPrestamos(req, res) {
    try {
        const paginacion = validarPaginacion(req.query);
        if (!paginacion) return res.status(400).json({ message: 'Paginación inválida' });
        const filtro = {};
        if (req.query.clienteId !== undefined) {
            if (!esObjectId(req.query.clienteId)) return res.status(400).json({ message: 'ID de cliente inválido' });
            filtro.clienteId = req.query.clienteId;
        }
        if (req.query.estado !== undefined) filtro.estado = req.query.estado;
        const [items, total] = await Promise.all([
            mongoose.model('Prestamo').find(filtro).sort({ createdAt: -1 }).skip(paginacion.skip).limit(paginacion.limit),
            mongoose.model('Prestamo').countDocuments(filtro)
        ]);
        return res.status(200).json({ prestamos: items, paginacion: { page: paginacion.page, limit: paginacion.limit, total } });
    } catch (error) {
        return responderError(res, error, 'Error al listar préstamos');
    }
}

export async function obtenerPrestamo(req, res) {
    try {
        if (!esObjectId(req.params.id)) return res.status(400).json({ message: 'ID de préstamo inválido' });
        const prestamo = await prestamos.getIdPrestamo(req.params.id);
        if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });
        return res.status(200).json({ prestamo });
    } catch (error) {
        return responderError(res, error, 'Error al obtener el préstamo');
    }
}
