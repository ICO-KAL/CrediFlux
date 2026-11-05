import { motion } from 'framer-motion'

export const formatMoney = (value) =>
  `RD$ ${(Number(value) || 0).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  // Las fechas sin hora se guardan a medianoche UTC; en UTC-4 se verían un día antes.
  const dateOnly = typeof value === 'string' && /T00:00:00(\.000)?Z$/.test(value)
  return date.toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(dateOnly ? { timeZone: 'UTC' } : {}),
  })
}

export const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export const shortId = (value) => (value ? String(value).slice(-6).toUpperCase() : '—')

const tones = {
  good: 'bg-[rgba(92,199,155,0.14)] text-[#7ee0b6]',
  warn: 'bg-[rgba(232,184,96,0.14)] text-[#e8b860]',
  bad: 'bg-[rgba(224,118,106,0.14)] text-[#f08c7e]',
  info: 'bg-[rgba(122,170,220,0.14)] text-[#8fbbe8]',
  neutral: 'bg-[rgba(183,243,221,0.08)] text-[#a9c9bb]',
}

const estadoTone = {
  activo: 'good', activa: 'good', aprobada: 'good', pagada: 'good', saldado: 'good', bajo: 'good', true: 'good',
  pendiente: 'warn', en_revision: 'info', medio: 'warn', suspendido: 'warn', bloqueada: 'warn',
  rechazada: 'bad', cancelada: 'bad', cancelado: 'bad', vencida: 'bad', en_mora: 'bad', alto: 'bad', critico: 'bad', bloqueado: 'bad',
}

export function Badge({ value, tone }) {
  const text = String(value ?? '—')
  const resolved = tone || estadoTone[text] || 'neutral'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${tones[resolved]}`}>
      {text.replace(/_/g, ' ')}
    </span>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-[rgba(183,243,221,0.08)] bg-[linear-gradient(160deg,rgba(18,63,51,0.55),rgba(9,43,36,0.75))] shadow-[0_18px_40px_rgba(0,0,0,0.22)] ${className}`}>
      {children}
    </div>
  )
}

export function SectionHeader({ eyebrow, title, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-[9px] font-bold tracking-[1.6px] text-[#89d8b8]">{eyebrow}</p>}
        <h2 className="mt-1 font-[Aptos_Display,Segoe_UI,sans-serif] text-[26px] font-semibold tracking-[-1px] text-white">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

export function Spinner({ label = 'Cargando…' }) {
  return (
    <div className="grid place-items-center gap-3 py-14 text-[11px] text-[#6f8f82]" role="status">
      <motion.span
        className="size-7 rounded-full border-2 border-[rgba(183,243,221,0.15)] border-t-[#5cc79b]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      {label}
    </div>
  )
}

export function EmptyState({ message = 'Todavía no hay registros para mostrar.' }) {
  return (
    <div className="grid place-items-center gap-2 py-14 text-center text-[12px] text-[#6f8f82]">
      <span className="grid size-11 place-items-center rounded-full bg-[rgba(183,243,221,0.06)] text-[18px]">∅</span>
      {message}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="grid place-items-center gap-3 py-12 text-center text-[12px] text-[#f08c7e]" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="rounded-lg border border-[rgba(240,140,126,0.4)] px-3 py-1.5 text-[11px] font-semibold hover:bg-[rgba(240,140,126,0.1)]">
          Reintentar
        </button>
      )}
    </div>
  )
}

export const buttonPrimary =
  'inline-flex items-center gap-2 rounded-xl bg-[#167a59] px-4 py-2.5 text-[11px] font-bold text-white shadow-[0_8px_20px_rgba(22,122,89,0.35)] transition hover:bg-[#1a8d67] disabled:cursor-not-allowed disabled:opacity-60'

export const buttonGhost =
  'inline-flex items-center gap-2 rounded-xl border border-[rgba(183,243,221,0.14)] px-3.5 py-2 text-[11px] font-semibold text-[#b6f3dd] transition hover:bg-[rgba(183,243,221,0.07)] disabled:opacity-50'

export const inputClass =
  'w-full rounded-xl border border-[rgba(183,243,221,0.12)] bg-[rgba(3,18,14,0.5)] px-3.5 py-2.5 text-[12px] text-white outline-none transition placeholder:text-[#4f6e62] focus:border-[#4aa77e] focus:ring-2 focus:ring-[rgba(74,167,126,0.25)]'

const iconPaths = {
  home: 'M3 11.5 12 4l9 7.5M5.5 10v10h13V10',
  users: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.3M15.5 5.2a3 3 0 0 1 0 5.6',
  file: 'M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h5M9.5 16h5',
  tag: 'M3 12V4h8l10 10-8 8zM7.5 8.5h.01',
  wallet: 'M4 7h15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12M16 14h2',
  calendar: 'M5 5h14v15H5zM5 10h14M9 3v4M15 3v4',
  send: 'M21 3 10 14M21 3l-7 18-4-7-7-4z',
  scale: 'M12 4v16M5 20h14M6 8l-3 7a3 3 0 0 0 6 0zM18 8l-3 7a3 3 0 0 0 6 0zM6 8h12',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  chart: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3',
  logout: 'M10 4H5v16h5M15 8l4 4-4 4M19 12H9',
  plus: 'M12 5v14M5 12h14',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  check: 'M5 12.5 10 17.5 19 7',
  x: 'M6 6l12 12M18 6 6 18',
}

export function Icon({ name, className = 'size-[18px]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name] || iconPaths.chart} />
    </svg>
  )
}
