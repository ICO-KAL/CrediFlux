import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export function PageTransition({ children, pageKey }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      key={pageKey}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  )
}

export function StaggerItem({ children, className = '', as = 'div', ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function CountUp({ value, format = (number) => Math.round(number).toLocaleString('es-DO'), className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const previous = useRef(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const target = Number(value) || 0
    if (reduce) {
      node.textContent = format(target)
      return undefined
    }
    const controls = animate(previous.current, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (current) => {
        node.textContent = format(current)
      },
    })
    previous.current = target
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce])

  return <span ref={ref} className={className}>{format(0)}</span>
}

function smoothPath(points) {
  if (points.length < 2) return ''
  return points.reduce((path, point, index) => {
    if (index === 0) return `M${point.x} ${point.y}`
    const prev = points[index - 1]
    const midX = (prev.x + point.x) / 2
    return `${path} C${midX} ${prev.y} ${midX} ${point.y} ${point.x} ${point.y}`
  }, '')
}

export function LineChartAnimated({ labels, series, formatValue = (n) => n.toLocaleString('es-DO') }) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(null)
  const width = 600
  const height = 220
  const pad = { left: 44, right: 14, top: 14, bottom: 28 }

  const max = useMemo(() => {
    const top = Math.max(1, ...series.flatMap((line) => line.values))
    const magnitude = 10 ** Math.floor(Math.log10(top))
    return Math.ceil(top / magnitude) * magnitude
  }, [series])

  const stepX = labels.length > 1 ? (width - pad.left - pad.right) / (labels.length - 1) : 0
  const toPoint = (value, index) => ({
    x: pad.left + index * stepX,
    y: pad.top + (1 - value / max) * (height - pad.top - pad.bottom),
  })
  const lines = series.map((line) => ({ ...line, points: line.values.map(toPoint) }))
  const grid = [0, 0.25, 0.5, 0.75, 1]

  const onMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - box.left) / box.width) * width
    const index = Math.round((x - pad.left) / (stepX || 1))
    setHover(Math.min(labels.length - 1, Math.max(0, index)))
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Gráfico de líneas"
      >
        {grid.map((ratio) => {
          const y = pad.top + (1 - ratio) * (height - pad.top - pad.bottom)
          return (
            <g key={ratio}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="rgba(183,243,221,0.07)" />
              <text x={pad.left - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#6f8f82">
                {formatValue(max * ratio)}
              </text>
            </g>
          )
        })}
        {labels.map((label, index) => (
          <text key={label + index} x={pad.left + index * stepX} y={height - 8} textAnchor="middle" fontSize="9" fill="#6f8f82">
            {label}
          </text>
        ))}
        {lines.map((line, lineIndex) => (
          <g key={line.name}>
            <motion.path
              d={`${smoothPath(line.points)} L${line.points.at(-1)?.x ?? 0} ${height - pad.bottom} L${line.points[0]?.x ?? 0} ${height - pad.bottom} Z`}
              fill={line.color}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 0.07 }}
              transition={{ duration: 0.8, delay: 0.5 + lineIndex * 0.2 }}
            />
            <motion.path
              d={smoothPath(line.points)}
              fill="none"
              stroke={line.color}
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: lineIndex * 0.2, ease }}
            />
            {line.points.map((point, index) => (
              <motion.circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={hover === index ? 5 : 3}
                fill="#0b2a23"
                stroke={line.color}
                strokeWidth="2"
                initial={reduce ? false : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.06 }}
              />
            ))}
          </g>
        ))}
        {hover !== null && (
          <line
            x1={pad.left + hover * stepX}
            x2={pad.left + hover * stepX}
            y1={pad.top}
            y2={height - pad.bottom}
            stroke="rgba(183,243,221,0.25)"
            strokeDasharray="3 3"
          />
        )}
      </svg>
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute top-1 rounded-lg bg-[#4aa77e] px-3 py-2 text-[11px] font-semibold text-[#06251d] shadow-lg"
            style={{ left: `${((pad.left + hover * stepX) / width) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <p className="mb-1 opacity-70">{labels[hover]}</p>
            {series.map((line) => (
              <p key={line.name} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: line.color }} />
                {line.name}: {formatValue(line.values[hover])}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function BarsAnimated({ items }) {
  const reduce = useReducedMotion()
  const top = Math.max(1, ...items.map((item) => item.value))
  return (
    <div className="flex h-[200px] items-stretch gap-3 px-2">
      {items.map((item, index) => (
        <div key={item.label} className="group flex flex-1 flex-col items-center">
          <div className="flex w-full flex-1 flex-col items-center justify-end gap-1 border-b border-[rgba(183,243,221,0.1)]">
            <span className="text-[10px] font-semibold text-[#b6f3dd] opacity-0 transition-opacity group-hover:opacity-100">
              {item.value}
            </span>
            <motion.div
              className="w-full max-w-[34px] origin-bottom rounded-t-md bg-gradient-to-t from-[#167a59] to-[#5cc79b]"
              style={{ height: `${Math.max(3, (item.value / top) * 80)}%` }}
              initial={reduce ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: index * 0.09, ease }}
            />
          </div>
          <span className="mt-2 text-center text-[9px] leading-tight text-[#6f8f82]">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function RingAnimated({ percent, label, color = '#5cc79b', size = 112 }) {
  const reduce = useReducedMotion()
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const safe = Math.min(100, Math.max(0, percent))
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 112 112" className="size-full -rotate-90">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="rgba(183,243,221,0.08)" strokeWidth="9" />
        <motion.circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduce ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - safe / 100) }}
          transition={{ duration: 1.2, ease }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-[18px] font-bold text-white">
          <CountUp value={safe} format={(n) => `${Math.round(n)}%`} />
        </p>
        <p className="text-[9px] text-[#6f8f82]">{label}</p>
      </div>
    </div>
  )
}

export function ModalAnimation({ open, onClose, children, wide = false }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-30 grid place-items-center bg-[rgba(3,18,14,0.7)] p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            className={`w-full ${wide ? 'max-w-[680px]' : 'max-w-[480px]'}`}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
