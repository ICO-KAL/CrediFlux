import express from 'express';
import { registrarDocumentoCliente, listarDocumentosCliente, verificarDocumentoCliente } from '../controller/documentos_cliente_controller.js';

const router = express.Router();

router.post('/', registrarDocumentoCliente);
router.get('/', listarDocumentosCliente);
router.patch('/:id/verificar', verificarDocumentoCliente);

export default router;
