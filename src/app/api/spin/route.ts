import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { performSpin } from '@/lib/slotEngine';
import { validateBetAmount, isValidAddress } from '@/lib/utils';

interface SpinRequest {
  address: string;
  betAmount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SpinRequest = await request.json();
    const { address, betAmount } = body;

    // Validate input
    if (!address || !isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!betAmount || typeof betAmount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid bet amount' },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { address: address.toLowerCase() }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          address: address.toLowerCase(),
          balance: 1.0, // Starting balance
        }
      });
    }

    // Validate bet amount against balance
    const validation = validateBetAmount(betAmount, user.balance);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check rate limiting - one spin every 2 seconds
    const lastSpin = await prisma.spin.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (lastSpin) {
      const timeSinceLastSpin = Date.now() - lastSpin.createdAt.getTime();
      if (timeSinceLastSpin < 2000) {
        return NextResponse.json(
          { error: 'Please wait before spinning again' },
          { status: 429 }
        );
      }
    }

    // Perform the spin
    const spinResult = performSpin(betAmount);
    const newBalance = user.balance - betAmount + spinResult.payout;

    // Update user balance and stats
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: newBalance,
        totalSpins: { increment: 1 },
        totalWins: spinResult.win ? { increment: 1 } : undefined,
        totalLosses: !spinResult.win ? { increment: 1 } : undefined,
      }
    });

    // Record the spin
    await prisma.spin.create({
      data: {
        userId: user.id,
        betAmount,
        reel1: spinResult.reels[0],
        reel2: spinResult.reels[1],
        reel3: spinResult.reels[2],
        payout: spinResult.payout,
        isWin: spinResult.win,
        serverSeed: spinResult.serverSeed,
        seedHash: spinResult.seedHash,
      }
    });

    // Return result
    return NextResponse.json({
      reels: spinResult.reels,
      win: spinResult.win,
      payout: spinResult.payout,
      multiplier: spinResult.multiplier,
      balance: updatedUser.balance,
      serverSeed: spinResult.serverSeed,
      seedHash: spinResult.seedHash,
    });

  } catch (error) {
    console.error('Spin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 