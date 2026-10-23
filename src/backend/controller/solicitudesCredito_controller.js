import mongoose from 'mongoose';
import solicitudesCredito from '../models/solicitud_credito';
import clientes from '../models/cliente';
import productosCredito from '../models/producto_credito';

const estadosSolicitud = ['pendiente', 'en_revision', 'aprobada', 'rechazada'];
const limiteMaximoPagina = 100;

function responderError(res, error, mensaje) { // eliminar
    console.error(mensaje, error);
    return res.status(500).json({ message: mensaje });
}

function validarImporteYPlazo(producto, montoSolicitado, plazoSolicitadoMeses) {
    if (montoSolicitado < producto.montoMinimo || montoSolicitado > producto.montoMaximo) {
        return 'El monto solicitado está fuera de los límites del producto';
    }
    if (plazoSolicitadoMeses > producto.plazoMaximosMeses) {
        return 'El plazo solicitado supera el máximo permitido por el producto';
    }
    return null;
}

export async function crearSolicitudCredito(req, res) {
    try {
        const { clienteId, productoCreditoId, montoSolicitado, plazoSolicitadoMeses } = req.body ?? {};

        if (!clienteId || !productoCreditoId || !montoSolicitado ||!plazoSolicitadoMeses) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }
        if (!mongoose.Types.ObjectId.isValid(clienteId) || !mongoose.Types.ObjectId.isValid(productoCreditoId)) {
            return res.status(400).json({ message: 'El ID del cliente o del producto no es válido' });
        }
        if (typeof montoSolicitado !== 'number' || !Number.isFinite(montoSolicitado) || montoSolicitado <= 0) {
            return res.status(400).json({ message: 'El monto solicitado debe ser un número mayor que cero' });
        }
        if (typeof plazoSolicitadoMeses !== 'number' || !Number.isInteger(plazoSolicitadoMeses) || plazoSolicitadoMeses < 1) {
            return res.status(400).json({ message: 'El plazo debe ser un número entero de al menos un mes' });
        }

        const [cliente, producto] = await Promise.all([
            clientes.getIdCliente(clienteId),
            productosCredito.getIdProductoCredito(productoCreditoId)
        ]);
        if (!cliente) return res.status(404).json({ message: 'No se encontró el cliente' });
        if (!producto) return res.status(404).json({ message: 'No se encontró el producto de crédito' });

        const errorLimites = validarImporteYPlazo(producto, montoSolicitado, plazoSolicitadoMeses);
        if (errorLimites) return res.status(400).json({ message: errorLimites });

        const solicitud = await solicitudesCredito.crearSolicitudCredito({
            clienteId,
            productoCreditoId,
            montoSolicitado,
            plazoSolicitadoMeses
        });
        return res.status(201).json({ message: 'Solicitud creada', solicitud });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: 'Los datos de la solicitud no son válidos' });
        }
        return responderError(res, error, 'Error al crear la solicitud');
    }
}

export { crearSolicitudCredito as crearSolicitude };

export async function obtenerSolicitudesCredito(req, res) {
    try {
        const { clienteId, estado } = req.query;
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 20);

        if (!Number.isInteger(page) || page < 1 ||
            !Number.isInteger(limit) || limit < 1 || limit > limiteMaximoPagina) {
            return res.status(400).json({ message: `La paginación debe usar page >= 1 y limit entre 1 y ${limiteMaximoPagina}` });
        }
        if (clienteId !== undefined && !esObjectIdValido(clienteId)) {
            return res.status(400).json({ message: 'El ID del cliente no es válido' });
        }
        if (estado !== undefined && !estadosSolicitud.includes(estado)) {
            return res.status(400).json({ message: 'El estado indicado no es válido' });
        }

        const filtro = {};
        if (clienteId !== undefined) filtro.clienteId = clienteId;
        if (estado !== undefined) filtro.estado = estado;

        const resultado = await solicitudesCredito.listarSolicitudesCredito(filtro, { page, limit });
        return res.status(200).json({
            solicitudes: resultado.solicitudes,
            paginacion: {
                page,
                limit,
                total: resultado.total,
                totalPaginas: Math.ceil(resultado.total / limit)
            }
        });
    } catch (error) {
        return responderError(res, error, 'Error al obtener las solicitudes');
    }
}

export async function obtenerSolicitudCreditoPorId(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectIdValido(id)) {
            return res.status(400).json({ message: 'El ID de la solicitud no es válido' });
        }

        const solicitud = await solicitudesCredito.getIdSolicitudCredito(id);
        if (!solicitud) return res.status(404).json({ message: 'No se encontró la solicitud' });
        return res.status(200).json({ solicitud });
    } catch (error) {
        return responderError(res, error, 'Error al obtener la solicitud');
    }
}

