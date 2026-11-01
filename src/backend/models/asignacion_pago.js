import mongoose from "mongoose";
import asignacionPago from "../schemes/asignaciones_pago.js";

const getAsignacionPago = async (filtro) => {
    return await asignacionPago.findOne(filtro);
};
const crearAsignacionPago = async (datos) => {
    return await asignacionPago.create(datos);
};
const eliminarAsignacionPago = async (id) => {
    return await asignacionPago.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdAsignacionPago = async (id) => {
    return await asignacionPago.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarAsignacionPago = async (id, datos) => {
    return await asignacionPago.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allAsignacionPago = async () => {
    return await asignacionPago.find();
};

export default { getAsignacionPago, crearAsignacionPago, eliminarAsignacionPago, getIdAsignacionPago, actualizarAsignacionPago, allAsignacionPago };
