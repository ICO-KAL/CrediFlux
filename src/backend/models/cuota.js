import mongoose from "mongoose";
import cuota from "../schemes/cuotas";

const getCuota = async (filtro) => {
    return await cuota.findOne(filtro);
};
const crearCuota = async (datos) => {
    return await cuota.create(datos);
};
const eliminarCuota = async (id) => {
    return await cuota.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdCuota = async (id) => {
    return await cuota.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarCuota = async (id, datos) => {
    return await cuota.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allCuota = async () => {
    return await cuota.find();
};

export default { getCuota, crearCuota, eliminarCuota, getIdCuota, actualizarCuota, allCuota };
