import express from 'express';
import { obtenerTransacciones, obtenerTransaccionesPorId, crearTransacciones, actualizarTransaccion, eliminarTransaccion } from '../controller/transaccionesFinancieras_controller.js';

const router = express.Router();

router.get('/', obtenerTransacciones);
router.get('/:id', obtenerTransaccionesPorId);
router.post('/', crearTransacciones);
router.put('/:id', actualizarTransaccion);
router.delete('/:id', eliminarTransaccion);

export default router;
