import mongoose from "mongoose";
import cliente from "../schemes/clientes.js";

const getCliente = async (filtro) => {
    return await cliente.findOne(filtro);
};
const crearCliente = async (datos) => {
    return await cliente.create(datos);
};
const eliminarCliente = async (id) => {
    return await cliente.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdCliente = async (id) => {
    return await cliente.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarCliente = async (id, datos) => {
    return await cliente.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allCliente = async () => {
    return await cliente.find();
};

export default { getCliente, crearCliente, eliminarCliente, getIdCliente, actualizarCliente, allCliente };
