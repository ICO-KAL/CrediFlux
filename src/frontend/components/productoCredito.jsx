import ResourceTable from './ResourceTable.jsx'
import { formatDate, formatMoney } from './ui.jsx'
import { listProductos } from '../services/dashboardApi.js'
import { createConfig } from '../helpers/productoCredit.js'


const columns = [
  { key: 'nombre', label: 'Producto', render: (row) => <span className="font-semibold text-white">{row.nombre}</span> },
  { key: 'tasaInteresAnual', label: 'Tasa anual', align: 'right', render: (row) => `${row.tasaInteresAnual}%` },
  { key: 'plazoMaximosMeses', label: 'Plazo máx.', render: (row) => `${row.plazoMaximosMeses} meses` },
  { key: 'montoMinimo', label: 'Mínimo', align: 'right', render: (row) => formatMoney(row.montoMinimo) },
  { key: 'montoMaximo', label: 'Máximo', align: 'right', render: (row) => formatMoney(row.montoMaximo) },
  { key: 'createdAt', label: 'Creado', render: (row) => formatDate(row.createdAt) },
]

export default function ProductoCredito() {
  return (
    <ResourceTable
      eyebrow="CATÁLOGO"
      title="Productos de crédito"
      load={listProductos}
      columns={columns}
      createConfig={createConfig}
    />
  )
}
