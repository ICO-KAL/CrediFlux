import mongoose from "mongoose";
import usuarios from "../schemes/usuarios.js";

const getUsuario = async (filtro, { incluirPassword = false, incluirPermisos = false } = {}) => {
    const consulta = usuarios.findOne(filtro);
    if (incluirPassword) consulta.select("+passwordHash");
    if (incluirPermisos) {
        consulta.populate({ path: "roles", populate: { path: "permisos" } });
    }
    return await consulta;
};

const crearUsuario = async (usuario) => {
    return await usuarios.create(usuario);
};

const eliminarUsuario = async (id) => {
    return await usuarios.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};


const actualizarUsuario = async (id, usuario) => {
    return await usuarios.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, usuario, { new: true });
};

const allUsuario = async () => {
    return await usuarios.find();
};

const contarUsuariosConRol = async (rolId) => {
    return await usuarios.countDocuments({
        roles: new mongoose.Types.ObjectId(rolId)
    });
};

export default{
    getUsuario,
    crearUsuario,
    eliminarUsuario,
    actualizarUsuario,
    allUsuario,
    contarUsuariosConRol
};
