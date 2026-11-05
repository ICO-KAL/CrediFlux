import express from 'express';
import {listarUsuarios, asignarRolesUsuario, eliminarRolesUsuario} from '../controller/usuarios_admin_controller.js';

const router = express.Router();

router.get('/', listarUsuarios);
router.put('/:id/roles', asignarRolesUsuario);
router.delete('/:id/roles', eliminarRolesUsuario);

export default router;
