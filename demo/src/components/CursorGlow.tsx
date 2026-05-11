import { useEffect, useState } from 'react'

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Detect if hovering over interactive elements
      const target = e.target as HTMLElement
      const isInteractive = target.matches('button, a, [role="button"], input, select, textarea')
      setIsHovering(isInteractive)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background: `radial-gradient(
          ${isHovering ? '500px' : '350px'} circle at ${position.x}px ${position.y}px,
          rgba(0, 102, 255, ${isHovering ? '0.12' : '0.06'}),
          transparent 60%
        )`,
        transition: 'background 0.2s ease',
      }}
    />
  )
}
