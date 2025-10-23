'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient de fond */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-bordeaux-900 opacity-90"></div>
      
      {/* Image de fond avec overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/images/background3.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      
      {/* Particules animées */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold-500 opacity-70"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Lignes de connexion animées */}
      <svg className="absolute inset-0 w-full h-full">
        {particles.slice(0, 10).map((particle, i) => (
          <motion.line
            key={`line-${i}`}
            x1={`${particle.x}%`}
            y1={`${particle.y}%`}
            x2={`${particles[(i + 1) % 10].x}%`}
            y2={`${particles[(i + 1) % 10].y}%`}
            stroke="rgba(212, 175, 55, 0.2)"
            strokeWidth="1"
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </svg>
    </div>
  )
}