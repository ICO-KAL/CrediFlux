import mongoose from "mongoose";
import prestamo from "../schemes/prestamos.js";

const getPrestamo = async (filtro) => {
    return await prestamo.findOne(filtro);
};
const crearPrestamo = async (datos) => {
    return await prestamo.create(datos);
};
const eliminarPrestamo = async (id) => {
    return await prestamo.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdPrestamo = async (id) => {
    return await prestamo.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarPrestamo = async (id, datos) => {
    return await prestamo.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allPrestamo = async () => {
    return await prestamo.find();
};

export default { getPrestamo, crearPrestamo, eliminarPrestamo, getIdPrestamo, actualizarPrestamo, allPrestamo };
