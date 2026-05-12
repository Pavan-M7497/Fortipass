import { motion } from 'framer-motion'

interface Props {
  message?: string
}

export default function LoadingScreen({ message = 'Initializing secure session…' }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--fp-bg-0)] px-6 text-[var(--fp-text)]">
      <div className="pointer-events-none absolute inset-0 bg-mesh-gradient opacity-60" />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 rounded-[32px] glass-card px-14 py-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="relative h-16 w-16">
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-fortiblue/25"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="absolute inset-1 rounded-full border-2 border-transparent border-t-fortiblue border-r-fortipurple/80"
            animate={{ rotate: -360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-fortiblue/15 blur-xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-fortiblue">FortiPass</p>
          <p className="mt-3 max-w-xs text-sm text-slate-600 dark:text-slate-400">{message}</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-fortiblue"
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
