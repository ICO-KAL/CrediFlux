import 'dotenv/config';
import mongoose from 'mongoose';
import { credifluxdb, disconnectCredifluxdb } from '../config/credifluxDB.js';
import '../schemes/usuarios.js';
import '../schemes/roles.js';
import '../schemes/permisos.js';

const permisosIniciales = {
    clientes: ['crear', 'ver', 'editar'],
    direcciones: ['crear', 'ver', 'editar', 'eliminar'],
    productos_credito: ['crear', 'ver', 'editar'],
    solicitudes_credito: ['crear', 'ver', 'editar', 'revisar', 'decidir', 'cancelar'],
    prestamos: ['crear', 'ver'],
    cuotas: ['ver'],
    evaluaciones_crediticias: ['crear', 'ver'],
    decisiones_credito: ['ver'],
    tarjetas_credito: ['crear', 'ver', 'editar', 'cancelar'],
    documentos_cliente: ['crear', 'ver', 'verificar'],
    consentimientos: ['crear', 'ver'],
    cuentas_credito: ['ver'],
    estados_cuenta: ['ver'],
    pagos: ['crear', 'ver'],
    desembolsos: ['crear', 'ver'],
    comisiones: ['ver'],
    incidencias_riesgo: ['crear', 'ver'],
    notificaciones: ['ver', 'editar'],
    asignaciones_pago: ['ver'],
    movimientos_tarjeta: ['ver'],
    autorizaciones_tarjeta: ['autorizar', 'ver'],
    transacciones_financieras: ['ver'],
    roles: ['administrar'],
    usuarios: ['administrar']
};

async function bootstrapAdmin() {
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    if (!email) throw new Error('Define BOOTSTRAP_ADMIN_EMAIL con el correo del usuario administrador existente');

    await credifluxdb();
    try {
        const usuario = await mongoose.model('Usuario').findOne({ email, activo: true });
        if (!usuario) throw new Error('No existe un usuario activo con BOOTSTRAP_ADMIN_EMAIL; regístralo primero');

        const permisos = [];
        for (const [modulo, acciones] of Object.entries(permisosIniciales)) {
            for (const nombreAccion of acciones) {
                const permiso = await mongoose.model('Permiso').findOneAndUpdate(
                    { modulo, nombreAccion },
                    { $setOnInsert: { modulo, nombreAccion } },
                    { upsert: true, new: true, runValidators: true }
                );
                permisos.push(permiso._id);
            }
        }

        const rol = await mongoose.model('Rol').findOneAndUpdate(
            { nombre: 'administrador' },
            {
                $setOnInsert: { descripcion: 'Administrador inicial del sistema' },
                $addToSet: { permisos: { $each: permisos } }
            },
            { upsert: true, new: true, runValidators: true }
        );
        await mongoose.model('Usuario').updateOne(
            { _id: usuario._id },
            { $addToSet: { roles: rol._id } },
            { runValidators: true }
        );
        console.log(`Permisos y rol administrador asignados a ${email}`);
    } finally {
        await disconnectCredifluxdb();
    }
}

bootstrapAdmin().catch((error) => {
    console.error('No se pudo inicializar el administrador:', error.message);
    process.exitCode = 1;
});
