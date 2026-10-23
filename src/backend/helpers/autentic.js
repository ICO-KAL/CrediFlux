import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';
import mongoose from 'mongoose';
import sesiones from '../models/sesion';

export function userToken(payload) {
    return jsonwebtoken.sign(payload, process.env.JSON_WEB_TOKEN, {
        expiresIn: '1h'
    });
}

export async function verificarToken(req, res, next) {
    const authorization = req.get('Authorization');
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    let usuario;
    try {
        usuario = jsonwebtoken.verify(token, process.env.JSON_WEB_TOKEN);
    } catch {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    if (!mongoose.Types.ObjectId.isValid(usuario.id) ||
        !mongoose.Types.ObjectId.isValid(usuario.sid)) {
        return res.status(401).json({ message: 'El token no está asociado a una sesión válida' });
    }

    try {
        const sesion = await sesiones.getSesion({
            _id: usuario.sid,
            usuarioId: usuario.id,
            expiraEn: { $gt: new Date() }
        });
        if (!sesion) return res.status(401).json({ message: 'La sesión fue cerrada o expiró' });

        req.usuario = usuario;
        return next();
    } catch (error) {
        console.error('Error al verificar la sesión', error);
        return res.status(500).json({ message: 'No se pudo verificar la sesión' });
    }
}
