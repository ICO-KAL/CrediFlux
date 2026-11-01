import mongoose from "mongoose";
import direccion from "../schemes/direcciones.js";

const getDireccion = async (filtro) => {
    return await direccion.findOne(filtro);
};
const crearDireccion = async (datos) => {
    return await direccion.create(datos);
};
const eliminarDireccion = async (id) => {
    return await direccion.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdDireccion = async (id) => {
    return await direccion.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarDireccion = async (id, datos) => {
    return await direccion.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        datos,
        { new: true, runValidators: true }
    );
};
const allDireccion = async () => {
    return await direccion.find();
};

export default { getDireccion, crearDireccion, eliminarDireccion, getIdDireccion, actualizarDireccion, allDireccion };
