import express from 'express';
import { listarPermisos, crearPermiso, eliminarPermiso } from '../controller/permisos_controller.js';
import { exigirPermiso } from '../helpers/autentic.js';

const router = express.Router();

router.get('/', exigirPermiso('roles', 'administrar'), listarPermisos);
router.post('/', exigirPermiso('roles', 'administrar'), crearPermiso);
router.delete('/:id', exigirPermiso('roles', 'administrar'), eliminarPermiso);

export default router;
