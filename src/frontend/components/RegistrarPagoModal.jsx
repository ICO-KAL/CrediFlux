import { useEffect, useMemo, useState } from 'react'
import { ModalAnimation } from '../animation/DashboardAnimation.jsx'
import { useDashboard } from '../helpers/DashboardContext.js'
import { clienteOptions } from './lookups.jsx'
import {
  Badge,
  Icon,
  Spinner,
  buttonGhost,
  buttonPrimary,
  formatDate,
  formatMoney,
  inputClass,
  shortId,
} from './ui.jsx'
import { createPago, listCuotasPendientesDeCliente } from '../services/dashboardApi.js'

const metodos = ['transferencia', 'efectivo', 'cheque', 'tarjeta']
const toCents = (value) => Math.round(Number(value) * 100)

export default function RegistrarPagoModal({ open, onClose, onSaved }) {
  const { notify } = useDashboard()
  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [cuotas, setCuotas] = useState([])
  const [selected, setSelected] = useState({})
  const [metodoPago, setMetodoPago] = useState('transferencia')
  const [referenciaExterna, setReferenciaExterna] = useState('')
  const [loadingCuotas, setLoadingCuotas] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    let active = true
    setClienteId('')
    setCuotas([])
    setSelected({})
    setError('')
    clienteOptions().then((options) => active && setClientes(options)).catch(() => active && setClientes([]))
    return () => {
      active = false
    }
  }, [open])

  const chooseCliente = async (id) => {
    setClienteId(id)
    setCuotas([])
    setSelected({})
    setError('')
    if (!id) return

    setLoadingCuotas(true)
    try {
      setCuotas(await listCuotasPendientesDeCliente(id))
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las cuotas del cliente.')
    } finally {
      setLoadingCuotas(false)
    }
  }

  const toggle = (cuotaId) =>
    setSelected((prev) => {
      const next = { ...prev }
      if (next[cuotaId]) delete next[cuotaId]
      else next[cuotaId] = true
      return next
    })

  const allSelected = cuotas.length > 0 && cuotas.every((cuota) => selected[cuota._id])
  const toggleAll = () =>
    setSelected(allSelected ? {} : Object.fromEntries(cuotas.map((cuota) => [cuota._id, true])))

  const asignaciones = useMemo(
    () => cuotas.filter((cuota) => selected[cuota._id]).map((cuota) => ({ cuotaId: cuota._id, montoAplicado: cuota.montoTotal })),
    [cuotas, selected],
  )
  const total = asignaciones.reduce((sum, item) => sum + toCents(item.montoAplicado), 0) / 100

  const submit = async (event) => {
    event.preventDefault()
    if (asignaciones.length === 0) {
      setError('Selecciona al menos una cuota para aplicar el pago.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await createPago({
        clienteId,
        montoTotal: total,
        metodoPago,
        referenciaExterna: referenciaExterna.trim() || undefined,
        asignaciones,
      })
      notify('Pago registrado y aplicado a las cuotas.', 'success')
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo registrar el pago.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalAnimation open={open} onClose={onClose} wide>
      <form onSubmit={submit} className="rounded-2xl border border-[rgba(183,243,221,0.14)] bg-[#0b2a23] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-[1.6px] text-[#89d8b8]">COBRANZA</p>
            <h3 className="mt-1 text-[20px] font-semibold text-white">Registrar pago</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-8 place-items-center rounded-full text-[#a9c9bb] hover:bg-[rgba(183,243,221,0.08)]">
            <Icon name="x" />
          </button>
        </div>

        <div className="grid max-h-[62vh] gap-4 overflow-y-auto pr-1">
          <label className="grid gap-1.5 text-[10px] font-semibold tracking-[0.4px] text-[#a9c9bb]">
            Cliente <span className="sr-only">obligatorio</span>
            <select className={inputClass} value={clienteId} onChange={(event) => chooseCliente(event.target.value)} required>
              <option value="">Selecciona un cliente…</option>
              {clientes.map((cliente) => (
                <option key={cliente.value} value={cliente.value}>{cliente.label}</option>
              ))}
            </select>
          </label>

          {clienteId && (
            <div>
              <div className="mb-2 flex items-center justify-between text-[10px] font-semibold tracking-[0.4px] text-[#a9c9bb]">
                <span>Cuotas pendientes</span>
                {cuotas.length > 0 && (
                  <button type="button" className="text-[#7ee0b6] hover:underline" onClick={toggleAll}>
                    {allSelected ? 'Quitar selección' : 'Seleccionar todas'}
                  </button>
                )}
              </div>

              {loadingCuotas ? (
                <Spinner label="Buscando cuotas…" />
              ) : cuotas.length === 0 ? (
                <p className="rounded-xl bg-[rgba(3,18,14,0.5)] px-4 py-6 text-center text-[12px] text-[#6f8f82]">
                  Este cliente no tiene cuotas pendientes.
                </p>
              ) : (
                <ul className="grid gap-2">
                  {cuotas.map((cuota) => {
                    const checked = Boolean(selected[cuota._id])
                    return (
                      <li key={cuota._id}>
                        <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${checked ? 'border-[#4aa77e] bg-[rgba(74,167,126,0.1)]' : 'border-[rgba(183,243,221,0.08)] hover:bg-[rgba(183,243,221,0.04)]'}`}>
                          <input type="checkbox" className="size-4 accent-[#4aa77e]" checked={checked} onChange={() => toggle(cuota._id)} />
                          <div className="min-w-0 flex-1 text-[12px]">
                            <p className="font-semibold text-white">
                              Cuota N.º {cuota.numeroCuota} <span className="font-mono text-[10px] font-normal text-[#6f8f82]">· préstamo #{shortId(cuota.prestamoId)}</span>
                            </p>
                            <p className="text-[10px] text-[#6f8f82]">Vence {formatDate(cuota.fechaVencimiento)}</p>
                          </div>
                          <Badge value={cuota.estado} />
                          <span className="w-[112px] text-right text-[12px] font-semibold tabular-nums text-white">{formatMoney(cuota.montoTotal)}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
              <p className="mt-2 text-[10px] text-[#6f8f82]">Cada cuota se paga completa; el sistema no admite abonos parciales.</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[10px] font-semibold tracking-[0.4px] text-[#a9c9bb]">
              Método de pago
              <select className={inputClass} value={metodoPago} onChange={(event) => setMetodoPago(event.target.value)}>
                {metodos.map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-[10px] font-semibold tracking-[0.4px] text-[#a9c9bb]">
              Referencia (opcional)
              <input className={inputClass} value={referenciaExterna} maxLength={150} onChange={(event) => setReferenciaExterna(event.target.value)} />
            </label>
          </div>
        </div>

        {error && <p className="mt-4 rounded-lg bg-[rgba(224,118,106,0.12)] px-3 py-2 text-[11px] text-[#f08c7e]" role="alert">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] text-[#a9c9bb]">
            Total a pagar <span className="ml-2 text-[18px] font-semibold text-white">{formatMoney(total)}</span>
          </p>
          <div className="flex gap-2">
            <button type="button" className={buttonGhost} onClick={onClose}>Cancelar</button>
            <button type="submit" className={buttonPrimary} disabled={saving || asignaciones.length === 0}>
              {saving ? 'Registrando…' : 'Registrar pago'}
            </button>
          </div>
        </div>
      </form>
    </ModalAnimation>
  )
}
