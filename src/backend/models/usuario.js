import mongoose from "mongoose";
import usuarios from "../schemes/usuarios";

const getUsuario = async (usuario) => {
    return await usuarios.findOne(usuario);
};

const getUsuarioParaLogin = async (email) => {
    return await usuarios.findOne({ email }).select("+passwordHash");
};

const crearUsuario = async (usuario) => {
    return await usuarios.create(usuario);
};

const eliminarUsuario = async (id) => {
    return await usuarios.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};

const getIdUsuario = async (id) => {
    return await usuarios.findOne({ _id: new mongoose.Types.ObjectId(id) });
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
    getUsuarioParaLogin,
    crearUsuario,
    eliminarUsuario,
    getIdUsuario,
    actualizarUsuario,
    allUsuario,
    contarUsuariosConRol
};
