import express from 'express';
import { crearRol, listarRoles, obtenerRolId, actualizarRol, eliminarRol, agregarPermisoARol, quitarPermisoDeRol } from '../controller/rol_controller.js';
import { exigirPermiso } from '../helpers/autentic.js';

const router = express.Router();

router.post('/', exigirPermiso('roles', 'administrar'), crearRol);
router.get('/', exigirPermiso('roles', 'administrar'), listarRoles);
router.get('/:id', exigirPermiso('roles', 'administrar'), obtenerRolId);
router.put('/:id', exigirPermiso('roles', 'administrar'), actualizarRol);
router.delete('/:id', exigirPermiso('roles', 'administrar'), eliminarRol);
router.post('/:id/permisos/:permisoId', exigirPermiso('roles', 'administrar'), agregarPermisoARol);
router.delete('/:id/permisos/:permisoId', exigirPermiso('roles', 'administrar'), quitarPermisoDeRol);

export default router;
