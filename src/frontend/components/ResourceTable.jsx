import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ModalAnimation, Stagger, StaggerItem } from '../animation/DashboardAnimation.jsx'
import { useDashboard } from '../helpers/DashboardContext.js'
import {
  Card,
  EmptyState,
  ErrorState,
  Icon,
  SectionHeader,
  Spinner,
  buttonGhost,
  buttonPrimary,
  inputClass,
} from './ui.jsx'

function FieldInput({ field, value, onChange }) {
  const [options, setOptions] = useState(field.options || [])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!field.loadOptions) return undefined
    let active = true
    field.loadOptions()
      .then((loaded) => active && setOptions(loaded))
      .catch((error) => active && setLoadError(error.message || 'No se pudieron cargar las opciones.'))
    return () => {
      active = false
    }
  }, [field])

  if (field.type === 'select') {
    return (
      <>
        <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} required={field.required}>
          <option value="">Selecciona…</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {loadError && <span className="text-[#f08c7e]" role="alert">{loadError} Cierra y vuelve a abrir el formulario para reintentar.</span>}
      </>
    )
  }

  if (field.type === 'multiselect') {
    return (
      <>
        <select
          className={`${inputClass} min-h-28`}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={(event) => onChange(Array.from(event.target.selectedOptions, (option) => option.value))}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {loadError && <span className="text-[#f08c7e]" role="alert">{loadError} Cierra y vuelve a abrir el formulario para reintentar.</span>}
      </>
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea className={`${inputClass} min-h-[84px] resize-y`} value={value} onChange={(event) => onChange(event.target.value)} required={field.required} placeholder={field.placeholder} />
    )
  }

  return (
    <input
      className={inputClass}
      type={field.type || 'text'}
      value={value}
      min={field.min}
      max={field.max}
      step={field.step}
      required={field.required}
      placeholder={field.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export function FormModal({ open, config, initialValues, onClose, onSaved }) {
  const { notify } = useDashboard()
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setValues(Object.fromEntries(config.fields.map((field) => [
        field.name,
        field.type === 'multiselect'
          ? (initialValues?.[field.name] || []).map((item) => item && typeof item === 'object' ? item._id : item)
          : initialValues?.[field.name] ?? field.defaultValue ?? '',
      ])))
      setError('')
    }
  }, [open, config, initialValues])

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {}
      config.fields.forEach((field) => {
        const raw = values[field.name]
        if (raw === '' || raw === undefined) return
        payload[field.name] = field.type === 'number' ? Number(raw) : raw
      })
      await config.submit(payload, initialValues)
      notify(config.successMessage || 'Registro guardado correctamente.', 'success')
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo guardar el registro.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalAnimation open={open} onClose={onClose}>
      <form onSubmit={submit} className="rounded-2xl border border-[rgba(183,243,221,0.14)] bg-[#0b2a23] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-[1.6px] text-[#89d8b8]">{config.eyebrow || 'NUEVO REGISTRO'}</p>
            <h3 className="mt-1 text-[20px] font-semibold text-white">{config.title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-8 place-items-center rounded-full text-[#a9c9bb] hover:bg-[rgba(183,243,221,0.08)]">
            <Icon name="x" />
          </button>
        </div>

        <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1">
          {config.fields.map((field) => (
            <label key={field.name} className="grid gap-1.5 text-[10px] font-semibold tracking-[0.4px] text-[#a9c9bb]">
              {field.label}{field.required && <span className="text-[#f08c7e]"> *</span>}
              <FieldInput field={field} value={values[field.name] ?? ''} onChange={(next) => setValues((prev) => ({ ...prev, [field.name]: next }))} />
            </label>
          ))}
        </div>

        {error && <p className="mt-4 rounded-lg bg-[rgba(224,118,106,0.12)] px-3 py-2 text-[11px] text-[#f08c7e]" role="alert">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className={buttonGhost} onClick={onClose}>Cancelar</button>
          <button type="submit" className={buttonPrimary} disabled={saving}>{saving ? 'Guardando…' : config.submitLabel || 'Guardar'}</button>
        </div>
      </form>
    </ModalAnimation>
  )
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="mb-5 flex gap-1 rounded-xl border border-[rgba(183,243,221,0.08)] bg-[rgba(3,18,14,0.4)] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`relative flex-1 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${active === tab.id ? 'text-white' : 'text-[#6f8f82] hover:text-[#b6f3dd]'}`}
        >
          {active === tab.id && (
            <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-lg bg-[#167a59]" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
          )}
          <span className="relative">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function ResourceTable({
  eyebrow,
  title,
  load,
  columns,
  filters = [],
  createConfig,
  editConfig,
  rowActions = [],
  pageSize = 10,
  embedded = false,
}) {
  const { notify } = useDashboard()
  const [state, setState] = useState({ items: [], total: 0, loading: true, error: '' })
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [tick, setTick] = useState(0)

  const filterKey = JSON.stringify(filterValues)

  useEffect(() => {
    let active = true
    setState((prev) => ({ ...prev, loading: true, error: '' }))
    load({ page, limit: pageSize, ...JSON.parse(filterKey) })
      .then(({ items, total }) => active && setState({ items, total, loading: false, error: '' }))
      .catch((error) => active && setState({ items: [], total: 0, loading: false, error: error.message }))
    return () => {
      active = false
    }
  }, [load, page, pageSize, filterKey, tick])

  const reload = useCallback(() => setTick((value) => value + 1), [])

  const serverPaginated = state.items.length <= pageSize
  const visible = serverPaginated ? state.items : state.items.slice((page - 1) * pageSize, page * pageSize)
  const pages = Math.max(1, Math.ceil(state.total / pageSize))

  const runAction = async (action, row) => {
    if (action.edit) {
      setEditingRow(row)
      setModalOpen(true)
      return
    }
    if (action.confirm && !window.confirm(action.confirm)) return
    setBusyId(row._id)
    try {
      await action.onClick(row)
      notify(action.successMessage || 'Acción completada.', 'success')
      reload()
    } catch (error) {
      notify(error.message || 'No se pudo completar la acción.')
    } finally {
      setBusyId(null)
    }
  }

  const actions = editConfig
    ? [...rowActions, { label: editConfig.actionLabel || 'Editar', edit: true }]
    : rowActions
  const modalConfig = editingRow ? editConfig : createConfig
  const closeModal = () => {
    setModalOpen(false)
    setEditingRow(null)
  }

  return (
    <div>
      {!embedded && (
        <SectionHeader eyebrow={eyebrow} title={title}>
          <button type="button" className={buttonGhost} onClick={reload} aria-label="Actualizar">
            <Icon name="refresh" className="size-4" /> Actualizar
          </button>
          {createConfig && (
            <button type="button" className={buttonPrimary} onClick={() => { setEditingRow(null); setModalOpen(true) }}>
              <Icon name="plus" className="size-4" /> {createConfig.label}
            </button>
          )}
        </SectionHeader>
      )}

      {embedded && (filters.length > 0 || createConfig) && (
        <div className="mb-4 flex justify-end gap-2">
          {createConfig && (
            <button type="button" className={buttonPrimary} onClick={() => { setEditingRow(null); setModalOpen(true) }}>
              <Icon name="plus" className="size-4" /> {createConfig.label}
            </button>
          )}
        </div>
      )}

      <Card className="overflow-hidden">
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-3 border-b border-[rgba(183,243,221,0.08)] p-4">
            {filters.map((filter) => (
              <select
                key={filter.key}
                className={`${inputClass} !w-auto min-w-[150px]`}
                value={filterValues[filter.key] ?? ''}
                aria-label={filter.label}
                onChange={(event) => {
                  setPage(1)
                  setFilterValues((prev) => ({ ...prev, [filter.key]: event.target.value }))
                }}
              >
                <option value="">{filter.label}: todos</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ))}
          </div>
        )}

        {state.loading ? (
          <Spinner />
        ) : state.error ? (
          <ErrorState message={state.error} onRetry={reload} />
        ) : visible.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[12px]">
              <thead>
                <tr className="text-[9px] font-bold tracking-[1.2px] text-[#6f8f82]">
                  {columns.map((column) => (
                    <th key={column.key} className={`px-5 py-3.5 ${column.align === 'right' ? 'text-right' : ''}`}>{column.label.toUpperCase()}</th>
                  ))}
                  {actions.length > 0 && <th className="px-5 py-3.5 text-right">ACCIONES</th>}
                </tr>
              </thead>
              <Stagger as="tbody" key={`${page}-${filterKey}-${tick}`}>
                {visible.map((row, index) => (
                  <StaggerItem as="tr" key={row._id || index} className="border-t border-[rgba(183,243,221,0.06)] text-[#d6eadf] transition hover:bg-[rgba(183,243,221,0.04)]">
                    {columns.map((column) => (
                      <td key={column.key} className={`px-5 py-3.5 ${column.align === 'right' ? 'text-right tabular-nums' : ''}`}>
                        {column.render ? column.render(row) : (row[column.key] ?? '—')}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          {actions.filter((action) => !action.show || action.show(row)).map((action) => (
                            <button
                              key={action.label}
                              type="button"
                              disabled={busyId === row._id}
                              className={`${buttonGhost} !px-2.5 !py-1.5 ${action.danger ? '!border-[rgba(240,140,126,0.3)] !text-[#f08c7e]' : ''}`}
                              onClick={() => runAction(action, row)}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </StaggerItem>
                ))}
              </Stagger>
            </table>
          </div>
        )}

        {!state.loading && !state.error && state.total > pageSize && (
          <div className="flex items-center justify-between border-t border-[rgba(183,243,221,0.08)] px-5 py-3 text-[11px] text-[#6f8f82]">
            <span>{state.total} registros · página {page} de {pages}</span>
            <div className="flex gap-2">
              <button type="button" className={buttonGhost} disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Anterior</button>
              <button type="button" className={buttonGhost} disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Siguiente</button>
            </div>
          </div>
        )}
      </Card>

      {modalConfig && (
        <FormModal
          open={modalOpen}
          config={modalConfig}
          initialValues={editingRow}
          onClose={closeModal}
          onSaved={reload}
        />
      )}
    </div>
  )
}
