import ResourceTable from './ResourceTable.jsx'
import { optionsFromValues } from '../helpers/options.js'
import { Badge, formatDate, formatMoney, shortId } from './ui.jsx'
import { ClienteName, solicitudOptions } from './lookups.jsx'
import { createPrestamoDesdeSolicitud, listPrestamos } from '../services/dashboardApi.js'

const createConfig = {
  label: 'Crear desde solicitud',
  title: 'Crear préstamo desde una solicitud aprobada',
  successMessage: 'Préstamo creado correctamente.',
  submit: createPrestamoDesdeSolicitud,
  fields: [
    { name: 'solicitudId', label: 'Solicitud aprobada', type: 'select', required: true, loadOptions: solicitudOptions },
  ],
}

const columns = [
  { key: '_id', label: 'N.º', render: (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row._id)}</span> },
  { key: 'clienteId', label: 'Cliente', render: (row) => <ClienteName id={row.clienteId} /> },
  { key: 'montoPrincipal', label: 'Principal', align: 'right', render: (row) => formatMoney(row.montoPrincipal) },
  { key: 'tasaInteres', label: 'Tasa', align: 'right', render: (row) => `${row.tasaInteres}%` },
  { key: 'plazoMeses', label: 'Plazo', render: (row) => `${row.plazoMeses} meses` },
  { key: 'estado', label: 'Estado', render: (row) => <Badge value={row.estado} /> },
  { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
]

const filters = [
  {
    key: 'estado',
    label: 'Estado',
    options: optionsFromValues(['activo', 'en_mora', 'saldado', 'cancelado'], (value) => value.replace('_', ' ')),
  },
]

export default function Prestamos() {
  return (
    <ResourceTable
      eyebrow="CARTERA"
      title="Préstamos"
      load={listPrestamos}
      columns={columns}
      filters={filters}
      createConfig={createConfig}
    />
  )
}
