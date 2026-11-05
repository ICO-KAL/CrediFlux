import { useState } from 'react'
import ResourceTable, { Tabs } from './ResourceTable.jsx'
import { SectionHeader, formatDate, formatMoney, shortId } from './ui.jsx'
import { solicitudOptions } from './lookups.jsx'
import {
  createEvaluacion,
  decidirSolicitud,
  listDecisiones,
  listEvaluaciones,
} from '../services/dashboardApi.js'

const solicitudCell = (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row.solicitudId)}</span>

const evaluacionConfig = {
  label: 'Nueva evaluación',
  title: 'Registrar evaluación crediticia',
  successMessage: 'Evaluación registrada correctamente.',
  submit: createEvaluacion,
  fields: [
    { name: 'solicitudId', label: 'Solicitud', type: 'select', required: true, loadOptions: solicitudOptions },
    { name: 'scoreBuro', label: 'Score de buró', type: 'number', min: 0, step: '1', required: true },
    { name: 'relacionDeudaIngreso', label: 'Relación deuda / ingreso', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'comentariosRiesgo', label: 'Comentarios de riesgo', type: 'textarea' },
  ],
}

const decisionConfig = {
  label: 'Decidir solicitud',
  title: 'Decisión de crédito',
  successMessage: 'Decisión registrada correctamente.',
  submit: ({ solicitudId, ...body }) => decidirSolicitud(solicitudId, body),
  fields: [
    { name: 'solicitudId', label: 'Solicitud', type: 'select', required: true, loadOptions: solicitudOptions },
    {
      name: 'estado',
      label: 'Decisión',
      type: 'select',
      required: true,
      options: [{ value: 'aprobada', label: 'Aprobar' }, { value: 'rechazada', label: 'Rechazar' }],
    },
    { name: 'montoAprobado', label: 'Monto aprobado', type: 'number', min: 0, step: '0.01' },
    { name: 'razonDecision', label: 'Razón de la decisión', type: 'textarea' },
  ],
}

const evaluacionColumns = [
  { key: 'solicitudId', label: 'Solicitud', render: solicitudCell },
  { key: 'scoreBuro', label: 'Score buró', align: 'right', render: (row) => <span className="font-semibold text-white">{row.scoreBuro}</span> },
  { key: 'relacionDeudaIngreso', label: 'Deuda / ingreso', align: 'right' },
  { key: 'comentariosRiesgo', label: 'Comentarios', render: (row) => <span className="line-clamp-1 max-w-[260px]">{row.comentariosRiesgo || '—'}</span> },
  { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
]

const decisionColumns = [
  { key: 'solicitudId', label: 'Solicitud', render: solicitudCell },
  { key: 'montoAprobado', label: 'Monto aprobado', align: 'right', render: (row) => formatMoney(row.montoAprobado) },
  { key: 'razonDecision', label: 'Razón', render: (row) => <span className="line-clamp-1 max-w-[300px]">{row.razonDecision || '—'}</span> },
  { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
]

export default function Evaluacion() {
  const [tab, setTab] = useState('evaluaciones')

  return (
    <div>
      <SectionHeader eyebrow="RIESGO" title="Evaluación y decisión" />
      <Tabs
        tabs={[{ id: 'evaluaciones', label: 'Evaluaciones' }, { id: 'decisiones', label: 'Decisiones' }]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'evaluaciones' ? (
        <ResourceTable key="evaluaciones" embedded load={listEvaluaciones} columns={evaluacionColumns} createConfig={evaluacionConfig} />
      ) : (
        <ResourceTable key="decisiones" embedded load={listDecisiones} columns={decisionColumns} createConfig={decisionConfig} />
      )}
    </div>
  )
}
