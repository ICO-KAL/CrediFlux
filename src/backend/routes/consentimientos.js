import express from 'express';
import { registrarConsentimiento, listarConsentimientos } from '../controller/consentimientos_controller.js';

const router = express.Router();

router.post('/', registrarConsentimiento);
router.get('/', listarConsentimientos);

export default router;
