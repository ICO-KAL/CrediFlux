import mongoose from "mongoose";
import autorizacionTarjeta from "../schemes/autorizaciones_tarjeta";

const getAutorizacionTarjeta = async (filtro) => {
    return await autorizacionTarjeta.findOne(filtro);
};
const crearAutorizacionTarjeta = async (datos) => {
    return await autorizacionTarjeta.create(datos);
};
const eliminarAutorizacionTarjeta = async (id) => {
    return await autorizacionTarjeta.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdAutorizacionTarjeta = async (id) => {
    return await autorizacionTarjeta.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarAutorizacionTarjeta = async (id, datos) => {
    return await autorizacionTarjeta.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allAutorizacionTarjeta = async () => {
    return await autorizacionTarjeta.find();
};

export default { getAutorizacionTarjeta, crearAutorizacionTarjeta, eliminarAutorizacionTarjeta, getIdAutorizacionTarjeta, actualizarAutorizacionTarjeta, allAutorizacionTarjeta };
