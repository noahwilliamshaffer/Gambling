# 🎰 Crypto Slots - Decentralized Slot Machine

A complete fullstack crypto slot machine built with Next.js 14, featuring provably fair gaming, Web3 wallet integration, and real ETH betting.

## ✨ Features

- **🔒 Provably Fair Gaming**: Every spin is cryptographically verifiable using server-side seeds
- **⚡ Instant Payouts**: Win and get paid immediately - no waiting periods
- **💎 Real Crypto Betting**: Play with real ETH using MetaMask or WalletConnect
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations
- **📊 Game History**: Complete spin history with pagination and statistics
- **🛡️ Secure**: Rate limiting, input validation, and wallet verification

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Web3Modal v3** for wallet connectivity
- **Wagmi & Viem** for Ethereum integration

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma ORM** with SQLite database
- **Node.js crypto** for provably fair randomness
- **Rate limiting** and security measures

### Web3
- **MetaMask & WalletConnect** wallet support
- **Ethereum Sepolia testnet** for testing
- **SIWE (Sign-In With Ethereum)** authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- Some Sepolia testnet ETH for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd crypto-slots
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   
   # NextAuth.js
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Web3 Configuration
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-project-id"
   CHAIN_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/your-api-key"
   
   # App Configuration
   NEXT_PUBLIC_ENVIRONMENT="development"
   NEXT_PUBLIC_CHAIN_ID="11155111"
   ```

4. **Get a WalletConnect Project ID**
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID to your `.env` file

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

1. **Connect Your Wallet**: Click "Connect Wallet" and choose MetaMask or WalletConnect
2. **Get Test ETH**: Get Sepolia testnet ETH from a [faucet](https://sepoliafaucet.com/)
3. **Set Bet Amount**: Choose your bet (0.001 to 10 ETH)
4. **Spin the Reels**: Click the big SPIN button!
5. **Win or Lose**: Get instant payouts for matching symbols

### Payout Table
- **3 Matching Symbols**: 5x your bet
- **2 Matching Symbols**: 2x your bet
- **No Match**: 0x (lose your bet)

### Symbols
🍒 Cherry • 🍋 Lemon • 🔔 Bell • 💎 Diamond • 7️⃣ Lucky Seven

## 🔗 API Endpoints

### `POST /api/spin`
Perform a slot machine spin
```json
{
  "address": "0x...",
  "betAmount": 0.01
}
```

### `GET /api/balance?address=0x...`
Get user balance and statistics

### `GET /api/history?address=0x...&page=1&limit=10`
Get user's spin history with pagination

## 🔒 Provably Fair System

Every spin uses a cryptographically secure random seed:

1. **Server generates a random seed** using Node.js crypto.randomBytes()
2. **Seed is hashed** using SHA-256 before the spin
3. **Hash is provided to client** before revealing the result
4. **After the spin**, the original seed is revealed
5. **Client can verify** that the seed produces the same result

This ensures the house cannot manipulate results after seeing your bet.

## 🛡️ Security Features

- **Wallet Verification**: Every transaction validates wallet ownership
- **Rate Limiting**: Maximum 1 spin per 2 seconds per wallet
- **Input Validation**: All inputs are sanitized and validated
- **Balance Checks**: Prevents betting more than available balance
- **HTTPS Only**: Secure connections in production

## 📱 Mobile Support

The app is fully responsive and works great on:
- Desktop browsers
- Mobile browsers
- MetaMask mobile app
- WalletConnect compatible mobile wallets

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Options
- **Development**: SQLite (included)
- **Production**: PostgreSQL on Railway/Supabase/Neon

### Environment Variables for Production
```env
DATABASE_URL="postgresql://..."  # Your production database
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-project-id"
```

## 🧪 Testing

Run the slot engine tests:
```bash
npm test
```

Test the API endpoints:
```bash
npm run test:api
```

## 📝 License

This project is for educational and entertainment purposes. Please check your local gambling laws before deploying.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

**Wallet won't connect**
- Make sure you have MetaMask installed
- Switch to Sepolia testnet
- Refresh the page

**Spins failing**
- Check you have sufficient balance
- Verify you're on the correct network
- Check browser console for errors

**Database errors**
- Run `npx prisma db push` to sync schema
- Delete `dev.db` and regenerate if needed

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your environment variables
3. Make sure you're on Sepolia testnet
4. Check that your wallet has test ETH

---

Built with ❤️ using Next.js, Ethereum, and lots of coffee ☕

**⚠️ Disclaimer**: This is for educational purposes. Please gamble responsibly and check your local laws.
