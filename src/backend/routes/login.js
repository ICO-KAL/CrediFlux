import express from 'express';
import {register,login} from '../controller/usuario_controller';
import { verificarToken } from '../helpers/autentic';

const router = express.Router();

router.post('/login', login);
router.post('/register',register); // implementar el register

router.get('/verify', verificarToken, (req, res) => {
    return res.status(200).json({ usuario: req.usuario });
});