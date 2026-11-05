import express from 'express';
import { listarCuentasContables, crearCuentaContable, actualizarCuentaContable, eliminarCuentaContable, listarAsientosContables, obtenerAsientoContable, crearAsientoContable } from '../controller/contabilidad_controller.js';

const router = express.Router();

router.get('/cuentas', listarCuentasContables);
router.post('/cuentas', crearCuentaContable);
router.put('/cuentas/:id', actualizarCuentaContable);
router.delete('/cuentas/:id', eliminarCuentaContable);
router.get('/asientos', listarAsientosContables);
router.get('/asientos/:id', obtenerAsientoContable);
router.post('/asientos', crearAsientoContable);

export default router;
