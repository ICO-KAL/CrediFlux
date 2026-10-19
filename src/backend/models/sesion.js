import mongoose from "mongoose";
import sesion from "../schemes/sesiones";

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
    return await sesion.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allSesion = async () => {
    return await sesion.find();
};

export default { getSesion, crearSesion, eliminarSesion, getIdSesion, actualizarSesion, allSesion };
