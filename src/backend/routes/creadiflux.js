import express from 'express';
import { listarModulosCrediflux, registrarModuloCrediflux, actualizarModuloCrediflux, eliminarModuloCrediflux } from '../controller/creadiflux_controller.js';

const router = express.Router();

router.get('/', listarModulosCrediflux);
router.post('/', registrarModuloCrediflux);
router.put('/:id', actualizarModuloCrediflux);
router.delete('/:id', eliminarModuloCrediflux);

export default router;
