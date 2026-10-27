import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const charts = [
  { title: 'Un futuro más claro', description: 'Crecimiento de tus metas', type: 'line' },
  { title: 'Tu progreso en equilibrio', description: 'Distribución de tus avances', type: 'donut' },
  { title: 'Cada paso cuenta', description: 'Avance mes a mes', type: 'bars' },
]

const linePath =
  'M0 92 C45 82 56 85 91 64 S145 80 185 54 230 62 266 38 320 54 355 24 399 35 440 7'
const chartLine = [
  { x: 0, y: 92 },
  { x: 45, y: 82 },
  { x: 91, y: 64 },
  { x: 145, y: 80 },
  { x: 185, y: 54 },
  { x: 230, y: 62 },
  { x: 266, y: 38 },
  { x: 320, y: 54 },
  { x: 355, y: 24 },
  { x: 399, y: 35 },
  { x: 440, y: 7 },
]
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 72 : -72,
    scale: 0.97,
    opacity: 0,
  }),
  center: { x: 0, scale: 1, opacity: 1 },
  exit: (direction) => ({
    x: direction > 0 ? -72 : 72,
    scale: 0.97,
    opacity: 0,
  }),
}

function LineChart({ reduceMotion }) {
  const markerX = chartLine.map(({ x }) => x)
  const markerY = chartLine.map(({ y }) => y)

  return (
    <div className="relative mt-[2px] h-[132px] overflow-hidden" role="img" aria-label="Gráfico animado de crecimiento">
      <div className="absolute inset-x-0 top-3 flex justify-between text-[9px] text-[rgba(227,242,231,0.5)]" aria-hidden="true">
        <span>Planifica</span>
        <span>Avanza</span>
        <span>Crece</span>
      </div>
      <svg className="absolute inset-x-0 bottom-0 h-[114px] w-full overflow-visible" viewBox="0 0 440 112" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#b6f3dd" stopOpacity=".34" />
            <stop offset="100%" stopColor="#b6f3dd" stopOpacity="0" />
          </linearGradient>
          <filter id="chartGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={`${linePath} V112 H0Z`}
          fill="url(#chartFill)"
          animate={{ opacity: reduceMotion ? [0.62, 0.8, 0.62] : [0.5, 0.88, 0.5] }}
          transition={{ duration: reduceMotion ? 10 : 4.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#b6f3dd"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1, strokeWidth: reduceMotion ? [3, 3.2, 3] : [3, 3.8, 3] }}
          transition={reduceMotion
            ? { duration: 10, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#b6f3dd"
          strokeWidth="11"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="0.24 0.76"
          initial={{ strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: [1, 0], opacity: [0, 0.3, 0.3, 0] }}
          transition={{
            strokeDashoffset: { duration: reduceMotion ? 12 : 4.8, repeat: Infinity, ease: 'linear' },
            opacity: { duration: reduceMotion ? 12 : 4.8, repeat: Infinity, ease: 'linear' },
          }}
          filter="url(#chartGlow)"
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#e1fff1"
          strokeWidth="4.5"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="0.2 0.8"
          initial={{ strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: [1, 0], opacity: [0, 1, 1, 0] }}
          transition={{
            strokeDashoffset: { duration: reduceMotion ? 12 : 4.8, repeat: Infinity, ease: 'linear' },
            opacity: { duration: reduceMotion ? 12 : 4.8, repeat: Infinity, ease: 'linear' },
          }}
          filter="url(#chartGlow)"
        />
        <motion.circle
          r="6"
          fill="#b6f3dd"
          filter="url(#chartGlow)"
          initial={{ cx: 0, cy: 92 }}
          animate={{ cx: [...markerX, 0], cy: [...markerY, 92] }}
          transition={{ duration: reduceMotion ? 16 : 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.circle
          r="11"
          fill="#b6f3dd"
          initial={{ cx: 0, cy: 92, opacity: 0 }}
          animate={{ cx: [...markerX, 0], cy: [...markerY, 92], opacity: [0, 0.16, 0.16, 0] }}
          transition={{
            cx: { duration: reduceMotion ? 16 : 8, repeat: Infinity, ease: 'linear' },
            cy: { duration: reduceMotion ? 16 : 8, repeat: Infinity, ease: 'linear' },
            opacity: { duration: reduceMotion ? 16 : 8, repeat: Infinity, ease: 'linear' },
          }}
        />
      </svg>
    </div>
  )
}

function DonutChart({ reduceMotion }) {
  const segments = [
    { value: 68, color: '#b6f3dd', offset: 0 },
    { value: 22, color: '#6fbd99', offset: 68 },
    { value: 10, color: '#d8efe1', offset: 90 },
  ]

  return (
    <div className="flex h-[132px] items-center justify-center gap-10" role="img" aria-label="Gráfico circular: 68 por ciento metas, 22 por ciento ahorro, 10 por ciento otros">
      <div className="relative size-[116px] shrink-0">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
          {segments.map((segment, index) => {
            const ringCircumference = 2 * Math.PI * 42
            const gap = 3
            const length = (ringCircumference * segment.value) / 100 - gap
            const startOffset = -(ringCircumference * segment.offset) / 100

            return (
              <motion.circle
                key={segment.value}
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={segment.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${length} ${ringCircumference}`}
                initial={reduceMotion ? false : { strokeDasharray: `0 ${ringCircumference}`, opacity: 0.3 }}
                animate={{
                  strokeDasharray: [`0 ${ringCircumference}`, `${length} ${ringCircumference}`, `${length} ${ringCircumference}`],
                  strokeDashoffset: [startOffset + length, startOffset, startOffset],
                  opacity: [0.48, 1, 0.86],
                }}
                transition={{
                  strokeDasharray: { duration: reduceMotion ? 2 : 1.25, delay: index * 0.24, repeat: Infinity, repeatDelay: reduceMotion ? 7 : 3.5, ease: [0.22, 1, 0.36, 1] },
                  strokeDashoffset: { duration: reduceMotion ? 2 : 1.25, delay: index * 0.24, repeat: Infinity, repeatDelay: reduceMotion ? 7 : 3.5, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: reduceMotion ? 8 : 3.6 + index * 0.5, delay: index * 0.24, repeat: Infinity, ease: 'easeInOut' },
                }}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-[Aptos_Display,Segoe_UI,sans-serif] text-[22px] font-semibold leading-none text-white">68%</span>
          <span className="mt-1 text-[8px] text-[rgba(233,246,236,0.6)]">METAS</span>
        </div>
      </div>
      <div className="flex flex-col gap-[11px] text-[9px]">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.value}
            className="flex items-center gap-[7px] text-[rgba(233,246,236,0.72)]"
            animate={{ opacity: reduceMotion ? [0.8, 1, 0.8] : [0.65, 1, 0.65] }}
            transition={{ duration: reduceMotion ? 6 : 2.8, delay: index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="size-[6px] rounded-full" style={{ backgroundColor: segment.color }} />
            <span>{['Metas', 'Ahorro', 'Otros'][index]}</span>
            <span className="ml-auto pl-2 font-semibold text-white">{segment.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function BarsChart({ reduceMotion }) {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN']
  const heights = [40, 62, 48, 77, 60, 88]

  return (
    <div className="relative mt-[2px] h-[132px] px-1 pt-6" role="img" aria-label="Gráfico animado del progreso mensual de enero a junio">
      <div className="absolute inset-x-1 top-[39px] border-t border-dashed border-[rgba(222,246,229,0.16)]" />
      <div className="absolute inset-x-1 top-[76px] border-t border-dashed border-[rgba(222,246,229,0.16)]" />
      <div className="relative flex h-[96px] items-end justify-around gap-[10px]">
        {heights.map((height, index) => (
          <div className="flex h-full flex-1 flex-col items-center justify-end gap-1" key={months[index]}>
            <motion.div
              className="w-full max-w-[32px] rounded-t-[7px] bg-[linear-gradient(180deg,#d9ffed_0%,#8cdbb5_42%,#4d9d75_100%)] shadow-[0_0_18px_rgba(182,243,221,0.22)]"
              initial={{ height: `${height * 0.45}%` }}
              animate={{ height: reduceMotion
                ? [`${height * 0.94}%`, `${height}%`, `${height * 0.94}%`]
                : [`${height * 0.72}%`, `${height}%`, `${height * 0.78}%`] }}
              transition={{
                duration: reduceMotion ? 5 + index * 0.2 : 2.2 + index * 0.16,
                delay: index * 0.16,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
            />
            <span className="text-[8px] font-medium text-[rgba(227,242,231,0.5)]">{months[index]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GrowthChart() {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const activeChart = charts[activeIndex]

  const showChart = (nextIndex, nextDirection) => {
    const next = (nextIndex + charts.length) % charts.length
    setDirection(nextDirection)
    setActiveIndex(next)
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDirection(1)
      setActiveIndex((currentIndex) => (currentIndex + 1) % charts.length)
    }, reduceMotion ? 9000 : 6500)

    return () => window.clearInterval(intervalId)
  }, [activeIndex, reduceMotion])

  return (
    <div className="relative">
      <div className="mb-[2px] flex min-h-[30px] items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="m-0 truncate font-[Aptos_Display,Segoe_UI,sans-serif] text-[15px] font-semibold leading-tight tracking-[-0.4px] text-white">
            {activeChart.title}
          </p>
          <p className="m-0 mt-[2px] text-[7px] font-semibold tracking-[1px] text-[rgba(218,237,223,0.62)]">
            {activeChart.description.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-[5px]">
          <span className="mr-1 text-[7px] tabular-nums text-[rgba(227,242,231,0.44)]">
            0{activeIndex + 1} / 0{charts.length}
          </span>
          {charts.map((chart, index) => (
            <button
              key={chart.type}
              className={`h-1 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b6f3dd] ${index === activeIndex ? 'w-3 bg-[#b6f3dd]' : 'w-1 bg-[rgba(227,242,231,0.32)] hover:bg-[rgba(227,242,231,0.7)]'}`}
              type="button"
              aria-label={`Mostrar gráfico: ${chart.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => showChart(index, index >= activeIndex ? 1 : -1)}
            />
          ))}
          <button
            className="grid size-[19px] place-items-center rounded-full border border-[rgba(215,246,228,0.2)] text-[11px] text-[rgba(233,246,236,0.8)] transition hover:border-[#b6f3dd] hover:text-[#b6f3dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b6f3dd]"
            type="button"
            aria-label="Ver gráfico anterior"
            onClick={() => showChart(activeIndex - 1, -1)}
          >
            ‹
          </button>
          <button
            className="grid size-[19px] place-items-center rounded-full border border-[rgba(215,246,228,0.2)] text-[11px] text-[rgba(233,246,236,0.8)] transition hover:border-[#b6f3dd] hover:text-[#b6f3dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b6f3dd]"
            type="button"
            aria-label="Ver siguiente gráfico"
            onClick={() => showChart(activeIndex + 1, 1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative h-[132px] overflow-hidden" aria-live="polite">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={activeChart.type}
            className="absolute inset-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0.32 : 0.52, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeChart.type === 'line' && <LineChart reduceMotion={reduceMotion} />}
            {activeChart.type === 'donut' && <DonutChart reduceMotion={reduceMotion} />}
            {activeChart.type === 'bars' && <BarsChart reduceMotion={reduceMotion} />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}

export default GrowthChart
