import {
  createEvaluacion,
  decidirSolicitud,

} from '../services/dashboardApi.js'
import { formatDate, formatMoney, shortId } from '../components/ui.jsx'
import { solicitudOptions } from '../components/lookups.jsx'

export const solicitudCell = (row) => <span className="font-mono text-[#89d8b8]">#{shortId(row.solicitudId)}</span>

export const evaluacionConfig = {
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

export const decisionConfig = {
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
      options: [
        { value: 'aprobada', label: 'Aprobar' },
        { value: 'rechazada', label: 'Rechazar' },
        { value: 'condicionada', label: 'Condicionar' },
      ],
    },
    { name: 'montoAprobado', label: 'Monto aprobado', type: 'number', min: 0, step: '0.01' },
    { name: 'razonDecision', label: 'Razón de la decisión', type: 'textarea' },
    { name: 'motivoExcepcion', label: 'Justificación de excepción (requiere aprobación de administrador)', type: 'textarea' },
    { name: 'condiciones', label: 'Condiciones (si aplica)', type: 'textarea' },
  ],
}

export const evaluacionColumns = [
  { key: 'solicitudId', label: 'Solicitud', render: solicitudCell },
  { key: 'scoreBuro', label: 'Score buró', align: 'right', render: (row) => <span className="font-semibold text-white">{row.scoreBuro}</span> },
  { key: 'relacionDeudaIngreso', label: 'Deuda / ingreso', align: 'right' },
  { key: 'comentariosRiesgo', label: 'Comentarios', render: (row) => <span className="line-clamp-1 max-w-[260px]">{row.comentariosRiesgo || '—'}</span> },
  { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
]

export const decisionColumns = [
  { key: 'solicitudId', label: 'Solicitud', render: solicitudCell },
  { key: 'estado', label: 'Decisión', render: (row) => <span className="capitalize">{row.estado || '—'}</span> },
  { key: 'montoAprobado', label: 'Monto aprobado', align: 'right', render: (row) => formatMoney(row.montoAprobado) },
  { key: 'razonDecision', label: 'Razón', render: (row) => <span className="line-clamp-1 max-w-[300px]">{row.razonDecision || '—'}</span> },
  { key: 'motivoExcepcion', label: 'Excepción', render: (row) => <span className="line-clamp-1 max-w-[300px]">{row.motivoExcepcion || '—'}</span> },
  { key: 'condiciones', label: 'Condiciones', render: (row) => <span className="line-clamp-1 max-w-[300px]">{row.condiciones || '—'}</span> },
  { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
]