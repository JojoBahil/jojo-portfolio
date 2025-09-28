'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate parallax offsets based on scroll position
  const parallax1 = scrollY * 0.5
  const parallax2 = scrollY * -0.3
  const parallax3 = scrollY * 0.7
  const parallax4 = scrollY * -0.4
  const parallax5 = scrollY * 0.6

  // Rotation based on scroll
  const rotate1 = scrollY * 0.1
  const rotate2 = scrollY * -0.05

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      
      {/* Floating Geometric Shapes */}
      <div
        style={{ 
          transform: `translateY(${parallax1}px) rotate(${rotate1}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-20 left-10 w-32 h-32 opacity-10 dark:opacity-5"
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl" />
      </div>

      <div
        style={{ 
          transform: `translateY(${parallax2}px) rotate(${rotate2}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-40 right-20 w-24 h-24 opacity-15 dark:opacity-8"
      >
        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg rotate-45 blur-lg" />
      </div>

      <div
        style={{ 
          transform: `translateY(${parallax3}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-60 left-1/4 w-16 h-16 opacity-20 dark:opacity-10"
      >
        <div className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-md" />
      </div>

      <div
        style={{ 
          transform: `translateY(${parallax4}px) rotate(${rotate1}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-80 right-1/3 w-20 h-20 opacity-12 dark:opacity-6"
      >
        <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur-lg" />
      </div>

      <div
        style={{ 
          transform: `translateY(${parallax5}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-96 left-1/2 w-28 h-28 opacity-8 dark:opacity-4"
      >
        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-xl" />
      </div>

      {/* Tech Grid Pattern */}
      <div
        style={{ 
          transform: `translateY(${parallax2}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute inset-0 opacity-5 dark:opacity-3"
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Code-like Elements */}
      <div
        style={{ 
          transform: `translateY(${parallax1}px) rotate(${rotate2}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-32 right-1/4 text-blue-400/20 dark:text-blue-300/10 font-mono text-sm"
      >
        {'</>'}
      </div>

      <div
        style={{ 
          transform: `translateY(${parallax3}px) rotate(${rotate1}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-64 left-1/3 text-purple-400/20 dark:text-purple-300/10 font-mono text-lg"
      >
        {'{}'}
      </div>

      <div
        style={{ 
          transform: `translateY(${parallax4}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-80 right-1/2 text-green-400/20 dark:text-green-300/10 font-mono text-sm"
      >
        {'[]'}
      </div>

      {/* Subtle Particle Effects */}
      <div
        style={{ 
          transform: `translateY(${parallax2}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-40 left-1/2 w-2 h-2 bg-blue-400/30 dark:bg-blue-300/20 rounded-full blur-sm"
      />
      
      <div
        style={{ 
          transform: `translateY(${parallax4}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-72 left-1/4 w-1 h-1 bg-purple-400/40 dark:bg-purple-300/20 rounded-full blur-sm"
      />
      
      <div
        style={{ 
          transform: `translateY(${parallax1}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-cyan-400/30 dark:bg-cyan-300/20 rounded-full blur-sm"
      />

      {/* Animated Lines */}
      <div
        style={{ 
          transform: `translateY(${parallax3}px) rotate(${rotate1}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-48 left-1/6 w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent dark:via-blue-300/20"
      />
      
      <div
        style={{ 
          transform: `translateY(${parallax5}px) rotate(${rotate2}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-72 right-1/6 w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent dark:via-purple-300/20"
      />

      {/* Circuit-like Patterns */}
      <div
        style={{ 
          transform: `translateY(${parallax2}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-1/3 left-1/5 w-16 h-16 opacity-10 dark:opacity-5"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full text-blue-400/30 dark:text-blue-300/20">
          <path d="M8 8h48v8H8zM8 24h48v8H8zM8 40h48v8H8zM8 56h48v8H8z" fill="currentColor" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
          <circle cx="48" cy="16" r="2" fill="currentColor" />
          <circle cx="16" cy="32" r="2" fill="currentColor" />
          <circle cx="48" cy="32" r="2" fill="currentColor" />
        </svg>
      </div>

      <div
        style={{ 
          transform: `translateY(${parallax4}px) rotate(${rotate1}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-2/3 right-1/5 w-12 h-12 opacity-8 dark:opacity-4"
      >
        <svg viewBox="0 0 48 48" className="w-full h-full text-purple-400/30 dark:text-purple-300/20">
          <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
          <circle cx="32" cy="16" r="2" fill="currentColor" />
          <circle cx="16" cy="32" r="2" fill="currentColor" />
          <circle cx="32" cy="32" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Binary Code Animation */}
      <div
        style={{ 
          transform: `translateY(${parallax1}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="absolute top-1/4 right-1/3 text-xs font-mono text-green-400/20 dark:text-green-300/10 opacity-60"
      >
        <motion.div
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
        >
          101010
        </motion.div>
        <motion.div
          animate={{ opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          110011
        </motion.div>
        <motion.div
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        >
          100101
        </motion.div>
      </div>
    </div>
  )
}
