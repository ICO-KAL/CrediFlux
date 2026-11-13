import { useState } from 'react'
import { optionsFromValues } from '../helpers/options.js'
import ResourceTable, { Tabs } from './ResourceTable.jsx'
import { Badge, Icon, SectionHeader, buttonPrimary, formatDate, formatMoney, shortId } from './ui.jsx'
import { ClienteName } from './lookups.jsx'
import RegistrarPagoModal from './RegistrarPagoModal.jsx'
import { listCuotas, listPagos } from '../services/dashboardApi.js'

const cuotaColumns = [
  { key: 'prestamoId', label: 'Préstamo', render: (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row.prestamoId)}</span> },
  { key: 'numeroCuota', label: 'Cuota', render: (row) => `N.º ${row.numeroCuota}` },
  { key: 'montoCapital', label: 'Capital', align: 'right', render: (row) => formatMoney(row.montoCapital) },
  { key: 'montoInteres', label: 'Interés', align: 'right', render: (row) => formatMoney(row.montoInteres) },
  { key: 'montoPenalizacionMora', label: 'Mora', align: 'right', render: (row) => formatMoney(row.montoPenalizacionMora || 0) },
  { key: 'montoTotalConMora', label: 'Total', align: 'right', render: (row) => <span className="font-semibold text-white">{formatMoney(row.montoTotalConMora ?? row.montoTotal)}</span> },
  { key: 'fechaVencimiento', label: 'Vence', render: (row) => formatDate(row.fechaVencimiento) },
  { key: 'estado', label: 'Estado', render: (row) => <Badge value={row.estado} /> },
]

const pagoColumns = [
  { key: '_id', label: 'Pago', render: (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row._id)}</span> },
  { key: 'clienteId', label: 'Cliente', render: (row) => <ClienteName id={row.clienteId} /> },
  { key: 'montoTotal', label: 'Monto', align: 'right', render: (row) => <span className="font-semibold text-[#7ee0b6]">+ {formatMoney(row.montoTotal)}</span> },
  { key: 'metodoPago', label: 'Método' },
  { key: 'referenciaExterna', label: 'Referencia' },
  { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
]

const cuotaFilters = [
  {
    key: 'estado',
    label: 'Estado',
    options: optionsFromValues(['pendiente', 'pagada', 'vencida']),
  },
]

export default function CuotasPagos() {
  const [tab, setTab] = useState('cuotas')
  const [payOpen, setPayOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div>
      <SectionHeader eyebrow="COBRANZA" title="Cuotas y pagos">
        <button type="button" className={buttonPrimary} onClick={() => setPayOpen(true)}>
          <Icon name="plus" className="size-4" /> Registrar pago
        </button>
      </SectionHeader>
      <Tabs
        tabs={[{ id: 'cuotas', label: 'Cuotas' }, { id: 'pagos', label: 'Pagos recibidos' }]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'cuotas' ? (
        <ResourceTable key={`cuotas-${refreshKey}`} embedded load={listCuotas} columns={cuotaColumns} filters={cuotaFilters} />
      ) : (
        <ResourceTable key={`pagos-${refreshKey}`} embedded load={listPagos} columns={pagoColumns} />
      )}
      <RegistrarPagoModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        onSaved={() => setRefreshKey((value) => value + 1)}
      />
    </div>
  )
}
