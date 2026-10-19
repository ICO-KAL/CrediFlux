import mongoose from "mongoose";
import claveIdempotencia from "../schemes/claves_idempotencia";

const getClaveIdempotencia = async (filtro) => {
    return await claveIdempotencia.findOne(filtro);
};
const crearClaveIdempotencia = async (datos) => {
    return await claveIdempotencia.create(datos);
};
const eliminarClaveIdempotencia = async (id) => {
    return await claveIdempotencia.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdClaveIdempotencia = async (id) => {
    return await claveIdempotencia.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarClaveIdempotencia = async (id, datos) => {
    return await claveIdempotencia.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allClaveIdempotencia = async () => {
    return await claveIdempotencia.find();
};

export default { getClaveIdempotencia, crearClaveIdempotencia, eliminarClaveIdempotencia, getIdClaveIdempotencia, actualizarClaveIdempotencia, allClaveIdempotencia };
