import mongoose from "mongoose";
import transaccionFinanciera from "../schemes/transacciones_financieras.js";

const getTransaccionFinanciera = async (filtro) => {
    return await transaccionFinanciera.findOne(filtro);
};
const crearTransaccionFinanciera = async (datos) => {
    return await transaccionFinanciera.create(datos);
};
const eliminarTransaccionFinanciera = async (id) => {
    return await transaccionFinanciera.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdTransaccionFinanciera = async (id) => {
    return await transaccionFinanciera.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarTransaccionFinanciera = async (id, datos) => {
    return await transaccionFinanciera.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allTransaccionFinanciera = async () => {
    return await transaccionFinanciera.find();
};

export default { getTransaccionFinanciera, crearTransaccionFinanciera, eliminarTransaccionFinanciera, getIdTransaccionFinanciera, actualizarTransaccionFinanciera, allTransaccionFinanciera };
