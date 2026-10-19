import mongoose from "mongoose";
import evaluacionCrediticia from "../schemes/evaluaciones_crediticias";

const getEvaluacionCrediticia = async (filtro) => {
    return await evaluacionCrediticia.findOne(filtro);
};
const crearEvaluacionCrediticia = async (datos) => {
    return await evaluacionCrediticia.create(datos);
};
const eliminarEvaluacionCrediticia = async (id) => {
    return await evaluacionCrediticia.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdEvaluacionCrediticia = async (id) => {
    return await evaluacionCrediticia.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarEvaluacionCrediticia = async (id, datos) => {
    return await evaluacionCrediticia.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allEvaluacionCrediticia = async () => {
    return await evaluacionCrediticia.find();
};

export default { getEvaluacionCrediticia, crearEvaluacionCrediticia, eliminarEvaluacionCrediticia, getIdEvaluacionCrediticia, actualizarEvaluacionCrediticia, allEvaluacionCrediticia };
