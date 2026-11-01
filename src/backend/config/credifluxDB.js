import mongoose from 'mongoose';
import path from 'path';
import dotenv from'dotenv';

export async function credifluxdb(){
    try{
       dotenv.config({path: path.resolve(import.meta.dirname, '../../../.env') });
       const username = encodeURIComponent(process.env.name ?? '');
       const password = encodeURIComponent(process.env.passwoard ?? '');
       await mongoose.connect(
           `mongodb+srv://${username}:${password}@crediflux.rryk9jr.mongodb.net/`,
           { serverSelectionTimeoutMS: 10000 }
       );
       console.log("base de datos conectada");
    }
    catch(error){
        throw new Error('No se pudo conectar a MongoDB', { cause: error });
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