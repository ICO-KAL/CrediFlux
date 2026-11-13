import ResourceTable from './ResourceTable.jsx'
import { optionsFromValues } from '../helpers/options.js'
import { Badge, formatDate, formatMoney, shortId } from './ui.jsx'
import { prestamoOptions } from './lookups.jsx'
import { createDesembolso, listDesembolsos } from '../services/dashboardApi.js'

const createConfig = {
  label: 'Registrar desembolso',
  title: 'Registrar desembolso',
  successMessage: 'Desembolso registrado y plan de amortización generado.',
  submit: createDesembolso,
  fields: [
    { name: 'prestamoId', label: 'Préstamo', type: 'select', required: true, loadOptions: prestamoOptions },
    { name: 'montoDesembolsado', label: 'Monto a desembolsar', type: 'number', min: 0.01, step: '0.01', required: true },
    {
      name: 'metodoPago',
      label: 'Método de pago',
      type: 'select',
      required: true,
      options: optionsFromValues(['transferencia', 'cheque', 'efectivo']),
    },
    { name: 'referenciaBancaria', label: 'Referencia bancaria' },
    { name: 'fechaPrimerPago', label: 'Fecha del primer pago', type: 'date' },
  ],
}

const columns = [
  { key: '_id', label: 'N.º', render: (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row._id)}</span> },
  { key: 'prestamoId', label: 'Préstamo', render: (row) => <span className="font-mono">#{shortId(row.prestamoId)}</span> },
  { key: 'montoDesembolsado', label: 'Monto', align: 'right', render: (row) => <span className="font-semibold text-[#f08c7e]">- {formatMoney(row.montoDesembolsado)}</span> },
  { key: 'metodoPago', label: 'Método', render: (row) => <Badge value={row.metodoPago} tone="info" /> },
  { key: 'referenciaBancaria', label: 'Referencia' },
  { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
]

export default function Desembolsos() {
  return (
    <ResourceTable
      eyebrow="TESORERÍA"
      title="Desembolsos"
      load={listDesembolsos}
      columns={columns}
      createConfig={createConfig}
    />
  )
}
