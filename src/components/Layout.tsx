'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/lib/web3'
import { WalletButton } from './WalletButton'
import Link from 'next/link'
import { useState } from 'react'

const queryClient = new QueryClient()

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {/* Header */}
          <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="text-3xl">🎰</div>
                  <span className="text-2xl font-bold text-white">Crypto Slots</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/games/slots"
                    className="text-white hover:text-purple-300 transition-colors font-medium"
                  >
                    Play Slots
                  </Link>
                  <Link
                    href="/history"
                    className="text-white hover:text-purple-300 transition-colors font-medium"
                  >
                    History
                  </Link>
                  <WalletButton />
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-2">
                  <WalletButton />
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white hover:text-purple-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              {isMenuOpen && (
                <nav className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/games/slots"
                      className="text-white hover:text-purple-300 transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Play Slots
                    </Link>
                    <Link
                      href="/history"
                      className="text-white hover:text-purple-300 transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      History
                    </Link>
                  </div>
                </nav>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="relative z-0">
            {children}
          </main>

          {/* Footer */}
          <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-white/70">
                <p className="mb-2">🎲 Provably Fair Gaming 🎲</p>
                <p className="text-sm">
                  Built with Next.js, Wagmi, and Ethereum • For Entertainment Purposes
                </p>
              </div>
            </div>
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 