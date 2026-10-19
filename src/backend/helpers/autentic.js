import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';

export function userToken(payload) {
    return jsonwebtoken.sign(payload, process.env.JSON_WEB_TOKEN, {
        expiresIn: '1h'
    });
}

export function verificarToken(req, res, next) {
    const authorization = req.get('Authorization');
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    try {
        req.usuario = jsonwebtoken.verify(token, process.env.JSON_WEB_TOKEN);
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}
