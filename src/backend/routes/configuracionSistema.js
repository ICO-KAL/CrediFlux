import express from 'express';
import { listarConfiguraciones, obtenerConfiguracion, crearConfiguracion, actualizarConfiguracion, eliminarConfiguracion } from '../controller/configuracion_sistema_controller.js';

const router = express.Router();

router.get('/', listarConfiguraciones);
router.get('/clave/:clave', obtenerConfiguracion);
router.post('/', crearConfiguracion);
router.put('/:id', actualizarConfiguracion);
router.delete('/:id', eliminarConfiguracion);

export default router;
