import mongoose from "mongoose";
import auditoria from "../schemes/auditoria";

const getAuditoria = async (filtro) => {
    return await auditoria.findOne(filtro);
};
const crearAuditoria = async (datos) => {
    return await auditoria.create(datos);
};
const eliminarAuditoria = async (id) => {
    return await auditoria.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdAuditoria = async (id) => {
    return await auditoria.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarAuditoria = async (id, datos) => {
    return await auditoria.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allAuditoria = async () => {
    return await auditoria.find();
};

export default { getAuditoria, crearAuditoria, eliminarAuditoria, getIdAuditoria, actualizarAuditoria, allAuditoria };
