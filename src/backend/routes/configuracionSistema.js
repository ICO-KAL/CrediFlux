import express from 'express';
import { listarConfiguraciones, obtenerConfiguracion, crearConfiguracion, actualizarConfiguracion, eliminarConfiguracion } from '../controller/configuracion_sistema_controller.js';
import { exigirPermiso } from '../helpers/autentic.js';

const router = express.Router();

router.get('/', exigirPermiso('configuracion_sistema', 'administrar'), listarConfiguraciones);
router.get('/clave/:clave', exigirPermiso('configuracion_sistema', 'administrar'), obtenerConfiguracion);
router.post('/', exigirPermiso('configuracion_sistema', 'administrar'), crearConfiguracion);
router.put('/:id', exigirPermiso('configuracion_sistema', 'administrar'), actualizarConfiguracion);
router.delete('/:id', exigirPermiso('configuracion_sistema', 'administrar'), eliminarConfiguracion);

export default router;
