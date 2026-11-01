import mongoose from 'mongoose';
import path from 'path';
import dotenv from'dotenv';

export async function credifluxdb(){
    try{
       dotenv.config({path: path.resolve(import.meta.dirname, '../../../.env') });
       await mongoose.connect(`mongodb+srv://${process.env.name}:${process.env.passwoard}@crediflux.rryk9jr.mongodb.net/`);
       console.log("base de datos conectada");
    }
    catch(e){
        throw new Error('No se pudo conectar a MongoDB', { cause: e });
    }
}

export async function disconnectCredifluxdb(){
    try{
       await mongoose.disconnect();
       console.log("base de datos desconectada");
    }catch(error){
        throw new Error('No se pudo desconectar de MongoDB', { cause: error });
    }
}