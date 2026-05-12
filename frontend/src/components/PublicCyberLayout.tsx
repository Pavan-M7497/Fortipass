import { ReactNode } from 'react'
import CyberBackground from './CyberBackground'
import CursorGlow from './CursorGlow'

export default function PublicCyberLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fp-bg-0)] text-[var(--fp-text)]">
      <CyberBackground className="z-0" />
      <CursorGlow />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
