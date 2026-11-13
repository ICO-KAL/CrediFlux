import express from 'express';
import {listarUsuarios, asignarRolesUsuario, eliminarRolesUsuario, actualizarEstadoUsuario} from '../controller/usuarios_admin_controller.js';
import { exigirPermiso } from '../helpers/autentic.js';

const router = express.Router();

router.get('/', exigirPermiso('usuarios', 'administrar'), listarUsuarios);
router.put('/:id/roles', exigirPermiso('usuarios', 'administrar'), asignarRolesUsuario);
router.delete('/:id/roles', exigirPermiso('usuarios', 'administrar'), eliminarRolesUsuario);
router.patch('/:id/estado', exigirPermiso('usuarios', 'administrar'), actualizarEstadoUsuario);

export default router;
