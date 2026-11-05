import express from 'express';
import { listarComisiones, registrarComision } from '../controller/comisiones_controller.js';

const router = express.Router();

router.get('/', listarComisiones);
router.post('/', registrarComision);

export default router;
