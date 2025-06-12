import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { WagmiConfig } from 'wagmi'
import { sepolia, mainnet } from 'viem/chains'

// 1. Define chains
const chains = [sepolia, mainnet] as const

// 2. Create wagmiConfig
const metadata = {
  name: 'Crypto Slots',
  description: 'Decentralized Slot Machine Game',
  url: 'https://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
if (typeof window !== 'undefined') {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#8B5CF6',
      '--w3m-color-mix-strength': 40
    }
  })
}

export { wagmiConfig } 