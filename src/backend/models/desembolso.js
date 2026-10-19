import mongoose from "mongoose";
import desembolso from "../schemes/desembolsos";

const getDesembolso = async (filtro) => {
    return await desembolso.findOne(filtro);
};
const crearDesembolso = async (datos) => {
    return await desembolso.create(datos);
};
const eliminarDesembolso = async (id) => {
    return await desembolso.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdDesembolso = async (id) => {
    return await desembolso.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarDesembolso = async (id, datos) => {
    return await desembolso.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allDesembolso = async () => {
    return await desembolso.find();
};

export default { getDesembolso, crearDesembolso, eliminarDesembolso, getIdDesembolso, actualizarDesembolso, allDesembolso };
