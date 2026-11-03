import express from 'express';
import { registerPago ,listarPagos} from '../controller/pagos_controller';

const router = express.Router();

router.post('/register', registerPago);
router.get('/listar', listarPagos);

export default router;
