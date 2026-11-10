import mongoose from "mongoose";
import rol from "../schemes/roles.js";

const getRol = async (filtro, { incluirPermisos = false } = {}) => {
    const consulta = rol.findOne(filtro);
    if (incluirPermisos) consulta.populate('permisos');
    return await consulta;
};
const crearRol = async (datos) => {
    return await rol.create(datos);
};
const eliminarRol = async (id) => {
    return await rol.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarRol = async (id, datos, filtro = {}) => {
    return await rol.findOneAndUpdate(
        { ...filtro, _id: new mongoose.Types.ObjectId(id) },
        datos,
        { new: true, runValidators: true }
    ).populate('permisos');
};
const allRol = async () => {
    return await rol.find().populate('permisos').sort({ nombre: 1 });
};

export default {
    getRol,
    crearRol,
    eliminarRol,
    actualizarRol,
    allRol
};
