import express from 'express';
import { listarPermisos, crearPermiso, eliminarPermiso } from '../controller/permisos_controller.js';

const router = express.Router();

router.get('/', listarPermisos);
router.post('/', crearPermiso);
router.delete('/:id', eliminarPermiso);

export default router;
