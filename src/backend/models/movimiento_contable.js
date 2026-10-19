import mongoose from "mongoose";
import movimientoContable from "../schemes/movimientos_contables";

const getMovimientoContable = async (filtro) => {
    return await movimientoContable.findOne(filtro);
};
const crearMovimientoContable = async (datos) => {
    return await movimientoContable.create(datos);
};
const eliminarMovimientoContable = async (id) => {
    return await movimientoContable.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdMovimientoContable = async (id) => {
    return await movimientoContable.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarMovimientoContable = async (id, datos) => {
    return await movimientoContable.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allMovimientoContable = async () => {
    return await movimientoContable.find();
};

export default { getMovimientoContable, crearMovimientoContable, eliminarMovimientoContable, getIdMovimientoContable, actualizarMovimientoContable, allMovimientoContable };
