'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="text-8xl mb-6">🎰</div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Crypto Slots
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The most exciting decentralized slot machine on Ethereum. 
          Provably fair, instant payouts, real crypto wins.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/games/slots"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xl px-8 py-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🎲 Start Playing
          </Link>
          <Link
            href="/history"
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium text-xl px-8 py-4 rounded-lg border border-gray-600 transition-all duration-200"
          >
            📊 View History
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-white mb-2">Provably Fair</h3>
          <p className="text-gray-300">
            Every spin is cryptographically verifiable. Server seeds are hashed before play and revealed after.
          </p>
        </div>
        
        <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-white mb-2">Instant Payouts</h3>
          <p className="text-gray-300">
            Win and get paid instantly. No waiting periods, no middlemen. Your winnings are yours immediately.
          </p>
        </div>
        
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">💎</div>
          <h3 className="text-xl font-bold text-white mb-2">Real Crypto</h3>
          <p className="text-gray-300">
            Play with real ETH. Connect your MetaMask or WalletConnect and start winning real cryptocurrency.
          </p>
        </div>
      </div>

      {/* How to Play */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-600 mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">How to Play</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
            <h4 className="text-white font-medium mb-2">Connect Wallet</h4>
            <p className="text-gray-400 text-sm">Connect your MetaMask or WalletConnect wallet</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
            <h4 className="text-white font-medium mb-2">Set Bet Amount</h4>
            <p className="text-gray-400 text-sm">Choose your bet amount (0.001 to 10 ETH)</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
            <h4 className="text-white font-medium mb-2">Spin the Reels</h4>
            <p className="text-gray-400 text-sm">Click spin and watch the reels roll</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
            <h4 className="text-white font-medium mb-2">Collect Winnings</h4>
            <p className="text-gray-400 text-sm">Win up to 5x your bet with matching symbols</p>
          </div>
        </div>
      </div>

      {/* Payout Information */}
      <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-600">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Payout Table</h2>
        
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span className="text-white">3 Matching Symbols</span>
            </div>
            <span className="text-green-400 font-bold text-xl">5x Payout</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎪</span>
              <span className="text-white">2 Matching Symbols</span>
            </div>
            <span className="text-yellow-400 font-bold text-xl">2x Payout</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎲</span>
              <span className="text-white">No Match</span>
            </div>
            <span className="text-gray-400 font-bold text-xl">0x Payout</span>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Symbols: 🍒 Cherry • 🍋 Lemon • 🔔 Bell • 💎 Diamond • 7️⃣ Lucky Seven
          </p>
        </div>
      </div>
    </div>
  )
}
