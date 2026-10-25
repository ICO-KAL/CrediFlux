import usuarioModel from "../models/usuario.js";
import bcrypt from 'bcryptjs';
import { crearSesionAutenticada } from './sesiones_controller.js';

export async function register(req, res) {
    try {
        const { username, email, passwordHash } = req.body;
        if (!username || !email || !passwordHash) {
            return res.status(400).json({ message: "Se requiere usuario, email y contraseña" });
        }
        if (await usuarioModel.getUsuario({ email })) {
            return res.status(409).json({ message: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(passwordHash, 8);
        const usuario = await usuarioModel.crearUsuario({
            username,
            email,
            passwordHash: hashedPassword
        });

        return res.status(201).json({
            message: "Usuario registrado",
            usuario: {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email,
                activo: usuario.activo
            }
        });
    } catch (error) {
        console.error("Error al registrarse", error);
        return res.status(500).json({ message: "Error al registrar usuario" });
    }
}

export async function login(req, res) {
    try {
        const { email, passwordHash } = req.body;
        if (!email || !passwordHash) {
            return res.status(400).json({ message: "Se requieren email y contraseña" });
        }

        const usuario = await usuarioModel.getUsuarioParaLogin(email);
        if (!usuario || !await bcrypt.compare(passwordHash, usuario.passwordHash)) {
            return res.status(401).json({ message: "Email o contraseña incorrectos" });
        }
        if (!usuario.activo) {
            return res.status(403).json({ message: "La cuenta está desactivada" });
        }

        const { token, tokenRefresh, expiraEn } = await crearSesionAutenticada(usuario, req);
        return res.status(200).json({
            message: "Inicio de sesión correcto",
            usuario: {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email,
                activo: usuario.activo
            },
            token,
            tokenRefresh,
            expiraEn
        });
    } catch (error) {
        console.error("Error al iniciar sesión", error);
        return res.status(500).json({ message: "Error al iniciar sesión" });
    }
}