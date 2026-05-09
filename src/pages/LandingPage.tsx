import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PublicCyberLayout from '../components/PublicCyberLayout'

export default function LandingPage() {
  return (
    <PublicCyberLayout>
      <div className="min-h-screen px-4 py-8 sm:px-10 lg:px-16">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl shadow-neon ring-1 ring-white/10 dark:bg-white/5"
              whileHover={{ rotate: -6, scale: 1.05 }}
            >
              🔐
            </motion.div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">FortiPass</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-fortiblue">Credential AI</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/login" className="secondary-button text-sm">
              Login
            </Link>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link to="/signup" className="primary-button text-sm">
                Get started
              </Link>
            </motion.div>
          </div>
        </header>

        <main className="mx-auto mt-14 max-w-6xl lg:mt-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="space-y-8">
              <motion.span
                className="inline-flex rounded-full border border-fortiblue/25 bg-fortiblue/5 px-4 py-2 text-sm font-semibold text-fortiblue dark:text-cyber-cyan"
                animate={{ boxShadow: ['0 0 0 0 rgba(64,183,255,0)', '0 0 28px rgba(64,183,255,0.15)', '0 0 0 0 rgba(64,183,255,0)'] }}
                transition={{ duration: 3.2, repeat: Infinity }}
              >
                Premium cybersecurity SaaS for credential intelligence
              </motion.span>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                  Fortify secrets.{' '}
                  <span className="bg-gradient-to-r from-fortiblue via-fortipurple to-cyber-cyan bg-clip-text text-transparent">Illuminate risk.</span>
                </h1>
                <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                  A futuristic control plane for password strength, encrypted vaulting, and breach heuristics—wired for operators who want clarity, not
                  noise.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/signup" className="primary-button">
                    Start free
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/checker" className="secondary-button">
                    Try strength checker
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="card-cyber relative overflow-hidden p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(64,183,255,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(145,85,255,0.12),_transparent_32%)]" />
              <div className="relative space-y-6">
                <div className="space-y-3">
                  <span className="font-mono text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Command deck</span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard, generator, vault, live analytics.</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div
                    className="rounded-2xl border border-slate-200/80 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5"
                    whileHover={{ y: -4 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Security score</p>
                    <p className="mt-3 bg-gradient-to-r from-fortiblue to-fortipurple bg-clip-text font-mono text-3xl font-bold text-transparent">92</p>
                  </motion.div>
                  <motion.div
                    className="rounded-2xl border border-slate-200/80 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5"
                    whileHover={{ y: -4 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Breach radar</p>
                    <p className="mt-3 font-mono text-3xl font-bold text-fortiblue dark:text-cyber-cyan">Nominal</p>
                  </motion.div>
                </div>
                <div className="rounded-2xl border border-fortiblue/15 bg-slate-100/80 p-5 dark:border-fortiblue/20 dark:bg-slate-950/50">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">Capabilities</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-fortiblue">▹</span> Real-time entropy lattice & crack horizon
                    </li>
                    <li className="flex gap-2">
                      <span className="text-fortiblue">▹</span> AES-encrypted vault with strength telemetry
                    </li>
                    <li className="flex gap-2">
                      <span className="text-fortiblue">▹</span> Breach heuristics with instant rotation cues
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PublicCyberLayout>
  )
}
