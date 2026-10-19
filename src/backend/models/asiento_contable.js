import mongoose from "mongoose";
import asientoContable from "../schemes/asientos_contables";

const getAsientoContable = async (filtro) => {
    return await asientoContable.findOne(filtro);
};
const crearAsientoContable = async (datos) => {
    return await asientoContable.create(datos);
};
const eliminarAsientoContable = async (id) => {
    return await asientoContable.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdAsientoContable = async (id) => {
    return await asientoContable.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarAsientoContable = async (id, datos) => {
    return await asientoContable.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allAsientoContable = async () => {
    return await asientoContable.find();
};

export default { getAsientoContable, crearAsientoContable, eliminarAsientoContable, getIdAsientoContable, actualizarAsientoContable, allAsientoContable };
