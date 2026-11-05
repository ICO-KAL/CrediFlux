import express from 'express';
import { CrearProducto, listarProductos, obtenerProducto, actualizarProducto } from '../controller/productosCredicto_Controller.js';

const router = express.Router();

router.post('/', CrearProducto);
router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
router.put('/:id', actualizarProducto);

export default router;
