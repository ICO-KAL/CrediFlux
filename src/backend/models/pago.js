import mongoose from "mongoose";
import pago from "../schemes/pagos";

const getPago = async (filtro) => {
    return await pago.findOne(filtro);
};
const crearPago = async (datos) => {
    return await pago.create(datos);
};
const eliminarPago = async (id) => {
    return await pago.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdPago = async (id) => {
    return await pago.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarPago = async (id, datos) => {
    return await pago.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allPago = async () => {
    return await pago.find();
};

export default { getPago, crearPago, eliminarPago, getIdPago, actualizarPago, allPago };
