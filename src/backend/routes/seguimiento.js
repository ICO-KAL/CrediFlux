import express from 'express';
import { listarAsignacionesPago, listarMovimientosTarjeta } from '../controller/seguimiento_controller.js';

const router = express.Router();

router.get('/asignaciones-pago', listarAsignacionesPago);
router.get('/movimientos-tarjeta', listarMovimientosTarjeta);

export default router;
