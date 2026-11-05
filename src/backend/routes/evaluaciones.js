import express from 'express';
import { crearEvaluacionCrediticia, listarEvaluacionesCrediticias, listarDecisionesCredito, decidirSolicitudCredito } from '../controller/evaluaciones_controller.js';

const router = express.Router();

router.post('/', crearEvaluacionCrediticia);
router.get('/', listarEvaluacionesCrediticias);
router.get('/decisiones', listarDecisionesCredito);
router.post('/decidir/:solicitudId', decidirSolicitudCredito);

export default router;
