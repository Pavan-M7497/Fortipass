import { memo } from 'react'
import { motion } from 'framer-motion'

const PARTICLE_COUNT = 48

function random(seed: number, max: number) {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453
  return Math.abs(x - Math.floor(x)) * max
}

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: `${random(i, 100)}%`,
  top: `${random(i + 17, 100)}%`,
  size: 1 + random(i + 3, 3),
  duration: 14 + random(i + 5, 18),
  delay: random(i + 9, 12),
  opacity: 0.15 + random(i + 11, 0.45),
}))

export default memo(function CyberBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-mesh-gradient opacity-70 dark:opacity-100" />
      <motion.div
        className="absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-fortiblue/25 blur-[100px] dark:bg-fortiblue/30"
        animate={{ x: [0, 40, -20, 0], y: [0, 30, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 h-[480px] w-[480px] rounded-full bg-fortipurple/20 blur-[110px] dark:bg-fortipurple/28"
        animate={{ x: [0, -36, 24, 0], y: [0, -24, 16, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/3 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-cyan/10 blur-[90px] dark:bg-cyber-cyan/18"
        animate={{ scale: [1, 1.08, 0.96, 1], opacity: [0.35, 0.55, 0.4, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.055]"
        style={{
          backgroundImage: `linear-gradient(rgba(64, 183, 255, 0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(64, 183, 255, 0.35) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-fortiblue/80 shadow-[0_0_12px_rgba(64,183,255,0.6)] dark:bg-cyan-200/90 dark:shadow-[0_0_14px_rgba(34,211,238,0.45)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{ y: [0, -18, 6, 0], opacity: [p.opacity * 0.6, p.opacity, p.opacity * 0.75, p.opacity * 0.6] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fortiblue/40 to-transparent" />
    </div>
  )
})
