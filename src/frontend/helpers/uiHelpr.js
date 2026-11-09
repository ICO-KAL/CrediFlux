export const formatMoney = (value) =>
  `RD$ ${(Number(value) || 0).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
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

export const tones = {
  good: 'bg-[rgba(92,199,155,0.14)] text-[#7ee0b6]',
  warn: 'bg-[rgba(232,184,96,0.14)] text-[#e8b860]',
  bad: 'bg-[rgba(224,118,106,0.14)] text-[#f08c7e]',
  info: 'bg-[rgba(122,170,220,0.14)] text-[#8fbbe8]',
  neutral: 'bg-[rgba(183,243,221,0.08)] text-[#a9c9bb]',
}

export const estadoTone = {
  activo: 'good', activa: 'good', aprobada: 'good', pagada: 'good', saldado: 'good', bajo: 'good', true: 'good',
  pendiente: 'warn', en_revision: 'info', medio: 'warn', suspendido: 'warn', bloqueada: 'warn',
  rechazada: 'bad', cancelada: 'bad', cancelado: 'bad', vencida: 'bad', en_mora: 'bad', alto: 'bad', critico: 'bad', bloqueado: 'bad',
}

export const buttonPrimary ='inline-flex items-center gap-2 rounded-xl bg-[#167a59] px-4 py-2.5 text-[11px] font-bold text-white shadow-[0_8px_20px_rgba(22,122,89,0.35)] transition hover:bg-[#1a8d67] disabled:cursor-not-allowed disabled:opacity-60'

export const buttonGhost ='inline-flex items-center gap-2 rounded-xl border border-[rgba(183,243,221,0.14)] px-3.5 py-2 text-[11px] font-semibold text-[#b6f3dd] transition hover:bg-[rgba(183,243,221,0.07)] disabled:opacity-50'

export const inputClass = 'w-full rounded-xl border border-[rgba(183,243,221,0.12)] bg-[rgba(3,18,14,0.5)] px-3.5 py-2.5 text-[12px] text-white outline-none transition placeholder:text-[#4f6e62] focus:border-[#4aa77e] focus:ring-2 focus:ring-[rgba(74,167,126,0.25)]'
