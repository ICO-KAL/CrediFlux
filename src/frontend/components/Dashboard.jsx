import { Suspense, lazy, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageTransition } from '../animation/DashboardAnimation.jsx'
import { DashboardContext } from '../helpers/DashboardContext.js'
import { Icon, Spinner } from './ui.jsx'
const PanelPrincipal = lazy(() => import('./panelPrincipal.jsx'))
const Clientes = lazy(() => import('./clientes.jsx'))
const SolicitudesCredito = lazy(() => import('./solicitudeCredito.jsx'))
const ProductoCredito = lazy(() => import('./productoCredito.jsx'))
const Evaluacion = lazy(() => import('./evaluacion.jsx'))
const Prestamos = lazy(() => import('./prestamos.jsx'))
const Desembolsos = lazy(() => import('./desembolsos.jsx'))
const CuotasPagos = lazy(() => import('./cuotasPagos.jsx'))
const CuentasMovimientos = lazy(() => import('./cuentasMovimientos.jsx'))
const Notificaciones = lazy(() => import('./notificaciones.jsx'))
const Administracion = lazy(() => import('./administracion.jsx'))
const ReportesAuditoriaConfiguracion = lazy(() => import('./reportesAuditoriaConfiguracion.jsx'))

const sections = [
  { id: 'panel', label: 'Panel principal', icon: 'home', group: 'General' },
  { id: 'clientes', label: 'Clientes', icon: 'users', group: 'Negocio' },
  { id: 'solicitudes', label: 'Solicitudes', icon: 'file', group: 'Negocio' },
  { id: 'productos', label: 'Productos', icon: 'tag', group: 'Negocio' },
  { id: 'evaluacion', label: 'Evaluación', icon: 'scale', group: 'Negocio' },
  { id: 'prestamos', label: 'Préstamos', icon: 'wallet', group: 'Cartera' },
  { id: 'desembolsos', label: 'Desembolsos', icon: 'send', group: 'Cartera' },
  { id: 'cuotas', label: 'Cuotas y pagos', icon: 'calendar', group: 'Cartera' },
  { id: 'cuentas', label: 'Cuentas y movimientos', icon: 'card', group: 'Cartera' },
  { id: 'notificaciones', label: 'Notificaciones', icon: 'bell', group: 'Sistema' },
  { id: 'administracion', label: 'Administración', icon: 'shield', group: 'Sistema' },
  { id: 'reportes', label: 'Auditoría y config.', icon: 'chart', group: 'Sistema' },
]

function renderSection(id, navigate) {
  switch (id) {
    case 'clientes': return <Clientes />
    case 'solicitudes': return <SolicitudesCredito />
    case 'productos': return <ProductoCredito />
    case 'evaluacion': return <Evaluacion />
    case 'prestamos': return <Prestamos />
    case 'desembolsos': return <Desembolsos />
    case 'cuotas': return <CuotasPagos />
    case 'cuentas': return <CuentasMovimientos />
    case 'notificaciones': return <Notificaciones />
    case 'administracion': return <Administracion />
    case 'reportes': return <ReportesAuditoriaConfiguracion />
    default: return <PanelPrincipal onNavigate={navigate} />
  }
}

export default function Dashboard({ session, onLogout, notify }) {
  const [active, setActive] = useState('panel')
  const context = useMemo(() => ({ notify, session }), [notify, session])
  const current = sections.find((section) => section.id === active)
  const groups = [...new Set(sections.map((section) => section.group))]
  const initial = (session.usuario.username || session.usuario.email || '?').charAt(0).toUpperCase()

  return (
    <DashboardContext.Provider value={context}>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_100%_0%,rgba(78,158,123,0.16),transparent_40%),#06201a] p-0 text-white md:p-5">
        <div className="mx-auto flex min-h-screen max-w-[1500px] overflow-hidden bg-[#08241d] md:min-h-[calc(100vh-40px)] md:rounded-[26px] md:border md:border-[rgba(183,243,221,0.08)] md:shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          <motion.aside
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-[68px] shrink-0 flex-col border-r border-[rgba(183,243,221,0.07)] bg-[#061b16] py-5 lg:w-[232px]"
          >
            <div className="mb-6 flex items-center gap-3 px-[17px] lg:px-5">
              <span className="grid size-[34px] shrink-0 place-items-center rounded-[11px] border border-[rgba(182,243,221,0.4)] bg-[rgba(182,243,221,0.1)]">
                <svg className="w-6 stroke-[#b6f3dd] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M7 22.5 13.5 9l4.25 9 2.5-5 4.75 9.5H7Z" />
                  <path d="M8 25h16" />
                </svg>
              </span>
              <span className="hidden font-[Aptos_Display,Segoe_UI,sans-serif] text-[19px] font-extrabold tracking-[-0.8px] lg:block">CrediFlux</span>
            </div>

            <nav className="flex-1 overflow-y-auto px-3" aria-label="Secciones">
              {groups.map((group) => (
                <div key={group} className="mb-4">
                  <p className="mb-2 hidden px-3 text-[9px] font-bold tracking-[1.4px] text-[#4f6e62] lg:block">{group.toUpperCase()}</p>
                  {sections.filter((section) => section.group === group).map((section) => {
                    const isActive = section.id === active
                    return (
                      <button
                        key={section.id}
                        type="button"
                        title={section.label}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setActive(section.id)}
                        className={`relative mb-1 flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-medium transition lg:justify-start ${isActive ? 'text-white' : 'text-[#7d9b8f] hover:bg-[rgba(183,243,221,0.05)] hover:text-[#b6f3dd]'}`}
                      >
                        {isActive && (
                          <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,#167a59,#0e5a43)] shadow-[0_8px_20px_rgba(22,122,89,0.35)]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                        )}
                        <span className="relative"><Icon name={section.icon} /></span>
                        <span className="relative hidden truncate lg:block">{section.label}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </nav>

            <div className="border-t border-[rgba(183,243,221,0.07)] px-3 pt-4">
              <div className="flex items-center gap-3 px-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#167a59] text-[13px] font-bold">{initial}</span>
                <div className="hidden min-w-0 lg:block">
                  <p className="truncate text-[12px] font-semibold">{session.usuario.username}</p>
                  <p className="truncate text-[10px] text-[#6f8f82]">{session.usuario.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Cerrar sesión"
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-medium text-[#f08c7e] transition hover:bg-[rgba(224,118,106,0.1)] lg:justify-start"
              >
                <Icon name="logout" />
                <span className="hidden lg:block">Cerrar sesión</span>
              </button>
            </div>
          </motion.aside>

          <main className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-[rgba(183,243,221,0.07)] px-5 py-4 lg:px-8">
              <div>
                <p className="text-[9px] font-bold tracking-[1.6px] text-[#89d8b8]">CREDIFLUX</p>
                <p className="text-[13px] font-semibold text-[#d6eadf]">{current.label}</p>
              </div>
              <span className="hidden items-center gap-2 text-[10px] text-[#6f8f82] sm:inline-flex">
                <span className="size-1.5 rounded-full bg-[#4aa77e] shadow-[0_0_0_3px_rgba(74,167,126,0.2)]" />
                Sesión segura
              </span>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8">
              <AnimatePresence mode="wait">
                <PageTransition key={active} pageKey={active}>
                  <Suspense fallback={<Spinner />}>{renderSection(active, setActive)}</Suspense>
                </PageTransition>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  )
}
