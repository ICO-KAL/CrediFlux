import ResourceTable from './ResourceTable.jsx'
import { optionsFromValues } from '../helpers/options.js'
import { Badge, formatDate, formatMoney, shortId } from './ui.jsx'
import { ClienteName } from './lookups.jsx'
import { createConfig, rowActions } from '../helpers/solicitudeCredito.js'
import {listSolicitudes} from '../services/dashboardApi.js'

const columns = [
  { key: '_id', label: 'N.º', render: (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row._id)}</span> },
  { key: 'clienteId', label: 'Cliente', render: (row) => <ClienteName id={row.clienteId} /> },
  { key: 'montoSolicitado', label: 'Monto', align: 'right', render: (row) => formatMoney(row.montoSolicitado) },
  { key: 'plazoSolicitadoMeses', label: 'Plazo', render: (row) => `${row.plazoSolicitadoMeses} meses` },
  { key: 'estado', label: 'Estado', render: (row) => <Badge value={row.estado} /> },
  { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
]

const filters = [
  {
    key: 'estado',
    label: 'Estado',
    options: optionsFromValues(['pendiente', 'en_revision', 'aprobada', 'rechazada', 'cancelada'], (value) => value.replace('_', ' ')),
  },
]

export default function SolicitudesCredito() {
  return (
    <ResourceTable
      eyebrow="ORIGINACIÓN"
      title="Solicitudes de crédito"
      load={listSolicitudes}
      columns={columns}
      filters={filters}
      createConfig={createConfig}
      rowActions={rowActions}
    />
  )
}
