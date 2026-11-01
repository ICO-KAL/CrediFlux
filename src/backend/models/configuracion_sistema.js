import mongoose from "mongoose";
import configuracionSistema from "../schemes/configuracion_sistema.js";

const getConfiguracionSistema = async (filtro) => {
    return await configuracionSistema.findOne(filtro);
};
const crearConfiguracionSistema = async (datos) => {
    return await configuracionSistema.create(datos);
};
const eliminarConfiguracionSistema = async (id) => {
    return await configuracionSistema.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdConfiguracionSistema = async (id) => {
    return await configuracionSistema.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarConfiguracionSistema = async (id, datos) => {
    return await configuracionSistema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allConfiguracionSistema = async () => {
    return await configuracionSistema.find();
};

export default { getConfiguracionSistema, crearConfiguracionSistema, eliminarConfiguracionSistema, getIdConfiguracionSistema, actualizarConfiguracionSistema, allConfiguracionSistema };
