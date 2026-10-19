import mongoose from "mongoose";
import incidenciaRiesgo from "../schemes/incidencias_riesgo";

const getIncidenciaRiesgo = async (filtro) => {
    return await incidenciaRiesgo.findOne(filtro);
};
const crearIncidenciaRiesgo = async (datos) => {
    return await incidenciaRiesgo.create(datos);
};
const eliminarIncidenciaRiesgo = async (id) => {
    return await incidenciaRiesgo.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdIncidenciaRiesgo = async (id) => {
    return await incidenciaRiesgo.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarIncidenciaRiesgo = async (id, datos) => {
    return await incidenciaRiesgo.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allIncidenciaRiesgo = async () => {
    return await incidenciaRiesgo.find();
};

export default { getIncidenciaRiesgo, crearIncidenciaRiesgo, eliminarIncidenciaRiesgo, getIdIncidenciaRiesgo, actualizarIncidenciaRiesgo, allIncidenciaRiesgo };
