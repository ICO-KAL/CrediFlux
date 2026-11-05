import ResourceTable from './ResourceTable.jsx'
import { formatDate, formatMoney } from './ui.jsx'
import { createProducto, listProductos } from '../services/dashboardApi.js'

const createConfig = {
  label: 'Nuevo producto',
  title: 'Registrar producto de crédito',
  successMessage: 'Producto creado correctamente.',
  submit: createProducto,
  fields: [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'tasaInteresAnual', label: 'Tasa de interés anual (%)', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'plazoMaximosMeses', label: 'Plazo máximo (meses)', type: 'number', min: 1, step: '1', required: true },
    { name: 'montoMinimo', label: 'Monto mínimo', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'montoMaximo', label: 'Monto máximo', type: 'number', min: 0, step: '0.01', required: true },
  ],
}

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
