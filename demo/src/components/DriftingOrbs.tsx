import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface DriftingOrbsProps {
  count?: number
}

export default function DriftingOrbs({ count = 5 }: DriftingOrbsProps) {
  const [orbs, setOrbs] = useState<Array<{
    id: number
    size: number
    x: number
    y: number
    duration: number
    delay: number
    opacity: number
  }>>([])

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 300 + 100,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.15 + 0.05,
    }))
    setOrbs(generated)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full bg-primary/30 blur-[100px]"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            opacity: [orb.opacity, orb.opacity * 1.5, orb.opacity],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
