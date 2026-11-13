import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BarsAnimated,
  CountUp,
  LineChartAnimated,
  RingAnimated,
  Stagger,
  StaggerItem,
} from '../animation/DashboardAnimation.jsx'
import { loadDashboardSnapshot } from '../services/dashboardApi.js'
import {lastMonths, sumByMonth, countBy } from '../helpers/panelPrincipal.js'
import { ClienteName } from './lookups.jsx'
import {
  Card,
  Icon,
  SectionHeader,
  Spinner,
  buttonGhost,
  formatDateTime,
  formatMoney,
} from './ui.jsx'


function buildActivity(data) {
  const events = [
    ...data.pagos.items.map((pago) => ({
      id: pago._id,
      icon: 'wallet',
      title: <ClienteName id={pago.clienteId} />,
      subtitle: `Pago recibido · ${pago.metodoPago}`,
      amount: `+ ${formatMoney(pago.montoTotal)}`,
      positive: true,
      date: pago.createdAt,
    })),
    ...data.desembolsos.items.map((item) => ({
      id: item._id,
      icon: 'send',
      title: `Préstamo #${String(item.prestamoId).slice(-6).toUpperCase()}`,
      subtitle: `Desembolso · ${item.metodoPago}`,
      amount: `- ${formatMoney(item.montoDesembolsado)}`,
      positive: false,
      date: item.createdAt,
    })),
    ...data.notificaciones.items.map((item) => ({
      id: item._id,
      icon: 'bell',
      title: item.titulo,
      subtitle: item.leida ? 'Notificación leída' : 'Notificación nueva',
      amount: '',
      positive: true,
      date: item.createdAt,
    })),
  ]
  return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 9)
}

