import mongoose from "mongoose";
import creadiflux from "../schemes/creadiflux";

const getCreadiflux = async (filtro) => {
    return await creadiflux.findOne(filtro);
};
const crearCreadiflux = async (datos) => {
    return await creadiflux.create(datos);
};
const eliminarCreadiflux = async (id) => {
    return await creadiflux.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdCreadiflux = async (id) => {
    return await creadiflux.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarCreadiflux = async (id, datos) => {
    return await creadiflux.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allCreadiflux = async () => {
    return await creadiflux.find();
};

export default { getCreadiflux, crearCreadiflux, eliminarCreadiflux, getIdCreadiflux, actualizarCreadiflux, allCreadiflux };
