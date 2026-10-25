import { createHash, randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import sesiones from '../models/sesion.js';
import usuarioModel from '../models/usuario.js';
import { userToken } from '../helpers/autentic.js';

const duracionSesionMs = 30 * 24 * 60 * 60 * 1000;

function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

function crearTokenRefresh() {
    return randomBytes(48).toString('base64url');
}

function crearTokenAcceso(usuario, sesionId) {
    return userToken({
        id: usuario._id.toString(),
        email: usuario.email,
        sid: sesionId
    });
}

export async function crearSesionAutenticada(usuario, req) {
    const refreshToken = crearTokenRefresh();
    const expiraEn = new Date(Date.now() + duracionSesionMs);
    const sesionId = new mongoose.Types.ObjectId();
    const token = crearTokenAcceso(usuario, sesionId.toString());
    await sesiones.crearSesion({
        _id: sesionId,
        usuarioId: usuario._id,
        tokenRefresh: hashToken(refreshToken),
        dispositivo: req.get('user-agent')?.slice(0, 300),
        ip: req.ip,
        expiraEn
    });

    return {
        token,
        tokenRefresh: refreshToken,
        expiraEn
    };
}

export async function renovarSesion(req, res) {
    try {
        const { tokenRefresh } = req.body ?? {};
        if (typeof tokenRefresh !== 'string' || tokenRefresh.length === 0) {
            return res.status(400).json({ message: 'Se requiere el token de renovación' });
        }

        const tokenRefreshHash = hashToken(tokenRefresh);
        const sesion = await sesiones.getSesion({
            tokenRefresh: tokenRefreshHash,
            expiraEn: { $gt: new Date() }
        });
        if (!sesion) return res.status(401).json({ message: 'La sesión no es válida o ha expirado' });

        const usuario = await usuarioModel.getIdUsuario(sesion.usuarioId.toString());
        if (!usuario || !usuario.activo) {
            await sesiones.eliminarSesion(sesion._id.toString());
            return res.status(401).json({ message: 'La sesión no es válida' });
        }

        const nuevoRefreshToken = crearTokenRefresh();
        const nuevaExpiracion = new Date(Date.now() + duracionSesionMs);
        const token = crearTokenAcceso(usuario, sesion._id.toString());
        const sesionActualizada = await sesiones.rotarTokenRefresh(
            sesion._id.toString(),
            tokenRefreshHash,
            hashToken(nuevoRefreshToken),
            nuevaExpiracion
        );
        if (!sesionActualizada) {
            return res.status(401).json({ message: 'El token de renovación ya no es válido' });
        }

        return res.status(200).json({
            token,
            tokenRefresh: nuevoRefreshToken,
            expiraEn: nuevaExpiracion
        });
    } catch (error) {
        console.error('Error al renovar la sesión', error);
        return res.status(500).json({ message: 'Error al renovar la sesión' });
    }
}

export async function cerrarSesion(req, res) {
    try {
        const { id: usuarioId, sid: sesionId } = req.usuario ?? {};
        if (!mongoose.Types.ObjectId.isValid(usuarioId) || !mongoose.Types.ObjectId.isValid(sesionId)) {
            return res.status(401).json({ message: 'El token de acceso no contiene una sesión válida' });
        }

        await sesiones.eliminarSesionDeUsuario(sesionId, usuarioId);
        return res.status(200).json({ message: 'Sesión cerrada' });
    } catch (error) {
        console.error('Error al cerrar la sesión', error);
        return res.status(500).json({ message: 'Error al cerrar la sesión' });
    }
}

export async function obtenerMisSesiones(req, res) {
    try {
        const { id: usuarioId, sid: sesionActualId } = req.usuario ?? {};
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(401).json({ message: 'El token de acceso no contiene un usuario válido' });
        }

        const sesionesUsuario = await sesiones.listarSesionesDeUsuario(usuarioId, new Date());
        return res.status(200).json({
            sesiones: sesionesUsuario.map((sesion) => ({
                id: sesion._id,
                dispositivo: sesion.dispositivo,
                ip: sesion.ip,
                expiraEn: sesion.expiraEn,
                creadaEn: sesion.createdAt,
                actual: sesion._id.toString() === sesionActualId
            }))
        });
    } catch (error) {
        console.error('Error al listar las sesiones', error);
        return res.status(500).json({ message: 'Error al listar las sesiones' });
    }
}

export async function cerrarOtrasSesiones(req, res) {
    try {
        const { id: usuarioId, sid: sesionActualId } = req.usuario ?? {};
        if (!mongoose.Types.ObjectId.isValid(usuarioId) || !mongoose.Types.ObjectId.isValid(sesionActualId)) {
            return res.status(401).json({ message: 'El token de acceso no contiene una sesión válida' });
        }

        const cerradas = await sesiones.eliminarOtrasSesiones(usuarioId, sesionActualId);
        return res.status(200).json({
            message: 'Se cerraron las otras sesiones',
            sesionesCerradas: cerradas.deletedCount
        });
    } catch (error) {
        console.error('Error al cerrar otras sesiones', error);
        return res.status(500).json({ message: 'Error al cerrar otras sesiones' });
    }
}
