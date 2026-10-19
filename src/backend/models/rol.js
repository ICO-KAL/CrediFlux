import mongoose from "mongoose";
import rol from "../schemes/roles";

const getRol = async (filtro) => {
    return await rol.findOne(filtro);
};
const crearRol = async (datos) => {
    return await rol.create(datos);
};
const eliminarRol = async (id) => {
    return await rol.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdRol = async (id) => {
    return await rol.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarRol = async (id, datos) => {
    return await rol.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allRol = async () => {
    return await rol.find();
};

export default { getRol, crearRol, eliminarRol, getIdRol, actualizarRol, allRol };
