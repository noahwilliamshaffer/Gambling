'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { truncateAddress } from '@/lib/utils'
import { useState, useEffect } from 'react'

export function WalletButton() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch user balance when connected
  useEffect(() => {
    if (isConnected && address) {
      fetchBalance()
    } else {
      setBalance(null)
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

  const handleConnect = async () => {
    setLoading(true)
    try {
      await open()
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
    setLoading(false)
  }

  const handleDisconnect = async () => {
    setLoading(true)
    try {
      disconnect()
      setBalance(null)
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
    setLoading(false)
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        {/* Balance Display */}
        <div className="bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 py-2">
          <div className="text-white font-medium text-sm">
            {balance !== null ? `${balance.toFixed(4)} ETH` : 'Loading...'}
          </div>
        </div>
        
        {/* Address Button */}
        <button
          onClick={handleDisconnect}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-purple-500/30"
        >
          {loading ? 'Disconnecting...' : truncateAddress(address)}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 border border-purple-500/30 shadow-lg"
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
} 