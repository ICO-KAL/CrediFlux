import mongoose from "mongoose";
import sesion from "../schemes/sesiones.js";

const getSesion = async (filtro) => {
    return await sesion.findOne(filtro);
};
const crearSesion = async (datos) => {
    return await sesion.create(datos);
};
const eliminarSesion = async (id) => {
    return await sesion.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdSesion = async (id) => {
    return await sesion.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarSesion = async (id, datos) => {
    return await sesion.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        datos,
        { new: true, runValidators: true }
    );
};
const allSesion = async () => {
    return await sesion.find();
};

const rotarTokenRefresh = async (id, tokenRefreshAnterior, tokenRefreshNuevo, expiraEn) => {
    return await sesion.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(id),
            tokenRefresh: tokenRefreshAnterior,
            expiraEn: { $gt: new Date() }
        },
        { $set: { tokenRefresh: tokenRefreshNuevo, expiraEn } },
        { new: true, runValidators: true }
    );
};

const eliminarSesionDeUsuario = async (id, usuarioId) => {
    return await sesion.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        usuarioId: new mongoose.Types.ObjectId(usuarioId)
    });
};

const eliminarOtrasSesiones = async (usuarioId, sesionActualId) => {
    return await sesion.deleteMany({
        usuarioId: new mongoose.Types.ObjectId(usuarioId),
        _id: { $ne: new mongoose.Types.ObjectId(sesionActualId) }
    });
};

const listarSesionesDeUsuario = async (usuarioId, ahora = new Date()) => {
    return await sesion.find({
        usuarioId: new mongoose.Types.ObjectId(usuarioId),
        expiraEn: { $gt: ahora }
    }).select('dispositivo ip expiraEn createdAt');
};

export default {
    getSesion,
    crearSesion,
    eliminarSesion,
    getIdSesion,
    actualizarSesion,
    allSesion,
    rotarTokenRefresh,
    eliminarSesionDeUsuario,
    eliminarOtrasSesiones,
    listarSesionesDeUsuario
};
