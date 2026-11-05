import express from 'express';
import { autorizarCompraTarjeta, listarAutorizacionesTarjeta, obtenerAutorizacionTarjeta } from '../controller/autorizacionesTarjeta_controller.js';

const router = express.Router();

router.post('/', autorizarCompraTarjeta);
router.get('/', listarAutorizacionesTarjeta);
router.get('/:id', obtenerAutorizacionTarjeta);

export default router;
