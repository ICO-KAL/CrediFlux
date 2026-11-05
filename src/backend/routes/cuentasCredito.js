import express from 'express';
import { listarCuentasCredito, obtenerCuentaCredito, listarEstadosCuenta, obtenerEstadoCuenta } from '../controller/cuentasCredito_controller.js';

const router = express.Router();

router.get('/', listarCuentasCredito);
router.get('/estados', listarEstadosCuenta);
router.get('/estados/:clienteId/:periodo', obtenerEstadoCuenta);
router.get('/:id', obtenerCuentaCredito);

export default router;
