import mongoose from "mongoose";
import permiso from "../schemes/permisos.js";

const getPermiso = async (filtro) => {
    return await permiso.findOne(filtro);
};
const crearPermiso = async (datos) => {
    return await permiso.create(datos);
};
const eliminarPermiso = async (id) => {
    return await permiso.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};
const getIdPermiso = async (id) => {
    return await permiso.findOne({ _id: new mongoose.Types.ObjectId(id) });
};
const actualizarPermiso = async (id, datos) => {
    return await permiso.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, datos, { new: true });
};
const allPermiso = async () => {
    return await permiso.find();
};

export default { getPermiso, crearPermiso, eliminarPermiso, getIdPermiso, actualizarPermiso, allPermiso };
