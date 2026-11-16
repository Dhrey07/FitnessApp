import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCoach } from '@/lib/printAuth';

export async function GET() {
  if (!(await isCoach())) {
    return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
  }
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
