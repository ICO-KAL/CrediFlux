import express from 'express';
import { crearPrestamoDesdeSolicitud, listarPrestamos, obtenerPrestamo } from '../controller/prestamos_controller.js';

const router = express.Router();

router.post('/', crearPrestamoDesdeSolicitud);
router.get('/', listarPrestamos);
router.get('/:id', obtenerPrestamo);

export default router;
