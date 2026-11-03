import express from 'express';
import { listarNotificaciones, crearNotificacion, marcarNotificacionLeida, eliminarNotificacion } from '../controller/notificaciones_controller.js';

const router = express.Router();

router.get('/', listarNotificaciones);
router.post('/', crearNotificacion);
router.patch('/:id/leida', marcarNotificacionLeida);
router.delete('/:id', eliminarNotificacion);

export default router;