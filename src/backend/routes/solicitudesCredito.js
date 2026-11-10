import express from 'express';
import {cancelarSolicitudCredito,crearSolicitudCredito, obtenerSolicitudesCredito,actualizarSolicitudCredito,eliminarSolicitudCredito,marcarSolicitudEnRevision} from '../controller/solicitudesCredito_controller.js';

const router = express.Router();

router.post('/', crearSolicitudCredito);
router.get('/', obtenerSolicitudesCredito);
router.put('/:id', actualizarSolicitudCredito);
router.delete('/:id', eliminarSolicitudCredito);
router.patch('/:id/revision', marcarSolicitudEnRevision);
router.patch('/:id', cancelarSolicitudCredito);

export default router;
