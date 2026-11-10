import { Badge, formatDate, shortId } from './ui.jsx'
import { ClienteName } from './lookups.jsx'

export const idColumn = {
  key: '_id',
  label: 'N.º',
  render: (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row._id)}</span>,
}

export const clienteColumn = {
  key: 'clienteId',
  label: 'Cliente',
  render: (row) => <ClienteName id={row.clienteId} />,
}

export const estadoColumn = {
  key: 'estado',
  label: 'Estado',
  render: (row) => <Badge value={row.estado} />,
}

export const fechaCreacionColumn = {
  key: 'createdAt',
  label: 'Fecha',
  render: (row) => formatDate(row.createdAt),
}
