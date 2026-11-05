import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

const apiPrefixes = [
  '/auth',
  '/auditoria',
  '/autorizaciones-tarjeta',
  '/clientes',
  '/comisiones',
  '/configuracion-sistema',
  '/consentimientos',
  '/contabilidad',
  '/crediflux',
  '/cuentas-credito',
  '/cuotas',
  '/desembolsos',
  '/direcciones',
  '/documentos-cliente',
  '/evaluaciones',
  '/incidencias-riesgo',
  '/notificaciones',
  '/pagos',
  '/permisos',
  '/prestamos',
  '/productos-credito',
  '/roles',
  '/seguimiento',
  '/solicitudes-credito',
  '/tarjetas-credito',
  '/transacciones-financieras',
  '/usuarios-admin',
]

const proxy = Object.fromEntries(
  apiPrefixes.map((prefix) => [
    prefix,
    { target: 'http://127.0.0.1:3000', changeOrigin: true },
  ]),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // ANALYZE=1 npm run build genera stats.html con el peso de cada dependencia
    process.env.ANALYZE && visualizer({ filename: 'stats.html', template: 'raw-data', gzipSize: true }),
  ],
  server: { proxy },
})
