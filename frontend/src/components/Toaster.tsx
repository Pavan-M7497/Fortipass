import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: string
  message: string
  variant: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  pushToast: (message: string, variant?: Toast['variant']) => void
}

const ToastContext = createContext<ToastContextValue>({
  pushToast: () => {},
})

const variantStyles: Record<
  Toast['variant'],
  { border: string; text: string; glow: string; icon: ReactNode }
> = {
  success: {
    border: 'border-emerald-400/35',
    text: 'text-emerald-700 dark:text-emerald-200',
    glow: 'shadow-[0_0_40px_rgba(52,211,153,0.15)]',
    icon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
        ✓
      </span>
    ),
  },
  error: {
    border: 'border-rose-400/40',
    text: 'text-rose-700 dark:text-rose-200',
    glow: 'shadow-[0_0_40px_rgba(244,63,94,0.15)]',
    icon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-300">
        !
      </span>
    ),
  },
  info: {
    border: 'border-sky-400/35',
    text: 'text-sky-800 dark:text-sky-200',
    glow: 'shadow-[0_0_40px_rgba(56,189,248,0.15)]',
    icon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-300">
        i
      </span>
    ),
  },
}

export default function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (message: string, variant: Toast['variant'] = 'info') => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message, variant }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3800)
  }

  const value = useMemo(() => ({ pushToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        <AnimatePresence>
          {toasts.map((toast) => {
            const v = variantStyles[toast.variant]
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white/90 p-4 backdrop-blur-2xl dark:bg-slate-950/88 ${v.border} ${v.text} ${v.glow}`}
              >
                {v.icon}
                <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
