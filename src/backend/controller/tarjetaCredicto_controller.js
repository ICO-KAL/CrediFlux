import mongoose from 'mongoose';
import tarjetaCredito from '../models/tarjeta_credito';


export async function insertarTarjeta(req,res){
    try{
       const {
        clienteId,numeroEnmascarado,limiteCredito,saldoDisponible,fechaExpiracion,
        estado
       } = req.body;
      
       if(!clienteId || !numeroEnmascarado || limiteCredito === undefined || saldoDisponible === undefined || !fechaExpiracion || !estado ){
         return res.status(401).json({message: "campos requeridos obligatoriamente"});
       }
       if(!mongoose.Types.ObjectId.isValid(clienteId)){
          return res.status(401).json({message: "ClienteID no autorizado"});
       }
       if(typeof limiteCredito !== 'number' || !limiteCredito < 0 || typeof saldoDisponible !== 'number' || !saldoDisponible <0){
          return res.status(401).json({message: "Limite de credito y el saldo deben de ser superior a 0"});
       }
       const formatoFechaRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

       if(!formatoFechaRegex.test(fechaExpiracion)){
          return res.status(401).json({message: "El formato de la fecha de expiración es inválido. Debe ser MM/AA"});
       }

       const crearTarjeta = await tarjetaCredito.crearTarjeta_credito({
          clienteId,
          numeroEnmascarado,
          limiteCredito,
          saldoDisponible,
          fechaExpiracion,
          estado
       });

       if(!crearTarjeta) return res.status(401).json({message: "los campos son requeridos"});

       res.status(202).json({message: "insertacion de tarjeta de credicto completada", tarjeta: crearTarjeta});
                 
    }catch(e){
        console.log("Error al introducir la tarjeta de credicto",e);
        return res.status(500).json({Error: e});
    }
}

export async function obtenerTodasTarjetas(req,res) {
    try{
        const {clienteId} = req.body;
        if(!clienteId) return res.status(401).json({message: "campos requeridos"});

        const obtenerTarjeta = await tarjetaCredito.allTarjeta_credito({
            clienteId,
            estado
        });

        if(!obtenerTarjeta) return res.status(401).json({message: "No se encontro la tarjeta"});

        res.status(202).json({message: "todas tus tarjetas de credito", tarjetas: obtenerTarjeta});
    }catch(e){
        console.log("Error al obtener la tarjeta",e);
        return res.status(500).json({Error: e});
    }
}

export async function obtenerTarjetaId(req,res) {
    try{
        const { id } = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(404).json({message: "La tarjeta no existe"});
        }

        const obtenerTarjeta = await tarjetaCredito.getTarjeta_credito({clienteId: id});

        if(!obtenerTarjeta) return res.status(404).json({message: "no se encontro la tarjeta"});

        res.status(200).json({message: "Esta es tu tarjeta",tarjeta: obtenerTarjeta});

    }
    catch(e){
        console.log("Error al buscar la tarjeta",e);
        return res.status(500).json({Error: e});
    }
}

export async function actualizarTarjeta(req,res){
    try{
        const { clienteId, numeroEnmascarado,limiteCredito,saldoDisponible,fechaExpiracion,
        estado} = req.body;
    
        if(!mongoose.Types.ObjectId.isValid(clienteId)){
            return res.status(404).json({message: "tarjeta no encontrada"});
        }

        const objectoActualizar = {};

        if(clienteId !== undefined){
            if(!mongoose.Types.ObjectId.isValid(clienteId)){
              return res.status(404).json({message: "tarjeta no valida"});
            }
            objectoActualizar.clienteId = clienteId;
        }

        if(numeroEnmascarado !== undefined) {
            objectoActualizar.numeroEnmascarado = numeroEnmascarado;
        }

        if(limiteCredito !== undefined ||saldoDisponible !== undefined ) {
            if(typeof limiteCredito !== 'number' || !limiteCredito < 0 || typeof saldoDisponible !== 'number' || !saldoDisponible <0){ 
                return res.status(401).json({message: "Limite de credito y el saldo deben de ser superior a 0"});
            }
            objectoActualizar.limiteCredito = limiteCredito;
            objectoActualizar.saldoDisponible = saldoDisponible;
        }
        if(fechaExpiracion !== undefined) {
            objectoActualizar.fechaExpiracion = fechaExpiracion;
        }
        if(estado !== undefined){
            objectoActualizar.estado = estado;
        }

        const formatoFechaRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if(!formatoFechaRegex.test(fechaExpiracion)){
            return res.status(404).json({message: "El formato de la fecha de expiración es inválido. Debe ser MM/AA"})
        }
       
        const actualizarTarjeta = await tarjetaCredito.actualizarTarjeta_credito(id,{$set: objectoActualizar},{runValidation: true});
        if(!actualizarTarjeta) return res.status(404).json({message: "campos requeridos"});
        res.status(200).json({message: "tarjeta Actualizada"});
    }catch(e){
        console.log("Error al actualizar la tarjeta",e);
        return res.status(401).json({Error: e});
    }
}

export async function eliminarTarjeta(req,res){
    try{
        const {clienteId, numeroEnmascarado} = req.body;
        if(!mongoose.Types.ObjectId.isValid(clienteId)){
            return res.status(401).json({message: "no se encontro la tarjeta del clienteID"});
        }
        if(numeroEnmascarado !== numeroEnmascarado){
            return res.status(401).json({message: "tarjeta no parecida"});
        }
        const eliminarTarjeta = await tarjetaCredito.eliminarTarjeta_credito({
            clienteId,
            numeroEnmascarado
        });

        res.status(200).json({message: "tarjeta eliminada",eliminar: eliminarTarjeta});
    }
    catch(e){
        console.log("Error al eliminar la tarjeta",e);
        return res.status(404).json({Error: e});
    }
}