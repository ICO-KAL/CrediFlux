import express from 'express';
import {register,login} from '../controller/usuario_controller.js';
import { verificarToken } from '../helpers/autentic.js';
import {
    cerrarOtrasSesiones,
    cerrarSesion,
    obtenerMisSesiones,
    renovarSesion
} from '../controller/sesiones_controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/sessions/refresh', renovarSesion);
router.get('/sessions', verificarToken, obtenerMisSesiones);
router.post('/sessions/logout', verificarToken, cerrarSesion);
router.post('/sessions/logout-others', verificarToken, cerrarOtrasSesiones);

router.get('/verify', verificarToken, (req, res) => {
    return res.status(200).json({ usuario: req.usuario });
});

export default router;