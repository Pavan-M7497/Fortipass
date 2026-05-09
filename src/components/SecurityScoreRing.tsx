import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Props {
  score: number
  size?: number
  stroke?: number
  className?: string
}

export default function SecurityScoreRing({ score, size = 200, stroke = 10, className = '' }: Props) {
  const clamped = Math.max(0, Math.min(100, score))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = useMotionValue(0)
  const smooth = useSpring(progress, { stiffness: 70, damping: 20 })

  useEffect(() => {
    progress.set(clamped / 100)
  }, [clamped, progress])

  const offset = useTransform(smooth, (p) => circumference * (1 - p))

  const tone =
    clamped >= 85 ? 'text-emerald-400' : clamped >= 60 ? 'text-sky-400' : clamped >= 30 ? 'text-amber-400' : 'text-rose-400'

  const strokeTone =
    clamped >= 85
      ? 'stroke-emerald-400'
      : clamped >= 60
        ? 'stroke-sky-400'
        : clamped >= 30
          ? 'stroke-amber-400'
          : 'stroke-rose-400'

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-slate-200/50 dark:stroke-slate-800"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={`${strokeTone} drop-shadow-[0_0_12px_rgba(64,183,255,0.45)]`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          key={clamped}
          initial={{ scale: 0.92, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className={`font-mono text-4xl font-bold tabular-nums ${tone}`}
        >
          {Math.round(clamped)}
        </motion.span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
          Sec score
        </span>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-2 rounded-full bg-fortiblue/5 blur-2xl dark:bg-fortiblue/15"
        animate={{ opacity: [0.35, 0.65, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
