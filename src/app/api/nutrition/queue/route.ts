import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const queue = await prisma.foodSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            profile: true,
            subscriptions: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
        foodAnalysis: true,
        coachReview: true,
      },
    });

    return NextResponse.json({ queue });
  } catch (error) {
    console.error('Error fetching nutrition review queue:', error);
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
  }
}
