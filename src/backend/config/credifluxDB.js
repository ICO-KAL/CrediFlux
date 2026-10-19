import mongoose, { mongo } from 'mongoose';
import path from 'path';
import dotenv from'dotenv';

export async function credifluxdb(){
    try{
       dotenv.config({path: path.resolve(import.meta.dirname, '../../../.env') });
       await mongoose.connect(`mongodb+srv://${process.env.name}:${process.env.passwoard}@crediflux.rryk9jr.mongodb.net/`);
       console.log("base de datos conectada");
    }
    catch(e){
        console.log('Error de conexion',e);
    }
}

export async function disconnectCredifluxdb(){
    try{
       await mongoose.disconnect(`mongodb+srv://${process.env.name}:${process.env.passwoard}@crediflux.rryk9jr.mongodb.net/`);
       console.log("base de datos desconectada");
    }catch(e){
        console.log('Error al desconectar la base de datos');
    }
}