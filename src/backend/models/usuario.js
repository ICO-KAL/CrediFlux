import usuarios from "../schemes/usuarios";
import mongoose from "mongoose";

const getUsuario = async (usuario) =>{
    return await usuarios.findOne(usuario);
}

const crearUsuario = async (usuario) =>{
    return await usuarios.create(usuario);
}

const eliminarUsuario = async (id) =>{
    return await usuarios.findByIdAndDelete({_id: new mongoose.Types.ObjectId(id)});
} 

const getIdUsuario = async (id) =>{
    return await usuarios.findById({_id: new mongoose.Types.ObjectId(id)});
}

const actualizarUsuario = async (id,usuario) =>{
    return await usuarios.findByIdAndUpdate({_id: new mongoose.Types.ObjectId(id)},usuario,{new: true});
}

const allUsuario = async () =>{
    return await usuarios.find();
}

export default {
    getUsuario,
    crearUsuario,
    eliminarUsuario,
    getIdUsuario,
    actualizarUsuario,
    allUsuario
}