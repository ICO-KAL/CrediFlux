import mongoose from "mongoose";
import planAmortizacion from "../schemes/planes_amortizacion";

const getPlanAmortizacion = async (filtro) => {
    return await planAmortizacion.findOne(filtro);
};
const crearPlanAmortizacion = async (datos) => {
    return await planAmortizacion.create(datos);
};
const eliminarPlanAmortizacion = async (id) => {
    return await planAmortizacion.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdPlanAmortizacion = async (id) => {
    return await planAmortizacion.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarPlanAmortizacion = async (id, datos) => {
    return await planAmortizacion.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allPlanAmortizacion = async () => {
    return await planAmortizacion.find();
};

export default { getPlanAmortizacion, crearPlanAmortizacion, eliminarPlanAmortizacion, getIdPlanAmortizacion, actualizarPlanAmortizacion, allPlanAmortizacion };
