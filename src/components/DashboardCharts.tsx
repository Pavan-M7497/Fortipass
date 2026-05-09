import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Item {
  strength: number
}

const BUCKET_LABELS = ['Critical', 'Weak', 'Strong', 'Elite']

export function StrengthDistributionChart({ items }: { items: Item[] }) {
  const buckets = useMemo(() => {
    const b = [0, 0, 0, 0]
    items.forEach((item) => {
      if (item.strength < 30) b[0]++
      else if (item.strength < 60) b[1]++
      else if (item.strength < 85) b[2]++
      else b[3]++
    })
    const max = Math.max(1, ...b)
    return b.map((count, i) => ({
      label: BUCKET_LABELS[i],
      count,
      pct: (count / max) * 100,
      color:
        i === 0
          ? 'from-rose-500 to-orange-500'
          : i === 1
            ? 'from-amber-400 to-yellow-400'
            : i === 2
              ? 'from-sky-500 to-fortiblue'
              : 'from-fortiblue to-cyber-cyan',
    }))
  }, [items])

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        Credential risk spectrum
      </p>
      <div className="flex items-end gap-3 sm:gap-4" style={{ height: 140 }}>
        {buckets.map((bar, i) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              className={`relative w-full max-w-[52px] rounded-t-xl bg-gradient-to-t ${bar.color} shadow-neon`}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(8, bar.pct)}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.06 }}
              style={{ minHeight: 8 }}
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-xs font-semibold text-slate-700 dark:text-white">
                {bar.count}
              </span>
            </motion.div>
            <span className="text-center text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StrengthSparkline({ items }: { items: Item[] }) {
  const points = useMemo(() => {
    const vals = items.slice(0, 24).map((i) => i.strength)
    if (!vals.length) return ''
    if (vals.length === 1) vals.push(vals[0])
    const w = 280
    const h = 72
    const max = 100
    const step = w / Math.max(1, vals.length - 1)
    return vals
      .map((v, i) => {
        const x = i * step
        const y = h - (v / max) * (h - 8) - 4
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')
  }, [items])

  const hasData = items.length > 0

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        Live strength telemetry
      </p>
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-950/40">
        {hasData ? (
          <svg viewBox="0 0 280 72" className="h-24 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#40b7ff" />
                <stop offset="100%" stopColor="#9155ff" />
              </linearGradient>
            </defs>
            <motion.path
              d={points}
              fill="none"
              stroke="url(#sparkGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(64,183,255,0.35))' }}
            />
          </svg>
        ) : (
          <p className="py-6 text-center text-sm text-slate-500">Add vault entries to illuminate the trace.</p>
        )}
      </div>
    </div>
  )
}
