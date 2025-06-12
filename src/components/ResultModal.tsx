'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { SlotSymbol, getSymbolName } from '@/lib/slotEngine'
import { formatEth } from '@/lib/utils'
import { X } from 'lucide-react'

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: {
    reels: [SlotSymbol, SlotSymbol, SlotSymbol]
    win: boolean
    payout: number
    multiplier: number
    betAmount?: number
    balance: number
  } | null
}

export function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
  if (!result) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-600 shadow-2xl max-w-md w-full mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-600">
                <h2 className="text-2xl font-bold text-white">
                  {result.win ? '🎉 You Won!' : '💸 Try Again!'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Result Display */}
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    {result.reels.map((symbol, index) => (
                      <motion.div
                        key={index}
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border border-gray-600 flex items-center justify-center text-3xl"
                      >
                        {symbol}
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="text-gray-300 text-sm space-y-1">
                    {result.reels.map((symbol, index) => (
                      <div key={index}>
                        {getSymbolName(symbol)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Win/Loss Details */}
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bet Amount:</span>
                    <span className="text-white font-medium">{formatEth(result.betAmount || 0)}</span>
                  </div>
                  
                  {result.win && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Multiplier:</span>
                        <span className="text-green-400 font-medium">{result.multiplier}x</span>
                      </div>
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-300">Payout:</span>
                        <span className="text-green-400">{formatEth(result.payout)}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-3">
                    <span className="text-gray-300">New Balance:</span>
                    <span className="text-white">{formatEth(result.balance)}</span>
                  </div>
                </div>

                {/* Win Animation */}
                {result.win && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-6xl mb-2"
                    >
                      💰
                    </motion.div>
                    <div className="text-green-400 font-bold text-xl">
                      Congratulations!
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-600">
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
                >
                  Continue Playing
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 