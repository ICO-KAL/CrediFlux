import mongoose from 'mongoose';
import sesiones from '../models/sesion.js';
import usuarioModel from '../models/usuario.js';
import { crearTokenRefresh, crearTokenRefreshParaReintento, crearTokenAcceso, hashToken } from '../helpers/autentic.js';
import { esObjectId } from '../helpers/controlador.js';

const duracionSesionMs = 30 * 24 * 60 * 60 * 1000;

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
        const { tokenRefresh, solicitudId } = req.body ?? {};
        if (typeof tokenRefresh !== 'string' || tokenRefresh.length === 0) {
            return res.status(400).json({ message: 'Se requiere el token de renovación' });
        }
        if (solicitudId !== undefined && (typeof solicitudId !== 'string' || !/^[a-f0-9-]{36}$/i.test(solicitudId))) {
            return res.status(400).json({ message: 'Identificador de renovación inválido' });
        }

        const tokenRefreshHash = hashToken(tokenRefresh);
        let sesion = await sesiones.getSesion({
            tokenRefresh: tokenRefreshHash,
            expiraEn: { $gt: new Date() }
        });
        let reintento = false;
        if (!sesion && solicitudId) {
            sesion = await sesiones.getSesion({
                tokenRefreshAnterior: tokenRefreshHash,
                solicitudRenovacion: solicitudId,
                reintentoHasta: { $gt: new Date() },
                expiraEn: { $gt: new Date() }
            });
            reintento = Boolean(sesion);
            if (!sesion) {
                const resultadoPerdido = await sesiones.getSesion({
                    tokenRefreshAnterior: tokenRefreshHash,
                    solicitudRenovacion: solicitudId,
                    expiraEn: { $gt: new Date() }
                });
                if (resultadoPerdido) {
                    return res.status(409).json({
                        code: 'RENEWAL_RESULT_LOST',
                        message: 'No se pudo recuperar la renovación anterior. Inicia sesión nuevamente.'
                    });
                }
            }
        }
        if (!sesion) return res.status(401).json({ code: 'SESSION_INVALID', message: 'La sesión no es válida o ha expirado' });

        const usuario = await usuarioModel.getUsuario({ _id: sesion.usuarioId.toString() });
        if (!usuario || !usuario.activo) {
            await sesiones.eliminarSesion({ _id: sesion._id });
            return res.status(401).json({
                code: usuario ? 'ACCOUNT_INACTIVE' : 'SESSION_INVALID',
                message: usuario ? 'Tu cuenta se encuentra inactiva. Contacta con el administrador.' : 'La sesión no es válida'
            });
        }

        const nuevoRefreshToken = solicitudId
            ? crearTokenRefreshParaReintento(tokenRefresh, solicitudId)
            : crearTokenRefresh();
        const nuevaExpiracion = new Date(Date.now() + duracionSesionMs);
        const token = crearTokenAcceso(usuario, sesion._id.toString());
        let sesionActualizada = reintento ? sesion : await sesiones.actualizarSesion(
            sesion._id.toString(),
            { $set: {
                tokenRefresh: hashToken(nuevoRefreshToken),
                expiraEn: nuevaExpiracion,
                tokenRefreshAnterior: solicitudId ? tokenRefreshHash : null,
                solicitudRenovacion: solicitudId || null,
                reintentoHasta: solicitudId ? new Date(Date.now() + 120000) : null
            } },
            { tokenRefresh: tokenRefreshHash, expiraEn: { $gt: new Date() } }
        );
        if (!sesionActualizada && solicitudId) {
            sesionActualizada = await sesiones.getSesion({
                _id: sesion._id,
                tokenRefreshAnterior: tokenRefreshHash,
                solicitudRenovacion: solicitudId,
                reintentoHasta: { $gt: new Date() },
                expiraEn: { $gt: new Date() }
            });
        }
        if (!sesionActualizada) {
            return res.status(401).json({ code: 'SESSION_INVALID', message: 'El token de renovación ya no es válido' });
        }

        return res.status(200).json({
            token,
            tokenRefresh: nuevoRefreshToken,
            expiraEn: sesionActualizada.expiraEn
        });
    } catch (error) {
        console.error('Error al renovar la sesión', error);
        return res.status(500).json({ message: 'Error al renovar la sesión' });
    }
}

export async function cerrarSesion(req, res) {
    try {
        const { id: usuarioId, sid: sesionId } = req.usuario ?? {};
        if (!esObjectId(usuarioId) || !esObjectId(sesionId)) {
            return res.status(401).json({ message: 'El token de acceso no contiene una sesión válida' });
        }

        await sesiones.eliminarSesion({ usuarioId });
        return res.status(200).json({ message: 'Sesión cerrada en todos los dispositivos' });
    } catch (error) {
        console.error('Error al cerrar la sesión', error);
        return res.status(500).json({ message: 'Error al cerrar la sesión' });
    }
}

export async function obtenerMisSesiones(req, res) {
    try {
        const { id: usuarioId, sid: sesionActualId } = req.usuario ?? {};
        if (!esObjectId(usuarioId)) {
            return res.status(401).json({ message: 'El token de acceso no contiene un usuario válido' });
        }

        const sesionesUsuario = await sesiones.allSesion(
            { usuarioId, expiraEn: { $gt: new Date() } },
            { seleccion: 'dispositivo ip expiraEn createdAt' }
        );
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
