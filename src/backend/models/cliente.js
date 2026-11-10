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
const actualizarCliente = async (id, datos, opciones = {}) => {
    return await cliente.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true, ...opciones });
};
const allCliente = async () => {
    return await cliente.find();
};

export default { getCliente, crearCliente, eliminarCliente, actualizarCliente, allCliente };
