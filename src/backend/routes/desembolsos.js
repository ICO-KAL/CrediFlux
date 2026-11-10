import express from 'express';
import { listarDesembolsos, registrarDesembolso } from '../controller/desembolsos_controller.js';

const router = express.Router();

router.get('/', listarDesembolsos);
router.post('/', registrarDesembolso);

export default router;
