import express from 'express';
import { crearRol, listarRoles, obtenerRolId, actualizarRol, eliminarRol, agregarPermisoARol, quitarPermisoDeRol } from '../controller/rol_controller.js';

const router = express.Router();

router.post('/', crearRol);
router.get('/', listarRoles);
router.get('/:id', obtenerRolId);
router.put('/:id', actualizarRol);
router.delete('/:id', eliminarRol);
router.post('/:id/permisos/:permisoId', agregarPermisoARol);
router.delete('/:id/permisos/:permisoId', quitarPermisoDeRol);

export default router;
