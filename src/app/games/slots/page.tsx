'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { SlotReel } from '@/components/SlotReel'
import { ResultModal } from '@/components/ResultModal'
import { SLOT_SYMBOLS, SlotSymbol, PAYOUT_RULES } from '@/lib/slotEngine'
import { formatEth, validateBetAmount } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SpinResult {
  reels: [SlotSymbol, SlotSymbol, SlotSymbol]
  win: boolean
  payout: number
  multiplier: number
  balance: number
  serverSeed: string
  seedHash: string
  betAmount?: number
  error?: string
}

export default function SlotsPage() {
  const { address, isConnected } = useAccount()
  const [balance, setBalance] = useState<number>(0)
  const [betAmount, setBetAmount] = useState<number>(0.01)
  const [isSpinning, setIsSpinning] = useState(false)
  const [reels, setReels] = useState<[SlotSymbol, SlotSymbol, SlotSymbol]>([
    SLOT_SYMBOLS[0],
    SLOT_SYMBOLS[1], 
    SLOT_SYMBOLS[2]
  ])
  const [lastResult, setLastResult] = useState<SpinResult | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [error, setError] = useState<string>('')
  const [reelsCompleted, setReelsCompleted] = useState(0)

  // Fetch balance when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchBalance()
    }
  }, [isConnected, address])

  const fetchBalance = async () => {
    if (!address) return
    
    try {
      const response = await fetch(`/api/balance?address=${address}`)
      const data = await response.json()
      if (response.ok) {
        setBalance(data.balance)
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const handleSpin = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    const validation = validateBetAmount(betAmount, balance)
    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    setError('')
    setIsSpinning(true)
    setReelsCompleted(0)

    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          betAmount,
        }),
      })

      const result: SpinResult = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Spin failed')
      }

      // Update reels with the result
      setReels(result.reels)
      setLastResult({ ...result, betAmount: betAmount })
      setBalance(result.balance)

    } catch (error) {
      console.error('Spin error:', error)
      setError(error instanceof Error ? error.message : 'Spin failed')
      setIsSpinning(false)
    }
  }

  const handleReelComplete = () => {
    setReelsCompleted(prev => {
      const newCount = prev + 1
      if (newCount === 3) {
        // All reels completed
        setIsSpinning(false)
        if (lastResult) {
          setShowResultModal(true)
        }
      }
      return newCount
    })
  }

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      setBetAmount(value)
      setError('')
    }
  }

  const quickBet = (multiplier: number) => {
    setBetAmount(prev => Math.max(0.001, prev * multiplier))
    setError('')
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6">🎰</div>
          <h1 className="text-4xl font-bold text-white mb-4">Crypto Slots</h1>
          <p className="text-xl text-gray-300 mb-8">
            Connect your wallet to start playing the most exciting crypto slot machine!
          </p>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-6">
            <p className="text-purple-300">
              Please connect your wallet using the button above to start playing.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎰 Crypto Slots</h1>
          <p className="text-gray-300">Provably fair • Instant payouts • Real crypto wins</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{formatEth(balance)}</div>
            <div className="text-purple-300 text-sm">Your Balance</div>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{formatEth(betAmount)}</div>
            <div className="text-blue-300 text-sm">Bet Amount</div>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {lastResult?.win ? `${lastResult.multiplier}x` : '0x'}
            </div>
            <div className="text-green-300 text-sm">Last Multiplier</div>
          </div>
        </div>

        {/* Slot Machine */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-600 shadow-2xl mb-8">
          {/* Reels */}
          <div className="flex justify-center space-x-6 mb-8">
            {reels.map((symbol, index) => (
              <SlotReel
                key={index}
                finalSymbol={symbol}
                isSpinning={isSpinning}
                reelIndex={index}
                onSpinComplete={handleReelComplete}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Bet Amount */}
            <div className="text-center">
              <label className="block text-white font-medium mb-2">Bet Amount</label>
              <div className="flex items-center justify-center space-x-4">
                <input
                  type="number"
                  min="0.001"
                  max="10"
                  step="0.001"
                  value={betAmount}
                  onChange={handleBetChange}
                  disabled={isSpinning}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 w-32 text-center border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
                <span className="text-gray-300">ETH</span>
              </div>
            </div>

            {/* Quick Bet Buttons */}
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => quickBet(0.5)}
                disabled={isSpinning}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                ½
              </button>
              <button
                onClick={() => quickBet(2)}
                disabled={isSpinning}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                2×
              </button>
              <button
                onClick={() => setBetAmount(0.001)}
                disabled={isSpinning}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Min
              </button>
              <button
                onClick={() => setBetAmount(Math.min(balance, 10))}
                disabled={isSpinning}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Max
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Spin Button */}
            <div className="text-center">
              <motion.button
                onClick={handleSpin}
                disabled={isSpinning || !isConnected}
                whileHover={{ scale: isSpinning ? 1 : 1.05 }}
                whileTap={{ scale: isSpinning ? 1 : 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl px-12 py-4 rounded-lg shadow-lg transition-all duration-200"
              >
                {isSpinning ? 'Spinning...' : '🎰 SPIN'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Payout Table */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-white font-bold mb-4 text-center">💰 Payout Table</h3>
          <div className="space-y-2">
            {PAYOUT_RULES.map((rule, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">
                  {rule.matches} matching symbols
                </span>
                <span className="text-green-400 font-medium">
                  {rule.multiplier}x payout
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-600 text-center text-gray-400 text-xs">
            All outcomes are provably fair and verifiable
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={lastResult}
      />
    </div>
  )
} 