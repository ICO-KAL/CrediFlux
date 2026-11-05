import express from 'express';
import { crearDireccion, listarDirecciones, obtenerDireccion, actualizarDireccion, eliminarDireccion } from '../controller/direcciones_controller.js';

const router = express.Router();

router.post('/', crearDireccion);
router.get('/', listarDirecciones);
router.get('/:id', obtenerDireccion);
router.put('/:id', actualizarDireccion);
router.delete('/:id', eliminarDireccion);

export default router;
