import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCoach } from '@/lib/printAuth';

export async function GET(request: Request) {
  const coach = await isCoach();
  if (!coach) return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const tier = searchParams.get('tier') || '';
  const statusFilter = searchParams.get('status') || '';

  try {
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        OR: search
          ? [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
            ]
          : undefined,
        subscriptions: tier
          ? {
              some: {
                planTier: tier,
                status: 'ACTIVE',
              },
            }
          : undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
        subscriptions: { orderBy: { createdAt: 'desc' } },
        foodSubmissions: {
          orderBy: { createdAt: 'desc' },
          include: { foodAnalysis: true, coachReview: true },
        },
        weeklyCheckIns: { orderBy: { createdAt: 'desc' } },
        workoutLogs: {
          orderBy: { completedAt: 'desc' },
          include: { workout: true },
        },
        workoutPlansReceived: {
          include: { workouts: { include: { exercises: true } } },
        },
        mealPlansReceived: {
          include: { items: true },
        },
        progressRecords: {
          orderBy: { recordDate: 'asc' },
        },
      },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error fetching admin clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}
