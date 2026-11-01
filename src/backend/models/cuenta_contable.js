import mongoose from "mongoose";
import cuentaContable from "../schemes/cuentas_contables.js";

const getCuentaContable = async (filtro) => {
    return await cuentaContable.findOne(filtro);
};
const crearCuentaContable = async (datos) => {
    return await cuentaContable.create(datos);
};
const eliminarCuentaContable = async (id) => {
    return await cuentaContable.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdCuentaContable = async (id) => {
    return await cuentaContable.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarCuentaContable = async (id, datos) => {
    return await cuentaContable.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allCuentaContable = async () => {
    return await cuentaContable.find();
};

export default { getCuentaContable, crearCuentaContable, eliminarCuentaContable, getIdCuentaContable, actualizarCuentaContable, allCuentaContable };
