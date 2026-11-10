import express from 'express';
import { actualizarPago, EliminarPago, registrarPago } from '../controller/pagos_controller.js';
import { listarPagos } from '../controller/seguimiento_controller.js';

const router = express.Router();

router.post('/register', registrarPago);
router.get('/listar', listarPagos);
router.delete('/eliminar/:id', EliminarPago);
router.put('/actualizar/:id', actualizarPago);


export default router;
