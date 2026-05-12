import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { logoutUser } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toaster'

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = (localStorage.getItem('fortipass-theme') as 'light' | 'dark') || 'dark'
    setTheme(saved)
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('fortipass-theme', next)
    toast.pushToast(`Switched to ${next} mode.`, 'info')
  }

  const handleLogout = async () => {
    logoutUser()
    await refreshUser()
    toast.pushToast('Logged out successfully.', 'info')
    navigate('/login')
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-fortiblue">Settings</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Control plane</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Calibrate appearance, session posture, and operator profile for your FortiPass workspace.
        </p>
      </motion.div>

      <motion.div layout className="grid gap-6 lg:grid-cols-[0.85fr_0.95fr]">
        <motion.div className="card-cyber p-6 sm:p-8" whileHover={{ y: -2 }}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account overview</h2>
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-6 dark:border-white/10 dark:bg-slate-950/55">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Display name</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{user?.displayName || 'FortiPass user'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-6 dark:border-white/10 dark:bg-slate-950/55">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</p>
              <p className="mt-2 break-all font-mono text-lg font-semibold text-slate-900 dark:text-white">{user?.email || 'unknown'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="card-cyber space-y-8 p-6 sm:p-8" whileHover={{ y: -2 }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Appearance</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Toggle between dark operations mode and light briefing mode.</p>
            <motion.button
              type="button"
              onClick={handleToggleTheme}
              className="primary-button mt-5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Switch to {theme === 'dark' ? 'light' : 'dark'} mode
            </motion.button>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Session</p>
            <motion.button
              type="button"
              onClick={handleLogout}
              className="secondary-button mt-4 w-full"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              Sign out of FortiPass
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
