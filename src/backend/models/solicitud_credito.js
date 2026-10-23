import mongoose from "mongoose";
import solicitudCredito from "../schemes/solicitudes_credito";

const getSolicitudCredito = async (filtro) => {
    return await solicitudCredito.findOne(filtro);
};
const crearSolicitudCredito = async (datos) => {
    return await solicitudCredito.create(datos);
};
const eliminarSolicitudCredito = async (id) => {
    return await solicitudCredito.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdSolicitudCredito = async (id) => {
    return await solicitudCredito.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarSolicitudCredito = async (id, datos) => {
    return await solicitudCredito.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        datos,
        { new: true, runValidators: true }
    );
};
const cambiarEstadoSiPendiente = async (id, estado) => {
    return await solicitudCredito.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id), estado: "pendiente" },
        { $set: { estado } },
        { new: true, runValidators: true }
    );
};
const allSolicitudCredito = async () => {
    return await solicitudCredito.find();
};

const listarSolicitudesCredito = async (filtro, { page, limit }) => {
    const skip = (page - 1) * limit;
    const [solicitudes, total] = await Promise.all([
        solicitudCredito.find(filtro).sort({ createdAt: -1 }).skip(skip).limit(limit),
        solicitudCredito.countDocuments(filtro)
    ]);
    return { solicitudes, total };
};

export default {
    getSolicitudCredito,
    crearSolicitudCredito,
    eliminarSolicitudCredito,
    getIdSolicitudCredito,
    actualizarSolicitudCredito,
    cambiarEstadoSiPendiente,
    allSolicitudCredito,
    listarSolicitudesCredito
};
