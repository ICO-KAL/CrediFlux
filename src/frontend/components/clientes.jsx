import ResourceTable from './ResourceTable.jsx'
import { optionsFromValues } from '../helpers/options.js'
import { Badge, formatDate } from './ui.jsx'
import { createCliente, listClientes } from '../services/dashboardApi.js'
import { invalidateClientes } from './lookups.jsx'

const createConfig = {
  label: 'Nuevo cliente',
  title: 'Registrar cliente',
  successMessage: 'Cliente registrado correctamente.',
  submit: async (payload) => {
    const result = await createCliente(payload)
    invalidateClientes()
    return result
  },
  fields: [
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    { name: 'email', label: 'Correo electrónico', type: 'email', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
    { name: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date', required: true },
  ],
}

const columns = [
  { key: 'nombre', label: 'Cliente', render: (row) => <span className="font-semibold text-white">{row.nombres} {row.apellidos}</span> },
  { key: 'email', label: 'Correo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'fechaNacimiento', label: 'Nacimiento', render: (row) => formatDate(row.fechaNacimiento) },
  { key: 'estado', label: 'Estado', render: (row) => <Badge value={row.estado} /> },
  { key: 'createdAt', label: 'Alta', render: (row) => formatDate(row.createdAt) },
]

const filters = [
  {
    key: 'estado',
    label: 'Estado',
    options: optionsFromValues(['activo', 'suspendido', 'bloqueado']),
  },
]

export default function Clientes() {
  return (
    <ResourceTable
      eyebrow="CARTERA"
      title="Clientes"
      load={listClientes}
      columns={columns}
      filters={filters}
      createConfig={createConfig}
    />
  )
}
