import { useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { logoutUser } from '../services/auth'
import { useToast } from './Toaster'
import CyberBackground from './CyberBackground'
import CursorGlow from './CursorGlow'

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 13h6V4H4v9zm10 7h6V11h-6v9zM4 20h6v-5H4v5zm10-9h6V4h-6v7z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Vault',
    path: '/vault',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M7 10V8a5 5 0 0110 0v2" strokeLinecap="round" />
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M12 15v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Strength Checker',
    path: '/checker',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        <path d="M8 11h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Generator',
    path: '/generator',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageTitle = useMemo(() => {
    const current = navItems.find((item) => item.path === location.pathname)
    return current ? current.label : 'FortiPass'
  }, [location.pathname])

  const handleSignOut = async () => {
    logoutUser()
    await refreshUser()
    toast.pushToast('Signed out successfully.', 'info')
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fp-bg-0)] text-[var(--fp-text)]">
      <CyberBackground className="z-0" />
      <CursorGlow />

      <div className="relative z-10 flex min-h-screen">
        <motion.aside
          initial={false}
          className={`fixed inset-y-0 left-0 z-30 flex w-[min(100vw,20rem)] flex-col border-r border-slate-200/60 bg-white/75 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 md:static md:w-72 md:translate-x-0 md:rounded-none md:border-r md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-out md:transition-none`}
        >
          <div className="flex items-center justify-between gap-3 pb-8">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fortiblue/25 to-fortipurple/25 text-xl shadow-neon ring-1 ring-white/10"
                whileHover={{ scale: 1.04, rotate: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                🔐
              </motion.div>
              <div>
                <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">FortiPass</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-fortiblue">Neural vault</p>
              </div>
            </div>
            <button type="button" className="secondary-button px-3 py-2 text-xs md:hidden" onClick={() => setSidebarOpen(false)}>
              Close
            </button>
          </div>

          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className="block">
                {({ isActive }) => (
                  <motion.div
                    layout
                    className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/5'
                    }`}
                    whileHover={{ x: isActive ? 0 : 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fortiblue/90 to-fortipurple/85 shadow-neon-strong"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    ) : null}
                    <span className={`relative z-10 ${isActive ? 'text-white' : 'text-fortiblue dark:text-cyber-cyan'}`}>
                      {item.icon}
                    </span>
                    <span className="relative z-10">{item.label}</span>
                    {isActive ? (
                      <motion.span
                        className="relative z-10 ml-auto h-2 w-2 rounded-full bg-white shadow-[0_0_12px_#fff]"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    ) : null}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="card-cyber mt-8 space-y-3 p-5 !shadow-none">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Operator</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">{user?.displayName || 'FortiPass User'}</p>
            <p className="truncate font-mono text-xs text-slate-600 dark:text-slate-500">{user?.email}</p>
          </div>
          <motion.button
            type="button"
            onClick={handleSignOut}
            className="secondary-button mt-5 w-full"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
          >
            Sign out
          </motion.button>
        </motion.aside>

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-slate-950/40 backdrop-blur-sm md:hidden"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <div className="relative flex min-h-screen flex-1 flex-col md:pl-0">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 px-4 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/65 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  className="secondary-button px-4 py-2 text-sm md:hidden"
                  onClick={() => setSidebarOpen(true)}
                  whileTap={{ scale: 0.97 }}
                >
                  Menu
                </motion.button>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-fortiblue/80 dark:text-fortiblue/70">
                    {pageTitle}
                  </p>
                  <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400 sm:text-2xl">
                    {pageTitle}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.span
                  className="hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:flex dark:text-emerald-300"
                  animate={{ boxShadow: ['0 0 0 0 rgba(52,211,153,0)', '0 0 0 6px rgba(52,211,153,0.12)', '0 0 0 0 rgba(52,211,153,0)'] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live secure
                </motion.span>
                <motion.button
                  type="button"
                  onClick={() => toast.pushToast('FortiPass neural mesh operational.', 'info')}
                  className="secondary-button px-4 py-2 text-sm"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Status
                </motion.button>
              </div>
            </div>
          </header>

          <main className="relative flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
