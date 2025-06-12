'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { SlotSymbol, getSymbolName } from '@/lib/slotEngine'
import { formatEth, formatTimestamp } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SpinHistoryItem {
  id: string
  betAmount: number
  reels: [SlotSymbol, SlotSymbol, SlotSymbol]
  payout: number
  isWin: boolean
  createdAt: string
  seedHash: string
  serverSeed: string
}

interface HistoryResponse {
  spins: SpinHistoryItem[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export default function HistoryPage() {
  const { address, isConnected } = useAccount()
  const [history, setHistory] = useState<SpinHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (isConnected && address) {
      fetchHistory(1)
    } else {
      setHistory([])
      setLoading(false)
    }
  }, [isConnected, address])

  const fetchHistory = async (pageNum: number = 1) => {
    if (!address) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/history?address=${address}&page=${pageNum}&limit=10`)
      const data: HistoryResponse = await response.json()
      
      if (response.ok) {
        if (pageNum === 1) {
          setHistory(data.spins)
        } else {
          setHistory(prev => [...prev, ...data.spins])
        }
        setPage(pageNum)
        setHasMore(data.hasMore)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
    setLoading(false)
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchHistory(page + 1)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6">📊</div>
          <h1 className="text-4xl font-bold text-white mb-4">Game History</h1>
          <p className="text-xl text-gray-300 mb-8">
            Connect your wallet to view your spin history
          </p>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-6">
            <p className="text-purple-300">
              Please connect your wallet to view your game history.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Game History</h1>
          <p className="text-gray-300">Your complete spin history and results</p>
        </div>

        {/* Stats Summary */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-blue-300 text-sm">Total Spins</div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {history.filter(spin => spin.isWin).length}
              </div>
              <div className="text-green-300 text-sm">Wins</div>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {history.filter(spin => !spin.isWin).length}
              </div>
              <div className="text-red-300 text-sm">Losses</div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {history.length > 0 ? Math.round((history.filter(spin => spin.isWin).length / history.length) * 100) : 0}%
              </div>
              <div className="text-purple-300 text-sm">Win Rate</div>
            </div>
          </div>
        )}

        {/* History Table */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-600 overflow-hidden">
          {loading && history.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-300">Loading your game history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🎰</div>
              <p className="text-gray-300 mb-4">No games played yet</p>
              <a
                href="/games/slots"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
              >
                Start Playing
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Reels
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Bet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payout
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {history.map((spin, index) => (
                    <motion.tr
                      key={spin.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatTimestamp(new Date(spin.createdAt))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {spin.reels.map((symbol, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center text-lg"
                            >
                              {symbol}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatEth(spin.betAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            spin.isWin
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {spin.isWin ? '🎉 Win' : '💸 Loss'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`font-medium ${
                            spin.isWin ? 'text-green-400' : 'text-gray-400'
                          }`}
                        >
                          {spin.isWin ? `+${formatEth(spin.payout)}` : formatEth(0)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="p-6 text-center border-t border-gray-700">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>

        {/* Provably Fair Note */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-white font-bold mb-2">🔒 Provably Fair Gaming</h3>
          <p className="text-gray-300 text-sm">
            Every spin is provably fair and can be verified using the server seed and hash provided. 
            The randomness is generated server-side using cryptographically secure methods.
          </p>
        </div>
      </div>
    </div>
  )
} 