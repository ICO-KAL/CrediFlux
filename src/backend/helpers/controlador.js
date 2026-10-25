import mongoose from 'mongoose';

export function esObjectId(id) {
    return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

export function validarPaginacion(query) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        return null;
    }
    return { page, limit, skip: (page - 1) * limit };
}

export function responderError(res, error, mensaje) {
    if (error?.code === 11000) {
        return res.status(409).json({ message: 'Ya existe un registro con esos datos únicos' });
    }
    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: 'Los datos enviados no son válidos' });
    }
    console.error(mensaje, error);
    return res.status(500).json({ message: mensaje });
}