function StatCard({ icon, label, value, hint, highlight, onClick, formatValue }) {
  return (
    <StaggerItem
      as="button"
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl border p-5 text-left transition ${highlight
        ? 'border-[rgba(182,243,221,0.3)] bg-[linear-gradient(135deg,#167a59,#0e5a43)] shadow-[0_18px_40px_rgba(22,122,89,0.35)]'
        : 'border-[rgba(183,243,221,0.08)] bg-[linear-gradient(160deg,rgba(18,63,51,0.55),rgba(9,43,36,0.75))]'}`}
    >
      <span className="pointer-events-none absolute -right-2.5 -top-2.5 grid size-24 place-items-center rounded-full border border-[rgba(183,243,221,0.1)]">
        <span className="grid size-9 place-items-center rounded-xl bg-[rgba(183,243,221,0.1)] text-[#b6f3dd]">
          <Icon name={icon} />
        </span>
      </span>
      <div className="min-h-9 pr-12">
        <p className="min-w-0 text-[40px] font-semibold leading-none tracking-[-2px] text-white [overflow-wrap:anywhere]">
          <CountUp value={value} format={formatValue} />
        </p>
      </div>
      <p className="mt-4 text-[12px] font-semibold text-[#d6eadf]">{label}</p>
      <p className="mt-0.5 text-[10px] text-[#8fb3a3]">{hint}</p>
    </StaggerItem>
  )
}

export default function PanelPrincipal({ onNavigate }) {
  const [data, setData] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    loadDashboardSnapshot().then((snapshot) => active && setData(snapshot))
    return () => {
      active = false
    }
  }, [tick])

  const refresh = useCallback(() => {
    setData(null)
    setTick((value) => value + 1)
  }, [])

  const view = useMemo(() => {
    if (!data) return null
    const months = lastMonths(6)
    const prestamos = countBy(data.prestamos.items, 'estado')
    const solicitudes = countBy(data.solicitudes.items, 'estado')
    const totalPrestamos = data.prestamos.items.length
    const totalSolicitudes = data.solicitudes.items.length
    return {
      months,
      cobros: sumByMonth(data.pagos.items, months, 'montoTotal'),
      desembolsos: sumByMonth(data.desembolsos.items, months, 'montoDesembolsado'),
      solicitudes,
      activos: data.metricasCartera?.prestamosActivos ?? prestamos.activo ?? 0,
      totalPrestamos: data.metricasCartera?.totalPrestamos ?? data.prestamos.total,
      pendientes: (solicitudes.pendiente || 0) + (solicitudes.en_revision || 0),
      sinLeer: data.notificaciones.items.filter((item) => !item.leida).length,
      carteraSana: totalPrestamos ? Math.round((((prestamos.activo || 0) + (prestamos.saldado || 0)) / totalPrestamos) * 100) : 0,
      aprobacion: totalSolicitudes ? Math.round(((solicitudes.aprobada || 0) / totalSolicitudes) * 100) : 0,
      riesgoAlto: data.incidencias.items.filter((item) => ['alto', 'critico'].includes(item.nivelRiesgo)).length,
      activity: buildActivity(data),
    }
  }, [data])

  if (!view) return <Spinner label="Cargando tu panel…" />

  const failed = Object.entries(data).filter(([, value]) => value.error)
  const totalCobrado = view.cobros.reduce((sum, value) => sum + value, 0)
  const totalDesembolsado = view.desembolsos.reduce((sum, value) => sum + value, 0)
  const estados = ['pendiente', 'en_revision', 'aprobada', 'rechazada', 'cancelada']

  return (
    <div>
      <SectionHeader eyebrow="RESUMEN" title="Panel principal">
        <button type="button" className={buttonGhost} onClick={refresh}>
          <Icon name="refresh" className="size-4" /> Actualizar
        </button>
      </SectionHeader>

      {failed.length > 0 && (
        <p className="mb-4 rounded-xl bg-[rgba(224,118,106,0.12)] px-4 py-2.5 text-[11px] text-[#f08c7e]" role="alert">
          No se pudieron cargar: {failed.map(([name]) => name).join(', ')}. {failed[0][1].error}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid min-w-0 gap-5">
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard highlight icon="users" label="Clientes" value={data.clientes.total} hint="Clientes registrados" onClick={() => onNavigate('clientes')} />
            <StatCard icon="wallet" label="Préstamos activos" value={view.activos} hint={`${view.totalPrestamos} préstamos en total`} onClick={() => onNavigate('prestamos')} />
            <StatCard icon="file" label="Solicitudes en curso" value={view.pendientes} hint="Pendientes y en revisión" onClick={() => onNavigate('solicitudes')} />
            <StatCard icon="bell" label="Sin leer" value={view.sinLeer} hint="Notificaciones nuevas" onClick={() => onNavigate('notificaciones')} />
            <StatCard
              icon="wallet"
              label="Capital en cartera"
              value={data.metricasCartera?.capitalColocado ?? 0}
              hint="Capital pendiente de cobro"
              formatValue={formatMoney}
              onClick={() => onNavigate('prestamos')}
            />
            <StatCard
              icon="chart"
              label="PAR 30"
              value={data.metricasCartera?.par30Porcentaje ?? 0}
              hint={`Exposición ${formatMoney(data.metricasCartera?.exposicionPar30 ?? 0)}`}
              formatValue={(value) => `${Number(value).toFixed(2)}%`}
              onClick={() => onNavigate('cuotas')}
            />
            <StatCard
              icon="wallet"
              label="Cobrado hoy"
              value={data.metricasCartera?.cobradoHoy ?? 0}
              hint="Pagos registrados hoy (UTC)"
              formatValue={formatMoney}
              onClick={() => onNavigate('cuotas')}
            />
            <StatCard
              icon="calendar"
              label="Mora crítica"
              value={data.metricasCartera?.prestamosMoraCritica ?? 0}
              hint="Préstamos con cuotas vencidas por 30+ días"
              onClick={() => onNavigate('cuotas')}
            />
          </Stagger>

          <Card className="p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-[17px] font-semibold text-white">Cobros y desembolsos</h3>
                <p className="text-[10px] text-[#6f8f82]">Últimos 6 meses</p>
              </div>
              <div className="flex gap-5 text-[10px] text-[#a9c9bb]">
                <span><span className="mr-1.5 inline-block size-2 rounded-full bg-[#5cc79b]" />Cobrado {formatMoney(totalCobrado)}</span>
                <span><span className="mr-1.5 inline-block size-2 rounded-full bg-[#e0766a]" />Desembolsado {formatMoney(totalDesembolsado)}</span>
              </div>
            </div>
            <LineChartAnimated
              labels={view.months.map((month) => month.label)}
              series={[
                { name: 'Cobrado', color: '#5cc79b', values: view.cobros },
                { name: 'Desembolsado', color: '#e0766a', values: view.desembolsos },
              ]}
              formatValue={(value) => (value >= 1000 ? `${Math.round(value / 1000)}k` : String(Math.round(value)))}
            />
          </Card>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card className="p-6">
              <h3 className="mb-5 text-[17px] font-semibold text-white">Solicitudes por estado</h3>
              <BarsAnimated items={estados.map((estado) => ({ label: estado.replace('_', ' '), value: view.solicitudes[estado] || 0 }))} />
            </Card>

            <Card className="p-6">
              <h3 className="mb-5 text-[17px] font-semibold text-white">Salud de la cartera</h3>
              <div className="flex flex-wrap items-center justify-around gap-4">
                <RingAnimated percent={view.carteraSana} label="Cartera sana" />
                <RingAnimated percent={view.aprobacion} label="Aprobación" color="#8fbbe8" />
              </div>
              <p className="mt-5 text-center text-[10px] text-[#8fb3a3]">
                {view.riesgoAlto} incidencia{view.riesgoAlto === 1 ? '' : 's'} de riesgo alto o crítico
              </p>
            </Card>
          </div>
        </div>

        <Card className="p-6 xl:max-h-[calc(100vh-150px)] xl:overflow-y-auto">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[17px] font-semibold text-white">Actividad</h3>
            <span className="rounded-lg bg-[rgba(3,18,14,0.5)] px-3 py-1.5 text-[10px] text-[#a9c9bb]">Reciente</span>
          </div>
          {view.activity.length === 0 ? (
            <p className="py-10 text-center text-[12px] text-[#6f8f82]">Aún no hay actividad registrada.</p>
          ) : (
            <Stagger as="ul" className="grid gap-1">
              {view.activity.map((event) => (
                <StaggerItem as="li" key={`${event.icon}-${event.id}`} className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-[rgba(183,243,221,0.05)]">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[rgba(183,243,221,0.08)] text-[#b6f3dd]">
                    <Icon name={event.icon} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-white">{event.title}</p>
                    <p className="truncate text-[10px] text-[#6f8f82]">{event.subtitle} · {formatDateTime(event.date)}</p>
                  </div>
                  {event.amount && (
                    <span className={`shrink-0 text-[11px] font-semibold tabular-nums ${event.positive ? 'text-[#7ee0b6]' : 'text-[#f08c7e]'}`}>
                      {event.amount}
                    </span>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Card>
      </div>
    </div>
  )
}
