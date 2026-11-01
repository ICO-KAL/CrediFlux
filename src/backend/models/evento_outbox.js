import mongoose from "mongoose";
import eventoOutbox from "../schemes/eventos_outbox.js";

const getEventoOutbox = async (filtro) => {
    return await eventoOutbox.findOne(filtro);
};
const crearEventoOutbox = async (datos) => {
    return await eventoOutbox.create(datos);
};
const eliminarEventoOutbox = async (id) => {
    return await eventoOutbox.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdEventoOutbox = async (id) => {
    return await eventoOutbox.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarEventoOutbox = async (id, datos) => {
    return await eventoOutbox.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allEventoOutbox = async () => {
    return await eventoOutbox.find();
};

export default { getEventoOutbox, crearEventoOutbox, eliminarEventoOutbox, getIdEventoOutbox, actualizarEventoOutbox, allEventoOutbox };
