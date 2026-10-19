import mongoose from "mongoose";
import documentoCliente from "../schemes/documentos_cliente";

const getDocumentoCliente = async (filtro) => {
    return await documentoCliente.findOne(filtro);
};
const crearDocumentoCliente = async (datos) => {
    return await documentoCliente.create(datos);
};
const eliminarDocumentoCliente = async (id) => {
    return await documentoCliente.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdDocumentoCliente = async (id) => {
    return await documentoCliente.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarDocumentoCliente = async (id, datos) => {
    return await documentoCliente.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allDocumentoCliente = async () => {
    return await documentoCliente.find();
};

export default { getDocumentoCliente, crearDocumentoCliente, eliminarDocumentoCliente, getIdDocumentoCliente, actualizarDocumentoCliente, allDocumentoCliente };
