import mongoose from "mongoose";
import rol from "../schemes/roles.js";

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
    return await rol.findOne({ _id: new mongoose.Types.ObjectId(id) }).populate('permisos');
};
const actualizarRol = async (id, datos) => {
    return await rol.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        datos,
        { new: true, runValidators: true }
    ).populate('permisos');
};
const allRol = async () => {
    return await rol.find().populate('permisos').sort({ nombre: 1 });
};

const agregarPermiso = async (id, permisoId) => {
    return await rol.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $addToSet: { permisos: new mongoose.Types.ObjectId(permisoId) } },
        { new: true, runValidators: true }
    ).populate('permisos');
};

const quitarPermiso = async (id, permisoId) => {
    const actualizado = await rol.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(id),
            permisos: new mongoose.Types.ObjectId(permisoId)
        },
        { $pull: { permisos: new mongoose.Types.ObjectId(permisoId) } },
        { new: true, runValidators: true }
    ).populate('permisos');
    return { rol: actualizado, permisoExistia: Boolean(actualizado) };
};

export default {
    getRol,
    crearRol,
    eliminarRol,
    getIdRol,
    actualizarRol,
    allRol,
    agregarPermiso,
    quitarPermiso
};
