'use client'

import { motion, useAnimation } from 'framer-motion'
import { SLOT_SYMBOLS, SlotSymbol } from '@/lib/slotEngine'
import { useEffect, useState } from 'react'
import { randomDelay } from '@/lib/utils'

interface SlotReelProps {
  finalSymbol: SlotSymbol
  isSpinning: boolean
  reelIndex: number
  onSpinComplete?: () => void
}

export function SlotReel({ finalSymbol, isSpinning, reelIndex, onSpinComplete }: SlotReelProps) {
  const controls = useAnimation()
  const [currentSymbol, setCurrentSymbol] = useState<SlotSymbol>(SLOT_SYMBOLS[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isSpinning && !isAnimating) {
      startSpinAnimation()
    }
  }, [isSpinning, isAnimating])

  const startSpinAnimation = async () => {
    setIsAnimating(true)
    
    // Generate random symbols during spin
    const spinDuration = 1500 + (reelIndex * 300) // Stagger reel stops
    const symbolChangeInterval = 50 // Change symbol every 50ms
    
    const symbolInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * SLOT_SYMBOLS.length)
      setCurrentSymbol(SLOT_SYMBOLS[randomIndex])
    }, symbolChangeInterval)

    // Initial fast spin animation
    await controls.start({
      rotateX: 360 * 5, // Multiple rotations
      transition: {
        duration: spinDuration / 1000,
        ease: "easeOut"
      }
    })

    // Clear the interval and set final symbol
    clearInterval(symbolInterval)
    setCurrentSymbol(finalSymbol)

    // Final settling animation
    await controls.start({
      rotateX: 0,
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    })

    setIsAnimating(false)
    onSpinComplete?.()
  }

  return (
    <div className="relative w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-600 shadow-lg overflow-hidden">
      {/* Reel Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      {/* Symbol Display */}
      <motion.div
        animate={controls}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: 1000 }}
      >
        <div className="text-4xl select-none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {currentSymbol}
        </div>
      </motion.div>

      {/* Spinning Effect Overlay */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Reel Frame */}
      <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-lg pointer-events-none" />
      
      {/* Corner Decorations */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400/50 rounded-full" />
      <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400/50 rounded-full" />
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-yellow-400/50 rounded-full" />
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-400/50 rounded-full" />
    </div>
  )
}

// Component for showing multiple symbols in a reel preview
export function ReelPreview({ symbols }: { symbols: SlotSymbol[] }) {
  return (
    <div className="flex flex-col space-y-2 p-2 bg-gray-800/50 rounded-lg border border-gray-600">
      {symbols.map((symbol, index) => (
        <div key={index} className="text-2xl text-center opacity-50">
          {symbol}
        </div>
      ))}
    </div>
  )
} 