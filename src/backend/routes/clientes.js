import express from 'express';
import { crearCliente, listarClientes, obtenerCliente, actualizarCliente } from '../controller/clientes_controller.js';

const router = express.Router();

router.post('/', crearCliente);
router.get('/', listarClientes);
router.get('/:id', obtenerCliente);
router.put('/:id', actualizarCliente);

export default router;
