import express from 'express';
import 'dotenv';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

/* 
 app.use(); // login 
 app.use(); // register
 app.use(); // dashoard
*/


app.listen(PORT, ()=>{
    console.log(`puerto arrancando en el localhost:${PORT}`);
});