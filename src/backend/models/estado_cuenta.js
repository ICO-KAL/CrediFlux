import mongoose from "mongoose";
import estadoCuenta from "../schemes/estados_cuenta";

const getEstadoCuenta = async (filtro) => {
    return await estadoCuenta.findOne(filtro);
};
const crearEstadoCuenta = async (datos) => {
    return await estadoCuenta.create(datos);
};
const eliminarEstadoCuenta = async (id) => {
    return await estadoCuenta.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdEstadoCuenta = async (id) => {
    return await estadoCuenta.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarEstadoCuenta = async (id, datos) => {
    return await estadoCuenta.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allEstadoCuenta = async () => {
    return await estadoCuenta.find();
};

export default { getEstadoCuenta, crearEstadoCuenta, eliminarEstadoCuenta, getIdEstadoCuenta, actualizarEstadoCuenta, allEstadoCuenta };
