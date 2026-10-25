import mongoose from "mongoose";
import decisionCredito from "../schemes/decisiones_credito.js";

const getDecisionCredito = async (filtro) => {
    return await decisionCredito.findOne(filtro);
};
const crearDecisionCredito = async (datos) => {
    return await decisionCredito.create(datos);
};
const eliminarDecisionCredito = async (id) => {
    return await decisionCredito.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdDecisionCredito = async (id) => {
    return await decisionCredito.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarDecisionCredito = async (id, datos) => {
    return await decisionCredito.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allDecisionCredito = async () => {
    return await decisionCredito.find();
};

export default { getDecisionCredito, crearDecisionCredito, eliminarDecisionCredito, getIdDecisionCredito, actualizarDecisionCredito, allDecisionCredito };
