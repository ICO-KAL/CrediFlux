import express from 'express';
import { exigirPermiso } from '../helpers/autentic.js';
import { crearEvaluacionCrediticia, listarEvaluacionesCrediticias, listarDecisionesCredito, decidirSolicitudCredito } from '../controller/evaluaciones_controller.js';

const router = express.Router();

router.post('/', exigirPermiso('solicitudes_credito', 'revisar'), crearEvaluacionCrediticia);
router.get('/', exigirPermiso('solicitudes_credito', 'revisar'), listarEvaluacionesCrediticias);
router.get('/decisiones', exigirPermiso('solicitudes_credito', 'decidir'), listarDecisionesCredito);
router.post('/decidir/:solicitudId', exigirPermiso('solicitudes_credito', 'decidir'), decidirSolicitudCredito);

export default router;
