import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Stagger, StaggerItem } from '../animation/DashboardAnimation.jsx'
import { useDashboard } from '../helpers/DashboardContext.js'
import { ClienteName } from './lookups.jsx'
import {
  Card,
  EmptyState,
  ErrorState,
  Icon,
  SectionHeader,
  Spinner,
  buttonGhost,
  formatDateTime,
} from './ui.jsx'
import { eliminarNotificacion, listNotificaciones, marcarNotificacionLeida } from '../services/dashboardApi.js'

const filterOptions = [
  { id: '', label: 'Todas' },
  { id: 'false', label: 'Sin leer' },
  { id: 'true', label: 'Leídas' },
]

export default function Notificaciones() {
  const { notify } = useDashboard()
  const [filter, setFilter] = useState('')
  const [state, setState] = useState({ items: [], loading: true, error: '' })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    setState((prev) => ({ ...prev, loading: true, error: '' }))
    listNotificaciones({ limit: 50, leida: filter })
      .then(({ items }) => active && setState({ items, loading: false, error: '' }))
      .catch((error) => active && setState({ items: [], loading: false, error: error.message }))
    return () => {
      active = false
    }
  }, [filter, tick])

  const reload = useCallback(() => setTick((value) => value + 1), [])

  const act = async (action, successMessage) => {
    try {
      await action()
      notify(successMessage, 'success')
      reload()
    } catch (error) {
      notify(error.message)
    }
  }

  return (
    <div>
      <SectionHeader eyebrow="COMUNICACIÓN" title="Notificaciones">
        <div className="flex gap-1 rounded-xl border border-[rgba(183,243,221,0.08)] bg-[rgba(3,18,14,0.4)] p-1">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${filter === option.id ? 'bg-[#167a59] text-white' : 'text-[#6f8f82] hover:text-[#b6f3dd]'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </SectionHeader>

      <Card className="p-2">
        {state.loading ? (
          <Spinner />
        ) : state.error ? (
          <ErrorState message={state.error} onRetry={reload} />
        ) : state.items.length === 0 ? (
          <EmptyState message="No tienes notificaciones en esta vista." />
        ) : (
          <Stagger key={`${filter}-${tick}`} className="grid gap-1">
            {state.items.map((item) => (
              <StaggerItem key={item._id} className={`flex items-start gap-4 rounded-xl p-4 transition hover:bg-[rgba(183,243,221,0.04)] ${item.leida ? 'opacity-60' : ''}`}>
                <span className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full ${item.leida ? 'bg-[rgba(183,243,221,0.06)] text-[#6f8f82]' : 'bg-[rgba(92,199,155,0.16)] text-[#7ee0b6]'}`}>
                  <Icon name="bell" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3">
                    <p className="text-[13px] font-semibold text-white">{item.titulo}</p>
                    {!item.leida && (
                      <motion.span className="size-2 rounded-full bg-[#5cc79b]" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
                    )}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#a9c9bb]">{item.mensaje}</p>
                  <p className="mt-2 text-[10px] text-[#6f8f82]">
                    <ClienteName id={item.clienteId} /> · {formatDateTime(item.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!item.leida && (
                    <button type="button" className={`${buttonGhost} !px-2.5 !py-1.5`} onClick={() => act(() => marcarNotificacionLeida(item._id), 'Notificación marcada como leída.')}>
                      <Icon name="check" className="size-3.5" /> Leída
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Eliminar notificación"
                    className={`${buttonGhost} !border-[rgba(240,140,126,0.3)] !px-2.5 !py-1.5 !text-[#f08c7e]`}
                    onClick={() => window.confirm('¿Eliminar esta notificación?') && act(() => eliminarNotificacion(item._id), 'Notificación eliminada.')}
                  >
                    <Icon name="x" className="size-3.5" />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Card>
    </div>
  )
}
