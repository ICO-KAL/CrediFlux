import express from 'express';
import { listarCuotas, obtenerCuota, obtenerPlanAmortizacion } from '../controller/cuotas_controller.js';

const router = express.Router();

router.get('/', listarCuotas);
router.get('/plan/:prestamoId', obtenerPlanAmortizacion);
router.get('/:id', obtenerCuota);

export default router;
