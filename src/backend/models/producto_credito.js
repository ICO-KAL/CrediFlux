import mongoose from "mongoose";
import productoCredito from "../schemes/productos_credito.js";

const getProductoCredito = async (filtro) => {
    return await productoCredito.findOne(filtro);
};
const crearProductoCredito = async (datos) => {
    return await productoCredito.create(datos);
};
const eliminarProductoCredito = async (id) => {
    return await productoCredito.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdProductoCredito = async (id) => {
    return await productoCredito.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarProductoCredito = async (id, datos) => {
    return await productoCredito.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        datos,
        { new: true, runValidators: true }
    );
};
const allProductoCredito = async () => {
    return await productoCredito.find();
};

export default { getProductoCredito, crearProductoCredito, eliminarProductoCredito, getIdProductoCredito, actualizarProductoCredito, allProductoCredito };
