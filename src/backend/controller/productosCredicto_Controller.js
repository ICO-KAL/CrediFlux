import { type } from 'node:os';
import productosCredito from '../models/producto_credito';
import mongoose from 'mongoose';


export async function CrearProducto(req,res) {
    try{
        const {nombre,tasaInteresAnual,plazoMaximosMeses,montoMinimo,montoMaximo,} = req.body;
        
        if(tasaInteresAnual || typeof tasaInteresAnual !== 'number'){
            return res.status(401).json({message: "El resultado tiene que ser un numero"});
        }
        if(plazoMaximosMeses || typeof plazoMaximosMeses !== 'number'|| plazoMaximosMeses < 1){
            return res.status(401).json({message: "tienes que poner el plazo del mes"});
        }
        

    }catch(e){
        console.log("Error no se pudo crear el producto",e);
        return res.status(401).json({
            message: "no se pudo crear el producto",
            Error: e
        })
    }
}