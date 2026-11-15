import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hasFeatureEntitlement } from '@/lib/services/entitlements';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tier = user.subscriptions[0]?.planTier || 'FREE';
    const isEntitled = hasFeatureEntitlement(tier as any, 'personalised_training');

    if (!isEntitled) {
      return NextResponse.json(
        {
          error: 'A personalised training programme is included from the Signature plan (₦25,000/month).',
          requiresUpgrade: true,
        },
        { status: 403 }
      );
    }

    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: { userId, active: true },
      include: {
        workouts: {
          orderBy: { orderIndex: 'asc' },
          include: {
            exercises: { orderBy: { orderIndex: 'asc' } },
            workoutLogs: { where: { userId }, orderBy: { completedAt: 'desc' }, take: 5 },
          },
        },
      },
    });

    return NextResponse.json({ workoutPlan });
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    return NextResponse.json({ error: 'Failed to fetch workout plan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, workoutId, setsCompleted, repsCompleted, weightUsedKg, notes } = body;

    if (!userId || !workoutId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const workoutLog = await prisma.workoutLog.create({
      data: {
        userId,
        workoutId,
        setsCompleted: Number(setsCompleted) || 3,
        repsCompleted: String(repsCompleted || '10'),
        weightUsedKg: Number(weightUsedKg) || 0,
        notes: notes || null,
        adherenceScore: 100,
      },
    });

    return NextResponse.json({ message: 'Workout logged successfully!', workoutLog });
  } catch (error) {
    console.error('Error logging workout:', error);
    return NextResponse.json({ error: 'Failed to log workout' }, { status: 500 });
  }
}
