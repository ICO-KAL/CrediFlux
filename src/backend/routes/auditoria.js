import express from 'express';
import { registrarAuditoria, listarAuditoria, obtenerEventoAuditoria } from '../controller/auditoria_controller.js';

const router = express.Router();

router.post('/', registrarAuditoria);
router.get('/', listarAuditoria);
router.get('/:id', obtenerEventoAuditoria);

export default router;
