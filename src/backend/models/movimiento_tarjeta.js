import mongoose from "mongoose";
import movimientoTarjeta from "../schemes/movimientos_tarjeta";

const getMovimientoTarjeta = async (filtro) => {
    return await movimientoTarjeta.findOne(filtro);
};
const crearMovimientoTarjeta = async (datos) => {
    return await movimientoTarjeta.create(datos);
};
const eliminarMovimientoTarjeta = async (id) => {
    return await movimientoTarjeta.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdMovimientoTarjeta = async (id) => {
    return await movimientoTarjeta.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarMovimientoTarjeta = async (id, datos) => {
    return await movimientoTarjeta.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allMovimientoTarjeta = async () => {
    return await movimientoTarjeta.find();
};

export default { getMovimientoTarjeta, crearMovimientoTarjeta, eliminarMovimientoTarjeta, getIdMovimientoTarjeta, actualizarMovimientoTarjeta, allMovimientoTarjeta };
