import { useEffect, useState } from 'react'
import { toOptions } from '../helpers/options.js'
import { listClientes, listPrestamos, listProductos, listSolicitudes } from '../services/dashboardApi.js'
import { shortId } from './ui.jsx'

let clienteMapPromise = null

export function invalidateClientes() {
  clienteMapPromise = null
}

function loadClienteMap() {
  if (!clienteMapPromise) {
    clienteMapPromise = listClientes({ limit: 100 })
      .then(({ items }) => new Map(items.map((c) => [c._id, `${c.nombres} ${c.apellidos}`])))
      .catch(() => {
        clienteMapPromise = null
        return new Map()
      })
  }
  return clienteMapPromise
}

export function ClienteName({ id }) {
  const [name, setName] = useState(null)

  useEffect(() => {
    let active = true
    loadClienteMap().then((map) => active && setName(map.get(id) || null))
    return () => {
      active = false
    }
  }, [id])

  return <span title={id}>{name || `#${shortId(id)}`}</span>
}

export const clienteOptions = toOptions(listClientes, (c) => `${c.nombres} ${c.apellidos}`)
export const productoOptions = toOptions(listProductos, (p) => p.nombre)
export const solicitudOptions = toOptions(
  listSolicitudes,
  (s) => `#${shortId(s._id)} · $${s.montoSolicitado} · ${s.estado}`,
)
export const prestamoOptions = toOptions(
  listPrestamos,
  (p) => `#${shortId(p._id)} · $${p.montoPrincipal} · ${p.estado}`,
)
