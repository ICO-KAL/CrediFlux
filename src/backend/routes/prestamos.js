import express from 'express';
import { crearPrestamoDesdeSolicitud, listarPrestamos, obtenerMetricasCartera, obtenerPrestamo } from '../controller/prestamos_controller.js';

const router = express.Router();

router.post('/', crearPrestamoDesdeSolicitud);
router.get('/metricas-cartera', obtenerMetricasCartera);
router.get('/', listarPrestamos);
router.get('/:id', obtenerPrestamo);

export default router;
