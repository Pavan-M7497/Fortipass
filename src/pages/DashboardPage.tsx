import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { subscribeVault } from '../services/vault'
import { getSecurityScore } from '../utils/password'
import SecurityScoreRing from '../components/SecurityScoreRing'
import { StrengthDistributionChart, StrengthSparkline } from '../components/DashboardCharts'

const statVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, type: 'spring', stiffness: 120, damping: 18 },
  }),
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) return undefined
    return subscribeVault(user.uid, setItems)
  }, [user])

  const stats = useMemo(() => {
    const total = items.length
    const weak = items.filter((item: any) => item.strength < 60).length
    const strong = items.filter((item: any) => item.strength >= 85).length
    const reused = items.reduce((acc: Record<string, number>, item: any) => {
      acc[item.password] = (acc[item.password] || 0) + 1
      return acc
    }, {})
    const reusedCount = Object.values(reused).filter((count) => count > 1).length
    const score = getSecurityScore(items)
    return { total, weak, strong, reused: reusedCount, score }
  }, [items])

  const topWeak = useMemo(
    () => items.filter((item: any) => item.strength < 60).slice(0, 4),
    [items],
  )

  const statCards = useMemo(
    () => [
      { label: 'Saved credentials', value: stats.total, accent: 'text-fortiblue dark:text-cyber-cyan' },
      { label: 'Weak / at-risk', value: stats.weak, accent: 'text-rose-600 dark:text-rose-300' },
      { label: 'Strong credentials', value: stats.strong, accent: 'text-emerald-600 dark:text-emerald-300' },
      { label: 'Reused patterns', value: stats.reused, accent: 'text-amber-600 dark:text-amber-300' },
    ],
    [stats],
  )

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.45em] text-fortiblue">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Security overview</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            Neural analysis of credential risk, entropy distribution, and breach posture—updated as your vault changes.
          </p>
        </div>
        <motion.div
          className="rounded-2xl border border-fortiblue/25 bg-fortiblue/5 px-4 py-3 font-mono text-xs text-fortiblue dark:border-fortiblue/30 dark:bg-fortiblue/10 dark:text-cyber-cyan"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          SYNC // VAULT_STREAM
        </motion.div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          layout
          className="card-cyber p-6 sm:p-8"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col items-center gap-6 sm:flex-row sm:items-center">
              <SecurityScoreRing score={stats.score} size={196} stroke={9} />
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">FortiPass score</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Composite signal from strength averages with breach penalties. Higher is safer.
                  </p>
                </div>
                <StrengthDistributionChart items={items as { strength: number }[]} />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                custom={i}
                variants={statVariants}
                initial="hidden"
                animate="show"
                className="group rounded-2xl border border-slate-200/80 bg-white/60 p-5 transition-colors hover:border-fortiblue/30 dark:border-white/10 dark:bg-slate-950/50 dark:hover:border-fortiblue/25"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{card.label}</p>
                <motion.p
                  key={card.value}
                  initial={{ opacity: 0.4, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 font-mono text-3xl font-bold tabular-nums ${card.accent}`}
                >
                  {card.value}
                </motion.p>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-fortiblue/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <StrengthSparkline items={items as { strength: number }[]} />
          </div>
        </motion.div>

        <motion.div
          layout
          className="card-cyber flex flex-col p-6 sm:p-8"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Priority queue</p>
            <span className="rounded-full bg-rose-500/10 px-2 py-1 font-mono text-[10px] text-rose-600 dark:text-rose-300">WEAK</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Credentials needing rotation</p>
          <div className="mt-6 flex-1 space-y-4">
            {topWeak.length ? (
              topWeak.map((item: any, idx: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="group rounded-2xl border border-slate-200/80 bg-white/50 p-4 transition-all hover:border-rose-400/35 hover:shadow-[0_0_24px_rgba(244,63,94,0.12)] dark:border-white/10 dark:bg-slate-950/45"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{item.website}</p>
                      <p className="font-mono text-sm text-slate-600 dark:text-slate-400">{item.username}</p>
                    </div>
                    <span className="rounded-xl bg-rose-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rose-600 dark:text-rose-300">
                      Weak
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                    <span>STR {item.strength}</span>
                    <span>{item.compromised ? 'BREACH_SIGNAL' : 'CLEAN'}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                className="rounded-2xl border border-dashed border-slate-300/80 p-10 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No weak credentials detected. Add entries to activate predictive analytics.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
