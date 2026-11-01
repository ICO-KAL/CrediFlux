import mongoose from "mongoose";
import cuentaCredito from "../schemes/cuentas_credito.js";

const getCuentaCredito = async (filtro) => {
    return await cuentaCredito.findOne(filtro);
};
const crearCuentaCredito = async (datos) => {
    return await cuentaCredito.create(datos);
};
const eliminarCuentaCredito = async (id) => {
    return await cuentaCredito.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdCuentaCredito = async (id) => {
    return await cuentaCredito.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarCuentaCredito = async (id, datos) => {
    return await cuentaCredito.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allCuentaCredito = async () => {
    return await cuentaCredito.find();
};

export default { getCuentaCredito, crearCuentaCredito, eliminarCuentaCredito, getIdCuentaCredito, actualizarCuentaCredito, allCuentaCredito };
