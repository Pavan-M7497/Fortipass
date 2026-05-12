import { useMemo } from 'react'
import { motion } from 'framer-motion'

const SEGMENT_COLORS = [
  'from-rose-500 to-orange-500',
  'from-orange-400 to-amber-400',
  'from-sky-400 to-fortiblue',
  'from-fortiblue via-fortipurple to-cyber-cyan',
]

interface Props {
  strength: number
  label?: string
  className?: string
  showLabel?: boolean
  compact?: boolean
}

export default function PasswordStrengthMeter({
  strength,
  label,
  className = '',
  showLabel = true,
  compact = false,
}: Props) {
  const clamped = Math.max(0, Math.min(100, strength))
  const tier = clamped >= 85 ? 3 : clamped >= 60 ? 2 : clamped >= 30 ? 1 : 0
  const glow = useMemo(
    () =>
      tier === 3
        ? '0 0 28px rgba(64, 183, 255, 0.45), 0 0 50px rgba(145, 85, 255, 0.2)'
        : tier === 2
          ? '0 0 22px rgba(56, 189, 248, 0.35)'
          : tier === 1
            ? '0 0 18px rgba(251, 146, 60, 0.35)'
            : '0 0 16px rgba(244, 63, 94, 0.35)',
    [tier],
  )

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-400">Password strength</span>
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/10 dark:bg-slate-950/80"
            >
              {label}
            </motion.span>
          ) : (
            <span className="text-xs text-slate-400">Awaiting input</span>
          )}
        </div>
      ) : null}

      <div
        className={`relative overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/90 ${compact ? 'h-2.5' : 'h-3.5'}`}
      >
        <motion.div
          className={`relative h-full rounded-full bg-gradient-to-r ${SEGMENT_COLORS[tier]}`}
          initial={false}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          style={{ boxShadow: glow }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
            width: '40%',
          }}
          animate={{ x: ['-100%', '220%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {!compact ? (
        <div className="flex justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
          <span>Entropy surface</span>
          <span className="font-mono text-fortiblue dark:text-cyber-cyan">{clamped}%</span>
        </div>
      ) : null}
    </div>
  )
}