export async function actualizarSolicitudCredito(req, res) {
    try {
        const { id } = req.params;
        const { montoSolicitado, plazoSolicitadoMeses } = req.body ?? {};

        if (!esObjectIdValido(id)) {
            return res.status(400).json({ message: 'El ID de la solicitud no es válido' });
        }
        if (montoSolicitado === undefined && plazoSolicitadoMeses === undefined) {
            return res.status(400).json({ message: 'Indica al menos un campo que quieras actualizar' });
        }

        const solicitudActual = await solicitudesCredito.getIdSolicitudCredito(id);
        if (!solicitudActual) return res.status(404).json({ message: 'No se encontró la solicitud' });
        if (solicitudActual.estado !== 'pendiente') {
            return res.status(409).json({ message: 'Solo se pueden editar solicitudes pendientes' });
        }

        const cambios = {};
        const nuevoMonto = montoSolicitado === undefined ? solicitudActual.montoSolicitado : montoSolicitado;
        const nuevoPlazo = plazoSolicitadoMeses === undefined
            ? solicitudActual.plazoSolicitadoMeses
            : plazoSolicitadoMeses;

        if (montoSolicitado !== undefined) {
            if (typeof montoSolicitado !== 'number' || !Number.isFinite(montoSolicitado) || montoSolicitado <= 0) {
                return res.status(400).json({ message: 'El monto solicitado debe ser un número mayor que cero' });
            }
            cambios.montoSolicitado = montoSolicitado;
        }
        if (plazoSolicitadoMeses !== undefined) {
            if (typeof plazoSolicitadoMeses !== 'number' ||
                !Number.isInteger(plazoSolicitadoMeses) || plazoSolicitadoMeses < 1) {
                return res.status(400).json({ message: 'El plazo debe ser un número entero de al menos un mes' });
            }
            cambios.plazoSolicitadoMeses = plazoSolicitadoMeses;
        }

        const producto = await productosCredito.getIdProductoCredito(solicitudActual.productoCreditoId.toString());
        if (!producto) return res.status(409).json({ message: 'El producto asociado a la solicitud ya no existe' });
        const errorLimites = validarImporteYPlazo(producto, nuevoMonto, nuevoPlazo);
        if (errorLimites) return res.status(400).json({ message: errorLimites });

        const solicitud = await solicitudesCredito.actualizarSolicitudCredito(id, { $set: cambios });
        if (!solicitud) return res.status(404).json({ message: 'No se encontró la solicitud' });
        return res.status(200).json({ message: 'Solicitud actualizada', solicitud });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: 'Los datos de la solicitud no son válidos' });
        }
        return responderError(res, error, 'Error al actualizar la solicitud');
    }
}

export async function eliminarSolicitudCredito(req, res) {
    return cancelarSolicitudCredito(req, res);
}

export async function marcarSolicitudEnRevision(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectIdValido(id)) {
            return res.status(400).json({ message: 'El ID de la solicitud no es válido' });
        }

        const solicitud = await solicitudesCredito.cambiarEstadoSiPendiente(id, 'en_revision');
        if (!solicitud) {
            const existente = await solicitudesCredito.getIdSolicitudCredito(id);
            if (!existente) return res.status(404).json({ message: 'No se encontró la solicitud' });
            return res.status(409).json({ message: 'Solo se puede enviar a revisión una solicitud pendiente' });
        }
        return res.status(200).json({ message: 'Solicitud enviada a revisión', solicitud });
    } catch (error) {
        return responderError(res, error, 'Error al cambiar el estado de la solicitud');
    }
}

export async function cancelarSolicitudCredito(req, res) {
    try {
        const { id } = req.params;
        if (!esObjectIdValido(id)) {
            return res.status(400).json({ message: 'El ID de la solicitud no es válido' });
        }

        const solicitud = await solicitudesCredito.cambiarEstadoSiPendiente(id, 'cancelada');
        if (!solicitud) {
            const existente = await solicitudesCredito.getIdSolicitudCredito(id);
            if (!existente) return res.status(404).json({ message: 'No se encontró la solicitud' });
            return res.status(409).json({ message: 'Solo se pueden cancelar solicitudes pendientes' });
        }
        return res.status(200).json({ message: 'Solicitud cancelada', solicitud });
    } catch (error) {
        return responderError(res, error, 'Error al cancelar la solicitud');
    }
}

export { eliminarSolicitudCredito as EliminarSolicitud };
