import express from 'express';
import { insertarTarjeta, obtenerTodasTarjetas, obtenerTarjetaId, actualizarTarjeta, eliminarTarjeta } from '../controller/tarjetaCredicto_controller.js';

const router = express.Router();

router.post('/', insertarTarjeta);
router.get('/', obtenerTodasTarjetas);
router.get('/:id', obtenerTarjetaId);
router.put('/:id', actualizarTarjeta);
router.delete('/:id', eliminarTarjeta);

export default router;
