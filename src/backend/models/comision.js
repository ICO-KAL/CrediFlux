import mongoose from "mongoose";
import comision from "../schemes/comisiones.js";

const getComision = async (filtro) => {
    return await comision.findOne(filtro);
};
const crearComision = async (datos) => {
    return await comision.create(datos);
};
const eliminarComision = async (id) => {
    return await comision.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdComision = async (id) => {
    return await comision.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarComision = async (id, datos) => {
    return await comision.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allComision = async () => {
    return await comision.find();
};

export default { getComision, crearComision, eliminarComision, getIdComision, actualizarComision, allComision };
