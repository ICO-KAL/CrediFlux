import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/login.js';
import { credifluxdb } from './config/credifluxDB.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use('/auth', authRoutes);


async function iniciarServidor() {
    await credifluxdb();
    app.listen(PORT, () => {
        console.log(`puerto arrancando en el localhost:${PORT}`);
    });
}

iniciarServidor().catch(() => {
    console.error('El servidor no pudo iniciar porque MongoDB no está disponible');
    process.exitCode = 1;
});