import crypto from 'crypto';
import CryptoJS from 'crypto-js';

export const SLOT_SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣'] as const;
export type SlotSymbol = typeof SLOT_SYMBOLS[number];

export interface SpinResult {
  reels: [SlotSymbol, SlotSymbol, SlotSymbol];
  win: boolean;
  payout: number;
  multiplier: number;
  serverSeed: string;
  seedHash: string;
}

export interface PayoutRule {
  matches: number;
  multiplier: number;
}

export const PAYOUT_RULES: PayoutRule[] = [
  { matches: 3, multiplier: 5 },  // 3 matching symbols: 5x payout
  { matches: 2, multiplier: 2 },  // 2 matching symbols: 2x payout
];

/**
 * Generate a cryptographically secure random seed
 */
export function generateServerSeed(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash the server seed using SHA-256
 */
export function hashSeed(seed: string): string {
  return CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex);
}

/**
 * Generate a random number from 0-1 using the server seed
 */
function seedRandom(seed: string, nonce: number): number {
  const hash = CryptoJS.HmacSHA256(`${seed}:${nonce}`, seed).toString(CryptoJS.enc.Hex);
  const hashInt = parseInt(hash.substring(0, 8), 16);
  return hashInt / 0xffffffff;
}

/**
 * Select a random symbol using seeded randomness
 */
function selectRandomSymbol(seed: string, nonce: number): SlotSymbol {
  const random = seedRandom(seed, nonce);
  const index = Math.floor(random * SLOT_SYMBOLS.length);
  return SLOT_SYMBOLS[index];
}

/**
 * Calculate the payout multiplier based on matching symbols
 */
export function calculatePayout(reels: [SlotSymbol, SlotSymbol, SlotSymbol]): { multiplier: number; matches: number } {
  const [reel1, reel2, reel3] = reels;
  
  // Check for 3 matching symbols
  if (reel1 === reel2 && reel2 === reel3) {
    return { multiplier: 5, matches: 3 };
  }
  
  // Check for 2 matching symbols
  if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
    return { multiplier: 2, matches: 2 };
  }
  
  // No matches
  return { multiplier: 0, matches: 0 };
}

/**
 * Perform a slot machine spin with provably fair randomness
 */
export function performSpin(betAmount: number): SpinResult {
  // Generate server seed and hash it
  const serverSeed = generateServerSeed();
  const seedHash = hashSeed(serverSeed);
  
  // Generate reels using seeded randomness
  const reel1 = selectRandomSymbol(serverSeed, 1);
  const reel2 = selectRandomSymbol(serverSeed, 2);
  const reel3 = selectRandomSymbol(serverSeed, 3);
  
  const reels: [SlotSymbol, SlotSymbol, SlotSymbol] = [reel1, reel2, reel3];
  
  // Calculate payout
  const { multiplier } = calculatePayout(reels);
  const payout = betAmount * multiplier;
  const win = multiplier > 0;
  
  return {
    reels,
    win,
    payout,
    multiplier,
    serverSeed,
    seedHash
  };
}

/**
 * Verify the fairness of a spin result
 */
export function verifySpinFairness(
  serverSeed: string,
  seedHash: string,
  reels: [SlotSymbol, SlotSymbol, SlotSymbol]
): boolean {
  // Verify that the server seed hashes to the provided hash
  const computedHash = hashSeed(serverSeed);
  if (computedHash !== seedHash) {
    return false;
  }
  
  // Verify that the reels match what would be generated from the seed
  const expectedReel1 = selectRandomSymbol(serverSeed, 1);
  const expectedReel2 = selectRandomSymbol(serverSeed, 2);
  const expectedReel3 = selectRandomSymbol(serverSeed, 3);
  
  return (
    reels[0] === expectedReel1 &&
    reels[1] === expectedReel2 &&
    reels[2] === expectedReel3
  );
}

/**
 * Get symbol display name for UI
 */
export function getSymbolName(symbol: SlotSymbol): string {
  const names: Record<SlotSymbol, string> = {
    '🍒': 'Cherry',
    '🍋': 'Lemon',
    '🔔': 'Bell',
    '💎': 'Diamond',
    '7️⃣': 'Lucky Seven'
  };
  return names[symbol];
} 