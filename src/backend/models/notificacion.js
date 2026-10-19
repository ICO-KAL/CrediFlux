import mongoose from "mongoose";
import notificacion from "../schemes/notificaciones";

const getNotificacion = async (filtro) => {
    return await notificacion.findOne(filtro);
};
const crearNotificacion = async (datos) => {
    return await notificacion.create(datos);
};
const eliminarNotificacion = async (id) => {
    return await notificacion.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdNotificacion = async (id) => {
    return await notificacion.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarNotificacion = async (id, datos) => {
    return await notificacion.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allNotificacion = async () => {
    return await notificacion.find();
};

export default { getNotificacion, crearNotificacion, eliminarNotificacion, getIdNotificacion, actualizarNotificacion, allNotificacion };
