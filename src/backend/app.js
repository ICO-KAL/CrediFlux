import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/login.js';
import { verificarToken } from './helpers/autentic.js';
import auditoriaRoutes from './routes/auditoria.js';
import autorizacionesTarjetaRoutes from './routes/autorizacionesTarjeta.js';
import clientesRoutes from './routes/clientes.js';
import comisionesRoutes from './routes/comisiones.js';
import configuracionSistemaRoutes from './routes/configuracionSistema.js';
import consentimientosRoutes from './routes/consentimientos.js';
import contabilidadRoutes from './routes/contabilidad.js';
import creadifluxRoutes from './routes/creadiflux.js';
import cuentasCreditoRoutes from './routes/cuentasCredito.js';
import cuotasRoutes from './routes/cuotas.js';
import desembolsosRoutes from './routes/desembolsos.js';
import direccionesRoutes from './routes/direcciones.js';
import documentosClienteRoutes from './routes/documentosCliente.js';
import evaluacionesRoutes from './routes/evaluaciones.js';
import incidenciasRiesgoRoutes from './routes/incidenciasRiesgo.js';
import notificacionesRoutes from './routes/notificaciones.js';
import pagosRoutes from './routes/pagos.js';
import permisosRoutes from './routes/permisos.js';
import prestamosRoutes from './routes/prestamos.js';
import productosCreditoRoutes from './routes/productosCredito.js';
import rolesRoutes from './routes/roles.js';
import seguimientoRoutes from './routes/seguimiento.js';
import solicitudesCreditoRoutes from './routes/solicitudesCredito.js';
import tarjetaCreditoRoutes from './routes/tarjetaCredito.js';
import transaccionesFinancierasRoutes from './routes/transaccionesFinancieras.js';
import usuariosAdminRoutes from './routes/usuariosAdmin.js';
import { credifluxdb } from './config/credifluxDB.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/auditoria', verificarToken, auditoriaRoutes);
app.use('/autorizaciones-tarjeta', verificarToken, autorizacionesTarjetaRoutes);
app.use('/clientes', verificarToken, clientesRoutes);
app.use('/comisiones', verificarToken, comisionesRoutes);
app.use('/configuracion-sistema', verificarToken, configuracionSistemaRoutes);
app.use('/consentimientos', verificarToken, consentimientosRoutes);
app.use('/contabilidad', verificarToken, contabilidadRoutes);
app.use('/crediflux', verificarToken, creadifluxRoutes);
app.use('/cuentas-credito', verificarToken, cuentasCreditoRoutes);
app.use('/cuotas', verificarToken, cuotasRoutes);
app.use('/desembolsos', verificarToken, desembolsosRoutes);
app.use('/direcciones', verificarToken, direccionesRoutes);
app.use('/documentos-cliente', verificarToken, documentosClienteRoutes);
app.use('/evaluaciones', verificarToken, evaluacionesRoutes);
app.use('/incidencias-riesgo', verificarToken, incidenciasRiesgoRoutes);
app.use('/notificaciones', verificarToken, notificacionesRoutes);
app.use('/pagos', verificarToken, pagosRoutes);
app.use('/permisos', verificarToken, permisosRoutes);
app.use('/prestamos', verificarToken, prestamosRoutes);
app.use('/productos-credito', verificarToken, productosCreditoRoutes);
app.use('/roles', verificarToken, rolesRoutes);
app.use('/seguimiento', verificarToken, seguimientoRoutes);
app.use('/solicitudes-credito', verificarToken, solicitudesCreditoRoutes);
app.use('/tarjetas-credito', verificarToken, tarjetaCreditoRoutes);
app.use('/transacciones-financieras', verificarToken, transaccionesFinancierasRoutes);
app.use('/usuarios-admin', verificarToken, usuariosAdminRoutes);


async function iniciarServidor() {
    await credifluxdb();
    app.listen(PORT, () => {
        console.log(`puerto arrancando en el localhost:${PORT}`);
    });
}

/* const desconectar = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.log('Error al desconectar de MongoDB:', error);

    }
} */



iniciarServidor().catch(() => {
    console.error('El servidor no pudo iniciar porque MongoDB no estÃ¡ disponible');
    process.exitCode = 1;
});