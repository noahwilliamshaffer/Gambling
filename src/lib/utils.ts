import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format ETH amount to display string
 */
export function formatEth(amount: number, decimals: number = 4): string {
  return amount.toFixed(decimals) + ' ETH';
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Validate bet amount
 */
export function validateBetAmount(amount: number, balance: number): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: 'Bet amount must be greater than 0' };
  }
  
  if (amount > balance) {
    return { valid: false, error: 'Insufficient balance' };
  }
  
  if (amount < 0.001) {
    return { valid: false, error: 'Minimum bet is 0.001 ETH' };
  }
  
  if (amount > 10) {
    return { valid: false, error: 'Maximum bet is 10 ETH' };
  }
  
  return { valid: true };
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(timestamp);
}

/**
 * Generate a random delay for animation
 */
export function randomDelay(min: number = 0, max: number = 0.5): number {
  return Math.random() * (max - min) + min;
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
} 