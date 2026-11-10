import mongoose from "mongoose";
import sesion from "../schemes/sesiones.js";

const getSesion = async (filtro) => {
    return await sesion.findOne(filtro);
};
const crearSesion = async (datos) => {
    return await sesion.create(datos);
};
const eliminarSesion = async (filtro) => {
    return await sesion.deleteMany(filtro);
};
const actualizarSesion = async (id, datos, filtro = {}) => {
    return await sesion.findOneAndUpdate(
        { ...filtro, _id: new mongoose.Types.ObjectId(id) },
        datos,
        { new: true, runValidators: true }
    );
};
const allSesion = async (filtro = {}, { seleccion } = {}) => {
    const consulta = sesion.find(filtro);
    if (seleccion) consulta.select(seleccion);
    return await consulta;
};

export default {
    getSesion,
    crearSesion,
    eliminarSesion,
    actualizarSesion,
    allSesion
};
