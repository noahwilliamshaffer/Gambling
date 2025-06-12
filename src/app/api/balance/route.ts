import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isValidAddress } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address || !isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { address: address.toLowerCase() }
    });

    if (!user) {
      // Return default balance for new users
      return NextResponse.json({
        address: address.toLowerCase(),
        balance: 1.0,
        totalSpins: 0,
        totalWins: 0,
        totalLosses: 0,
        winRate: 0,
        totalWagered: 0,
        totalPayout: 0,
      });
    }

    // Calculate additional stats
    const totalWagered = await prisma.spin.aggregate({
      where: { userId: user.id },
      _sum: { betAmount: true }
    });

    const totalPayout = await prisma.spin.aggregate({
      where: { userId: user.id },
      _sum: { payout: true }
    });

    const winRate = user.totalSpins > 0 ? (user.totalWins / user.totalSpins) * 100 : 0;

    return NextResponse.json({
      address: user.address,
      balance: user.balance,
      totalSpins: user.totalSpins,
      totalWins: user.totalWins,
      totalLosses: user.totalLosses,
      winRate: Math.round(winRate * 100) / 100,
      totalWagered: totalWagered._sum.betAmount || 0,
      totalPayout: totalPayout._sum.payout || 0,
    });

  } catch (error) {
    console.error('Balance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 