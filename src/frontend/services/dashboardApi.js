import { pickList, request } from './apiClient.js'

const list = (path, key) => (query) =>
  request(path, { query }).then((data) => pickList(data, key))

const create = (path) => (body) => request(path, { method: 'POST', body })

export const listClientes = list('/clientes', 'clientes')
export const createCliente = create('/clientes')

export const listProductos = list('/productos-credito', 'productos')
export const createProducto = create('/productos-credito')

export const listSolicitudes = list('/solicitudes-credito', 'solicitudes')
export const createSolicitud = create('/solicitudes-credito')
export const enviarSolicitudARevision = (id) =>
  request(`/solicitudes-credito/${id}/revision`, { method: 'PATCH' })
export const cancelarSolicitud = (id) =>
  request(`/solicitudes-credito/${id}`, { method: 'PATCH' })

export const listPrestamos = list('/prestamos', 'prestamos')
export const createPrestamoDesdeSolicitud = create('/prestamos')

export const listCuotas = list('/cuotas', 'cuotas')
export const listPagos = list('/pagos/listar', 'pagos')

export const createPago = create('/pagos/register')

// Cuotas por cobrar de un cliente: busca sus préstamos vigentes y luego las cuotas pendientes o vencidas.
export async function listCuotasPendientesDeCliente(clienteId) {
  const [activos, enMora] = await Promise.all(
    ['activo', 'en_mora'].map((estado) => listPrestamos({ clienteId, estado, limit: 100 })),
  )
  const prestamos = [...activos.items, ...enMora.items]

  const groups = await Promise.all(
    prestamos.flatMap((prestamo) =>
      ['pendiente', 'vencida'].map((estado) =>
        listCuotas({ prestamoId: prestamo._id, estado, limit: 100 }).then(({ items }) => items),
      ),
    ),
  )

  return groups
    .flat()
    .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento))
}

export const listDesembolsos = list('/desembolsos', 'desembolsos')
export const createDesembolso = create('/desembolsos')

export const listEvaluaciones = list('/evaluaciones', 'evaluaciones')
export const createEvaluacion = create('/evaluaciones')
export const listDecisiones = list('/evaluaciones/decisiones', 'decisiones')
export const decidirSolicitud = (solicitudId, body) =>
  request(`/evaluaciones/decidir/${solicitudId}`, { method: 'POST', body })

export const listCuentasCredito = list('/cuentas-credito', 'cuentas')
export const listEstadosCuenta = list('/cuentas-credito/estados', 'estadosCuenta')
export const listTarjetas = list('/tarjetas-credito', 'tarjetas')
export const listTransacciones = list('/transacciones-financieras', 'transacciones')
export const listComisiones = list('/comisiones', 'comisiones')

export const listNotificaciones = list('/notificaciones', 'notificaciones')
export const marcarNotificacionLeida = (id) =>
  request(`/notificaciones/${id}/leida`, { method: 'PATCH' })
export const eliminarNotificacion = (id) =>
  request(`/notificaciones/${id}`, { method: 'DELETE' })

export const listUsuarios = list('/usuarios-admin', 'usuarios')
export const listRoles = list('/roles', 'roles')
export const createRol = create('/roles')
export const listPermisos = list('/permisos', 'permisos')
export const createPermiso = create('/permisos')

export const listAuditoria = list('/auditoria', 'auditoria')
export const listIncidencias = list('/incidencias-riesgo', 'incidencias')
export const createIncidencia = create('/incidencias-riesgo')
export const listConfiguraciones = list('/configuracion-sistema', 'configuraciones')
export const createConfiguracion = create('/configuracion-sistema')

// Datos agregados del panel principal; cada bloque falla de forma independiente.
export async function loadDashboardSnapshot() {
  const query = { limit: 100 }
  const sources = {
    clientes: listClientes(query),
    prestamos: listPrestamos(query),
    solicitudes: listSolicitudes(query),
    pagos: listPagos(query),
    desembolsos: listDesembolsos(query),
    notificaciones: listNotificaciones(query),
    incidencias: listIncidencias(query),
  }

  const entries = await Promise.all(
    Object.entries(sources).map(async ([name, promise]) => {
      try {
        return [name, await promise]
      } catch (error) {
        return [name, { items: [], total: 0, error: error.message }]
      }
    }),
  )

  return Object.fromEntries(entries)
}
