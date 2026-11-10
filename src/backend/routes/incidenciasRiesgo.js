import express from 'express';
import { crearIncidenciaRiesgo, listarIncidenciasRiesgo } from '../controller/incidencias_riesgo_controller.js';

const router = express.Router();

router.post('/', crearIncidenciaRiesgo);
router.get('/', listarIncidenciasRiesgo);

export default router;
