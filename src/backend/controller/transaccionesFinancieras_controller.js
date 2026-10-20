import mongoose, { mongo } from "mongoose";
import transaccion from "../models/transaccion_financiera";


export async function crearTransacciones(req,res){
    try{
        const {referenciaId,tipoTransaccion, monto, moneda} = req.body;

        if(!referenciaId) return res.status(401).json({message: "se requiere referenciaId"});

        if(!mongoose.Types.ObjectId.isValid(referenciaId)){
            return res.status(401).json({message: "el formato del id no es valido"});
        }

        if(!tipoTransaccion || !monto || !!moneda){
            return res.status(401).json({message: "no dejes el apartado vacio llenar el apartado"});
        }

        if(!monto || monto <= 0) return res.status(401).json({message: "debes tener dinero para hacer una transaccion"});
        if(!tipoTransaccion) return res.status(401).json({message: "necesitas colocar el tipo de transaccion"});

        const crearTransaccionesFinanciera = await transaccion.crearTransaccionFinanciera({
            referenciaId,
            tipoTransaccion,
            monto,
            moneda
        });
        res.status(202).json({message: "transaccion creada", crearTransacciones: crearTransaccionesFinanciera});
    }
    catch(e){
        console.log("no se pudo crear la transaccion",e);
        return res.status(500).json({message:"Error en la transaccion", Error: e});
    }
}

export async function obtenerTransacciones(req,res){
    try{
        const {referenciaId,tipoTransaccion} = req.body;
        if(!referenciaId || !tipoTransaccion) return res.status(401).json({message: "no se encontro la transaccion"});

        const encontrarTransacciones = await transaccion.getTransaccionFinanciera({
            referenciaId,
            tipoTransaccion,
        });
        if(!encontrarTransacciones) return res.status(401).json({message: "no se encontro la transaccion"});
        res.status(202).json({message: "se encontro la transaccion", transaccion: encontrarTransacciones});
    }
    catch(e){
        console.log("Error al buscar tu transaccion",e);
        res.status(500).json({Error: e});
    }
}

export async function obtenerTransaccionesPorId(req,res) {
    try{
        const {referenciaId} = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(referenciaId)){
          return res.status(401).json({message: "no se encontro el id de la transaccion"});
        }

        const buscarTransaccionId = await transaccion.getIdTransaccionFinanciera({referenciaId});
        res.status(202).json({message: "transaccion obtenida",buscarTransaccionId: buscarTransaccionId});

    }catch(e){
        console.log("Error no se encontro la transaccion",e);
        return res.status(500).json({message: "no se encontro la transaccion"});
    }
}

export async function actualizarTransaccion(req,res){
    try{
        const id = req.params;
        const {referenciaId,tipoTransaccion, monto, moneda} = req.body;

        const datoActualizar = {};
        if(referenciaId !== undefined){
            if(!mongoose.Types.ObjectId.isValid(referenciaId)){
                return res.status(401).json({message: "el formato de referencia no es valida"});
            }
            datoActualizar.referenciaId = referenciaId;
        }

        if(tipoTransaccion !== undefined){
            datoActualizar.tipoTransaccion = tipoTransaccion;
        }
        if(monto !== undefined){
            if(typeof monto !== 'number' || monto <= 0){
                return res.status(401).json({message: "el monto no puede dar 0 tiene que ser superior"});
            }
            datoActualizar.monto = monto;
        }
        if(moneda !== undefined){
            datoActualizar.moneda;
        }
       
       const actualizarTransaccion =
         await transaccion.actualizarTransaccionFinanciera(
           id,
           { $set: datoActualizar }
         );
    
       if(!actualizarTransaccion) return res.status(401).json({message: "tienes que poner los apartados necesarios"});
       res.status(202).json({
        message: "transaccion actualizada",
        actualizar: actualizarTransaccion
       });
    }
    catch(e){
        console.log("Error no se pudo actualizar",e);
        return res.status(500).json({Error: e});
    }
}

export async function eliminarTransaccion(req,res){
    try{
        const {referenciaId,tipoTransaccion} = req.body;
        if(!referenciaId || !tipoTransaccion) return res.status(401).json({message: "transaccion no encontrada"});
        
        if(!mongoose.Types.ObjectId.isValid(referenciaId)){
            return res.status(401).json({message: "no se encontro la transaccion"});
        }
        
        const eliminarTransaccion = await transaccion.eliminarTransaccionFinanciera({
            referenciaId: referenciaId,
            tipoTransaccion: tipoTransaccion
        });

        if(!eliminarTransaccion) return res.status(401).json({message: "Error al eliminar la transaccion"});

        res.status(202).json({message:"eliminacion de transaccion completada", Eliminar: eliminarTransaccion});
    }
    catch(e){
        console.log("Error al eliminar",e);
        return res.status(500).json({Error: e});
    }
}