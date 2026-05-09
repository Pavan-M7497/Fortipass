import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { evaluatePassword } from '../utils/password'
import { analyzePasswordRemote } from '../services/passwordApi'
import PublicCyberLayout from '../components/PublicCyberLayout'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'

type Analysis = ReturnType<typeof evaluatePassword>

export default function CheckerPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis>(() => evaluatePassword(''))

  // Instant local feedback, then reconcile with FortiPass API (debounced).
  useEffect(() => {
    setAnalysis(evaluatePassword(password))
    if (!password.trim()) return
    const t = window.setTimeout(() => {
      analyzePasswordRemote(password)
        .then((r) => {
          setAnalysis({
            entropy: r.entropy,
            strength: r.strength,
            label: r.label,
            crackTime: r.crackTime,
            suggestions: r.suggestions,
            isWeak: r.isWeak,
            compromised: r.compromised,
            breachCount: r.breachCount,
          })
        })
        .catch(() => {
          /* keep local analysis */
        })
    }, 350)
    return () => clearTimeout(t)
  }, [password])

  const checks = useMemo(
    () => [
      { ok: password.length >= 8, text: 'At least 8 characters' },
      { ok: /[0-9]/.test(password), text: 'Includes a number' },
      { ok: /[^A-Za-z0-9]/.test(password), text: 'Includes a symbol' },
    ],
    [password],
  )

  return (
    <PublicCyberLayout>
      <div className="min-h-screen px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-cyber p-6 sm:p-10"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.4em] text-fortiblue">Password strength checker</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Decode entropy before you deploy it
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Live analysis on crack time, compromise heuristics, and hardening tips (API-backed when online).
                </p>
              </div>
              <motion.div
                className="shrink-0 rounded-2xl border border-fortiblue/25 bg-fortiblue/5 px-4 py-3 text-center font-mono text-xs text-fortiblue dark:text-cyber-cyan"
                animate={{ boxShadow: ['0 0 0 0 rgba(64,183,255,0)', '0 0 24px rgba(64,183,255,0.2)', '0 0 0 0 rgba(64,183,255,0)'] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              >
                LIVE_ANALYSIS
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-10 space-y-8 rounded-[28px] border border-slate-200/80 bg-white/50 p-6 dark:border-white/10 dark:bg-slate-950/40 sm:p-8"
            >
              <div className="rounded-2xl bg-slate-100/80 p-5 dark:bg-slate-950/70">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Target password</label>
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900/80">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Type or paste a password"
                    className="w-full border-none bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                  <motion.button
                    type="button"
                    className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                    onClick={() => setShowPassword((current) => !current)}
                    whileTap={{ scale: 0.96 }}
                  >
                    {showPassword ? 'Hide' : 'Reveal'}
                  </motion.button>
                </div>
                <div className="mt-6">
                  <PasswordStrengthMeter strength={analysis.strength} label={analysis.label} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-slate-950/55"
                  whileHover={{ y: -2 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Crack horizon</p>
                  <p className="mt-3 font-mono text-xl font-semibold text-slate-900 dark:text-white">{analysis.crackTime}</p>
                </motion.div>
                <motion.div
                  className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-slate-950/55"
                  whileHover={{ y: -2 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Compromise risk</p>
                  <p
                    className={`mt-3 font-mono text-xl font-semibold ${analysis.compromised ? 'text-rose-600 dark:text-rose-300' : 'text-emerald-600 dark:text-emerald-300'}`}
                  >
                    {analysis.compromised ? 'Flagged sample' : 'No leak match'}
                  </p>
                </motion.div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/50">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Hardening checklist</p>
                <div className="mt-5 space-y-3">
                  {checks.map((check, i) => (
                    <motion.div
                      key={check.text}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-4 ${
                        check.ok
                          ? 'border border-emerald-500/25 bg-emerald-500/5'
                          : 'border border-slate-200/80 bg-white/60 dark:border-white/10 dark:bg-slate-900/50'
                      }`}
                    >
                      <motion.span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm ${
                          check.ok ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-slate-200/80 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                        animate={check.ok ? { scale: [1, 1.08, 1] } : {}}
                        transition={{ duration: 0.35 }}
                      >
                        {check.ok ? 'OK' : '—'}
                      </motion.span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{check.text}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/70 p-5 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">Suggestions</p>
                  <ul className="mt-3 space-y-2">
                    {analysis.suggestions.length ? (
                      analysis.suggestions.map((suggestion) => (
                        <li key={suggestion} className="flex gap-2">
                          <span className="text-fortiblue">›</span>
                          <span>{suggestion}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex gap-2">
                        <span className="text-fortiblue">›</span>
                        <span>Your password is strong. Keep it unique across accounts.</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PublicCyberLayout>
  )
}
