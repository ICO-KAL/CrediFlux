import mongoose from "mongoose";
import consentimiento from "../schemes/consentimientos.js";

const getConsentimiento = async (filtro) => {
    return await consentimiento.findOne(filtro);
};
const crearConsentimiento = async (datos) => {
    return await consentimiento.create(datos);
};
const eliminarConsentimiento = async (id) => {
    return await consentimiento.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdConsentimiento = async (id) => {
    return await consentimiento.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarConsentimiento = async (id, datos) => {
    return await consentimiento.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allConsentimiento = async () => {
    return await consentimiento.find();
};

export default { getConsentimiento, crearConsentimiento, eliminarConsentimiento, getIdConsentimiento, actualizarConsentimiento, allConsentimiento };
