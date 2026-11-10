import { useState } from 'react'
import { optionsFromValues } from '../helpers/options.js'
import ResourceTable, { Tabs } from './ResourceTable.jsx'
import { Badge, SectionHeader, formatDate, formatMoney, shortId } from './ui.jsx'
import { ClienteName } from './lookups.jsx'
import {
  listCuentasCredito,
  listEstadosCuenta,
  listTarjetas,
  listTransacciones,
} from '../services/dashboardApi.js'

const cliente = { key: 'clienteId', label: 'Cliente', render: (row) => <ClienteName id={row.clienteId} /> }
const money = (key, label) => ({ key, label, align: 'right', render: (row) => formatMoney(row[key]) })
const fecha = { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) }

const tabs = {
  cuentas: {
    label: 'Cuentas de crédito',
    load: listCuentasCredito,
    filters: [{ key: 'estado', label: 'Estado', options: optionsFromValues(['activa', 'bloqueada', 'cerrada']) }],
    columns: [
      cliente,
      money('limiteCredito', 'Límite'),
      money('balanceActual', 'Balance'),
      { key: 'estado', label: 'Estado', render: (row) => <Badge value={row.estado} /> },
      fecha,
    ],
  },
  estados: {
    label: 'Estados de cuenta',
    load: listEstadosCuenta,
    columns: [
      cliente,
      { key: 'periodo', label: 'Periodo' },
      money('balanceAnterior', 'Anterior'),
      money('cargosTotales', 'Cargos'),
      money('pagosTotales', 'Pagos'),
      money('balanceActual', 'Actual'),
    ],
  },
  tarjetas: {
    label: 'Tarjetas',
    load: listTarjetas,
    filters: [{ key: 'estado', label: 'Estado', options: optionsFromValues(['activa', 'bloqueada', 'cancelada']) }],
    columns: [
      cliente,
      { key: 'numeroEnmascarado', label: 'Tarjeta', render: (row) => <span className="font-mono">{row.numeroEnmascarado}</span> },
      money('limiteCredito', 'Límite'),
      money('saldoDisponible', 'Disponible'),
      { key: 'fechaExpiracion', label: 'Expira' },
      { key: 'estado', label: 'Estado', render: (row) => <Badge value={row.estado} /> },
    ],
  },
  transacciones: {
    label: 'Transacciones',
    load: listTransacciones,
    columns: [
      { key: '_id', label: 'N.º', render: (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row._id)}</span> },
      { key: 'tipoTransaccion', label: 'Tipo', render: (row) => <Badge value={row.tipoTransaccion} tone="info" /> },
      { key: 'referenciaId', label: 'Referencia', render: (row) => <span className="font-mono">#{shortId(row.referenciaId)}</span> },
      { key: 'monto', label: 'Monto', align: 'right', render: (row) => <span className="font-semibold text-white">{formatMoney(row.monto)} {row.moneda}</span> },
      fecha,
    ],
  },
}

export default function CuentasMovimientos() {
  const [tab, setTab] = useState('cuentas')
  const current = tabs[tab]

  return (
    <div>
      <SectionHeader eyebrow="PRODUCTOS FINANCIEROS" title="Cuentas y movimientos" />
      <Tabs
        tabs={Object.entries(tabs).map(([id, value]) => ({ id, label: value.label }))}
        active={tab}
        onChange={setTab}
      />
      <ResourceTable key={tab} embedded load={current.load} columns={current.columns} filters={current.filters} />
    </div>
  )
}
