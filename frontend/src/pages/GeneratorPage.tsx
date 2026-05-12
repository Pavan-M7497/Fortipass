import { useState } from 'react'
import { motion } from 'framer-motion'
import { generatePassword, evaluatePassword } from '../utils/password'
import { generatePasswordRemote } from '../services/passwordApi'
import { useToast } from '../components/Toaster'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'

export default function GeneratorPage() {
  const toast = useToast()
  const [length, setLength] = useState(16)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState('FortiPass-2026!')
  const [analysis, setAnalysis] = useState(() => evaluatePassword('FortiPass-2026!'))
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generatePasswordRemote({
        length,
        include_lower: includeLower,
        include_upper: includeUpper,
        include_numbers: includeNumbers,
        include_symbols: includeSymbols,
      })
      setPassword(res.password)
      const a = res.analysis
      setAnalysis({
        entropy: a.entropy,
        strength: a.strength,
        label: a.label,
        crackTime: a.crackTime,
        suggestions: a.suggestions,
        isWeak: a.isWeak,
        compromised: a.compromised,
        breachCount: a.breachCount,
      })
      toast.pushToast('Strong password generated (server).', 'success')
    } catch {
      const next = generatePassword({ length, includeLower, includeUpper, includeNumbers, includeSymbols })
      setPassword(next)
      setAnalysis(evaluatePassword(next))
      toast.pushToast('Generated locally (API unavailable).', 'info')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password)
    toast.pushToast('Copied to clipboard.', 'success')
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-fortiblue">Password generator</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Forge high-entropy secrets</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Tune character surfaces, regenerate via the FortiPass API, with offline fallback.
        </p>
      </motion.div>

      <motion.div layout className="card-cyber p-6 sm:p-8" whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
        <div className="grid gap-10 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Generated output</p>
              <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-950/55">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-base break-all text-slate-900 dark:text-white sm:text-lg">{password}</p>
                  <motion.button type="button" className="secondary-button shrink-0" onClick={handleCopy} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Copy
                  </motion.button>
                </div>
              </div>
            </div>

            <PasswordStrengthMeter strength={analysis.strength} label={analysis.label} />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="mb-2 block">Length: {length}</span>
                <input
                  type="range"
                  min={10}
                  max={32}
                  value={length}
                  onChange={(event) => setLength(Number(event.target.value))}
                  className="w-full"
                />
              </label>
              <div className="grid gap-3">
                {[
                  { label: 'Lowercase', value: includeLower, setter: setIncludeLower },
                  { label: 'Uppercase', value: includeUpper, setter: setIncludeUpper },
                  { label: 'Numbers', value: includeNumbers, setter: setIncludeNumbers },
                  { label: 'Symbols', value: includeSymbols, setter: setIncludeSymbols },
                ].map((option) => (
                  <motion.label
                    key={option.label}
                    className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3.5 text-sm text-slate-800 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200"
                    whileHover={{ x: 3 }}
                  >
                    <input
                      type="checkbox"
                      checked={option.value}
                      onChange={() => option.setter(!option.value)}
                      className="h-4 w-4 rounded border-slate-400 text-fortiblue focus:ring-fortiblue dark:border-slate-600"
                    />
                    {option.label}
                  </motion.label>
                ))}
              </div>
            </div>

            <motion.button
              type="button"
              className="primary-button"
              onClick={() => void handleGenerate()}
              disabled={generating}
              whileHover={{ scale: generating ? 1 : 1.01 }}
              whileTap={{ scale: generating ? 1 : 0.99 }}
            >
              {generating ? 'Generating…' : 'Regenerate password'}
            </motion.button>
          </div>

          <div className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white/50 p-6 dark:border-white/10 dark:bg-slate-950/45">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Telemetry</p>
            <motion.div className="rounded-2xl bg-slate-100/90 p-5 dark:bg-slate-950/80" whileHover={{ y: -2 }}>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Strength class</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{analysis.label}</p>
            </motion.div>
            <motion.div className="rounded-2xl bg-slate-100/90 p-5 dark:bg-slate-950/80" whileHover={{ y: -2 }}>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Entropy</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-fortiblue dark:text-cyber-cyan">{Math.round(analysis.entropy)} bits</p>
            </motion.div>
            <motion.div className="rounded-2xl bg-slate-100/90 p-5 dark:bg-slate-950/80" whileHover={{ y: -2 }}>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Crack time</p>
              <p className="mt-2 font-mono text-xl font-semibold text-slate-900 dark:text-white">{analysis.crackTime}</p>
            </motion.div>
            {analysis.compromised ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-800 dark:text-rose-200"
              >
                Compromised sample detected in heuristic set. Rotate before use.
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
