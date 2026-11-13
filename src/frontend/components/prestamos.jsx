import ResourceTable from './ResourceTable.jsx'
import { optionsFromValues } from '../helpers/options.js'
import { formatMoney } from './ui.jsx'
import { solicitudOptions } from './lookups.jsx'
import { clienteColumn, estadoColumn, fechaCreacionColumn, idColumn } from './resourceColumns.jsx'
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
  idColumn,
  clienteColumn,
  { key: 'montoPrincipal', label: 'Principal', align: 'right', render: (row) => formatMoney(row.montoPrincipal) },
  { key: 'tasaInteres', label: 'Tasa', align: 'right', render: (row) => `${row.tasaInteres}% · ${row.tipoTasa || 'fija'}` },
  { key: 'sistemaAmortizacion', label: 'Plan', render: (row) => `${row.sistemaAmortizacion || 'frances'} · ${row.frecuenciaPago || 'mensual'}` },
  { key: 'plazoMeses', label: 'Plazo', render: (row) => `${row.plazoMeses} meses` },
  estadoColumn,
  fechaCreacionColumn,
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
