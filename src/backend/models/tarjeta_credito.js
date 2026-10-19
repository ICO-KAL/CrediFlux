import mongoose from "mongoose";
import tarjetasCredito from "../schemes/tarjetas_credito";

const getTarjeta_credito = async (id) => {
    return await tarjetasCredito.findOne({ _id: new mongoose.Types.ObjectId(id) });
};

const crearTarjeta_credito = async (tarjetaCredito) => {
    return await tarjetasCredito.create(tarjetaCredito);
};

const eliminarTarjeta_credito = async (id) => {
    return await tarjetasCredito.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};

const actualizarTarjeta_credito = async (id, tarjetaCredito) => {
    return await tarjetasCredito.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, tarjetaCredito, { new: true });
};

const allTarjeta_credito = async () => {
    return await tarjetasCredito.find();
};

export default {
    getTarjeta_credito,
    crearTarjeta_credito,
    eliminarTarjeta_credito,
    actualizarTarjeta_credito,
    allTarjeta_credito
};
