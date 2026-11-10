import jsonwebtoken from 'jsonwebtoken';
import { createHash, createHmac, randomBytes } from 'node:crypto';
import 'dotenv/config';
import sesiones from '../models/sesion.js';
import usuarioModel from '../models/usuario.js';
import { esObjectId } from './controlador.js';

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

    if (!esObjectId(usuario.id) ||
        !esObjectId(usuario.sid)) {
        return res.status(401).json({ message: 'El token no está asociado a una sesión válida' });
    }

    try {
        const sesion = await sesiones.getSesion({
            _id: usuario.sid,
            usuarioId: usuario.id,
            expiraEn: { $gt: new Date() }
        });
        if (!sesion) return res.status(401).json({ message: 'La sesión fue cerrada o expiró' });

        const cuenta = await usuarioModel.getUsuario({ _id: usuario.id });
        if (!cuenta || !cuenta.activo) {
            return res.status(401).json({
                code: cuenta ? 'ACCOUNT_INACTIVE' : 'SESSION_INVALID',
                message: cuenta ? 'Tu cuenta se encuentra inactiva. Contacta con el administrador.' : 'La sesión no es válida'
            });
        }

        req.usuario = usuario;
        return next();
    } catch (error) {
        console.error('Error al verificar la sesión', error);
        return res.status(500).json({ message: 'No se pudo verificar la sesión' });
    }
}

export function exigirPermiso(modulo, nombreAccion) {
    return async function verificarPermiso(req, res, next) {
        try {
            const usuarioId = req.usuario?.id;
            if (!esObjectId(usuarioId)) {
                return res.status(401).json({ message: 'Se requiere una sesión autenticada' });
            }

            const usuario = await usuarioModel.getUsuario({ _id: usuarioId }, { incluirPermisos: true });
            if (!usuario || !usuario.activo) {
                return res.status(401).json({ message: 'La cuenta no está disponible' });
            }

            const autorizado = usuario.roles.some((rol) =>
                rol?.permisos?.some((permiso) =>
                    permiso.modulo === modulo && permiso.nombreAccion === nombreAccion
                )
            );
            if (!autorizado) {
                return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
            }
            return next();
        } catch (error) {
            console.error('Error al verificar permisos', error);
            return res.status(500).json({ message: 'No se pudieron verificar los permisos' });
        }
    };
}

export function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

export function crearTokenRefresh() {
    return randomBytes(48).toString('base64url');
}

export function crearTokenRefreshParaReintento(token, solicitudId) {
    return createHmac('sha256', process.env.JSON_WEB_TOKEN)
        .update(token)
        .update(':')
        .update(solicitudId)
        .digest('base64url');
}

export function crearTokenAcceso(usuario, sesionId) {
    return userToken({
        id: usuario._id.toString(),
        email: usuario.email,
        sid: sesionId
    });
}