import ResourceTable from './ResourceTable.jsx'
import { Badge, formatDate, formatMoney, shortId } from './ui.jsx'
import { ClienteName, clienteOptions, productoOptions } from './lookups.jsx'
import {
  cancelarSolicitud,
  createSolicitud,
  enviarSolicitudARevision,
  listSolicitudes,
} from '../services/dashboardApi.js'

const createConfig = {
  label: 'Nueva solicitud',
  title: 'Registrar solicitud de crédito',
  successMessage: 'Solicitud creada correctamente.',
  submit: createSolicitud,
  fields: [
    { name: 'clienteId', label: 'Cliente', type: 'select', required: true, loadOptions: clienteOptions },
    { name: 'productoCreditoId', label: 'Producto de crédito', type: 'select', required: true, loadOptions: productoOptions },
    { name: 'montoSolicitado', label: 'Monto solicitado', type: 'number', min: 0.01, step: '0.01', required: true },
    { name: 'plazoSolicitadoMeses', label: 'Plazo (meses)', type: 'number', min: 1, step: '1', required: true },
  ],
}

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
    options: ['pendiente', 'en_revision', 'aprobada', 'rechazada', 'cancelada'].map((value) => ({
      value,
      label: value.replace('_', ' '),
    })),
  },
]

const rowActions = [
  {
    label: 'A revisión',
    show: (row) => row.estado === 'pendiente',
    onClick: (row) => enviarSolicitudARevision(row._id),
    successMessage: 'Solicitud enviada a revisión.',
  },
  {
    label: 'Cancelar',
    danger: true,
    show: (row) => ['pendiente', 'en_revision'].includes(row.estado),
    confirm: '¿Cancelar esta solicitud?',
    onClick: (row) => cancelarSolicitud(row._id),
    successMessage: 'Solicitud cancelada.',
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
