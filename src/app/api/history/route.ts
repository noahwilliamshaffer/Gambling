import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isValidAddress } from '@/lib/utils';

type SpinHistoryItem = {
  id: string;
  betAmount: number;
  reel1: string;
  reel2: string;
  reel3: string;
  payout: number;
  isWin: boolean;
  createdAt: Date;
  seedHash: string;
  serverSeed: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    if (!address || !isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { address: address.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({
        spins: [],
        total: 0,
        page,
        limit,
        hasMore: false,
      });
    }

    // Get spin history with pagination
    const offset = (page - 1) * limit;
    const [spins, total] = await Promise.all([
      prisma.spin.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          betAmount: true,
          reel1: true,
          reel2: true,
          reel3: true,
          payout: true,
          isWin: true,
          createdAt: true,
          seedHash: true,
          serverSeed: true,
        }
      }),
      prisma.spin.count({
        where: { userId: user.id }
      })
    ]);

    const hasMore = offset + limit < total;

    return NextResponse.json({
      spins: spins.map((spin: SpinHistoryItem) => ({
        id: spin.id,
        betAmount: spin.betAmount,
        reels: [spin.reel1, spin.reel2, spin.reel3],
        payout: spin.payout,
        isWin: spin.isWin,
        createdAt: spin.createdAt,
        seedHash: spin.seedHash,
        serverSeed: spin.serverSeed,
      })),
      total,
      page,
      limit,
      hasMore,
    });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 