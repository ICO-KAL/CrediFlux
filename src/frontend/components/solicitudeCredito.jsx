import ResourceTable from './ResourceTable.jsx'
import { optionsFromValues } from '../helpers/options.js'
import { formatMoney } from './ui.jsx'
import { clienteColumn, estadoColumn, fechaCreacionColumn, idColumn } from './resourceColumns.jsx'
import { createConfig, rowActions } from '../helpers/solicitudeCredito.js'
import {listSolicitudes} from '../services/dashboardApi.js'

const columns = [
  idColumn,
  clienteColumn,
  { key: 'montoSolicitado', label: 'Monto', align: 'right', render: (row) => formatMoney(row.montoSolicitado) },
  { key: 'plazoSolicitadoMeses', label: 'Plazo', render: (row) => `${row.plazoSolicitadoMeses} meses` },
  estadoColumn,
  fechaCreacionColumn,
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
