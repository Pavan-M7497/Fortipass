import { useEffect, useState } from 'react'

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('mousemove', onMove)
    document.body.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.body.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      className="cursor-glow-layer hidden md:block transition-opacity duration-500"
      style={{
        opacity: visible ? 1 : 0,
        background: `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, rgba(64, 183, 255, 0.09), transparent 55%),
          radial-gradient(380px circle at ${pos.x}px ${pos.y}px, rgba(145, 85, 255, 0.06), transparent 50%)`,
      }}
    />
  )
}
