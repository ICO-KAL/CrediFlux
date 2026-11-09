import { useState } from 'react'
import { optionsFromValues } from '../helpers/options.js'
import ResourceTable, { Tabs } from './ResourceTable.jsx'
import { Badge, SectionHeader, formatDateTime, shortId } from './ui.jsx'
import { ClienteName, clienteOptions } from './lookups.jsx'
import {
  createConfiguracion,
  createIncidencia,
  listAuditoria,
  listConfiguraciones,
  listIncidencias,
} from '../services/dashboardApi.js'

const fecha = { key: 'createdAt', label: 'Fecha', render: (row) => formatDateTime(row.createdAt) }

const tabs = {
  auditoria: {
    label: 'Auditoría',
    load: listAuditoria,
    columns: [
      { key: 'accion', label: 'Acción', render: (row) => <span className="font-semibold text-white">{row.accion}</span> },
      { key: 'usuarioId', label: 'Usuario', render: (row) => (row.usuarioId ? <span className="font-mono">#{shortId(row.usuarioId)}</span> : '—') },
      { key: 'detalles', label: 'Detalles', render: (row) => <span className="line-clamp-1 max-w-[320px]">{row.detalles || '—'}</span> },
      { key: 'ip', label: 'IP' },
      fecha,
    ],
  },
  incidencias: {
    label: 'Incidencias de riesgo',
    load: listIncidencias,
    filters: [{ key: 'nivelRiesgo', label: 'Nivel', options: optionsFromValues(['bajo', 'medio', 'alto', 'critico']) }],
    createConfig: {
      label: 'Nueva incidencia',
      title: 'Registrar incidencia de riesgo',
      successMessage: 'Incidencia registrada correctamente.',
      submit: createIncidencia,
      fields: [
        { name: 'clienteId', label: 'Cliente', type: 'select', required: true, loadOptions: clienteOptions },
        { name: 'nivelRiesgo', label: 'Nivel de riesgo', type: 'select', required: true, options: optionsFromValues(['bajo', 'medio', 'alto', 'critico']) },
        { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
      ],
    },
    columns: [
      { key: 'clienteId', label: 'Cliente', render: (row) => <ClienteName id={row.clienteId} /> },
      { key: 'nivelRiesgo', label: 'Nivel', render: (row) => <Badge value={row.nivelRiesgo} /> },
      { key: 'descripcion', label: 'Descripción', render: (row) => <span className="line-clamp-1 max-w-[380px]">{row.descripcion}</span> },
      fecha,
    ],
  },
  configuracion: {
    label: 'Configuración',
    load: listConfiguraciones,
    createConfig: {
      label: 'Nueva configuración',
      title: 'Crear parámetro del sistema',
      successMessage: 'Configuración creada correctamente.',
      submit: createConfiguracion,
      fields: [
        { name: 'claveConfig', label: 'Clave', required: true },
        { name: 'valorConfig', label: 'Valor', type: 'textarea', required: true },
      ],
    },
    columns: [
      { key: 'claveConfig', label: 'Clave', render: (row) => <span className="font-mono font-semibold text-[#89d8b8]">{row.claveConfig}</span> },
      { key: 'valorConfig', label: 'Valor', render: (row) => <span className="line-clamp-1 max-w-[420px]">{row.valorConfig}</span> },
      fecha,
    ],
  },
}

export default function ReportesAuditoriaConfiguracion() {
  const [tab, setTab] = useState('auditoria')
  const current = tabs[tab]

  return (
    <div>
      <SectionHeader eyebrow="CONTROL" title="Reportes, auditoría y configuración" />
      <Tabs
        tabs={Object.entries(tabs).map(([id, value]) => ({ id, label: value.label }))}
        active={tab}
        onChange={setTab}
      />
      <ResourceTable
        key={tab}
        embedded
        load={current.load}
        columns={current.columns}
        filters={current.filters}
        createConfig={current.createConfig}
      />
    </div>
  )
}
