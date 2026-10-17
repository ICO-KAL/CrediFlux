import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';

export async function userToken(email){
    try{
        const token = jsonwebtoken.sign({email},process.env.JSON_WEB_TOKEN,{expiresIn: '1h'});
        return token
    }
    catch(e){
        console.log("Error al crear token",e);
    }
}

export async function verificarToken(req,res,next){
    try{
        if(!await req.header('Authorization')?.replace('Bearer','')) return res.status(401).json({Error: "Token no colocado"});
        const verificar = jsonwebtoken.verify({email},process.env.JSON_WEB_TOKEN);
        console.log(verificar.email);
        next();
    }
    catch(e){
        console.log("Error token no verificado",e);
        res.status(401).json({Error: "Token no verificado",e});
    }
}

