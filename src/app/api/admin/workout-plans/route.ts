import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCoach } from '@/lib/printAuth';

export async function GET(request: Request) {
  const coach = await isCoach();
  if (!coach) return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const plans = await prisma.workoutPlan.findMany({
      where: userId ? { userId } : undefined,
      include: {
        workouts: {
          include: {
            exercises: {
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ workoutPlans: plans });
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return NextResponse.json({ error: 'Failed to fetch workout plans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const coach = await isCoach();
  if (!coach) return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
  try {
    const body = await request.json();
    const { userId, title, goal, durationWeeks, workouts } = body;
    const coachId = coach.id;

    if (!userId || !title) {
      return NextResponse.json({ error: 'User ID and title are required' }, { status: 400 });
    }

    // One active programme per client, like meal plans: retire the previous one.
    await prisma.workoutPlan.updateMany({ where: { userId, active: true }, data: { active: false } });

    const plan = await prisma.workoutPlan.create({
      data: {
        userId,
        coachId,
        title,
        goal: goal || 'FAT_LOSS',
        durationWeeks: parseInt(String(durationWeeks || 4), 10),
        workouts: {
          create: (workouts || []).map((w: any, wIndex: number) => ({
            dayName: w.dayName || `Day ${wIndex + 1}`,
            title: w.title || 'Workout Session',
            notes: w.notes,
            orderIndex: wIndex + 1,
            exercises: {
              create: (w.exercises || []).map((ex: any, exIndex: number) => ({
                name: ex.name,
                sets: parseInt(String(ex.sets || 3), 10),
                reps: String(ex.reps || '10-12'),
                restSeconds: parseInt(String(ex.restSeconds || 60), 10),
                tempo: ex.tempo || '2-0-1',
                rpe: ex.rpe != null && ex.rpe !== '' ? parseFloat(String(ex.rpe)) : null,
                rir: ex.rir != null && ex.rir !== '' ? parseInt(String(ex.rir), 10) : null,
                progressionGuidance: ex.progressionGuidance || null,
                coachNotes: ex.coachNotes || ex.notes || null,
                orderIndex: exIndex + 1,
              })),
            },
          })),
        },
      },
      include: {
        workouts: {
          include: { exercises: true },
        },
      },
    });

    // Notify client
    await prisma.notification.create({
      data: {
        userId,
        title: 'New training programme assigned',
        message: `Your coach assigned a new programme: "${title}". It is under Train.`,
        link: '/client/training',
      },
    });

    return NextResponse.json({ success: true, workoutPlan: plan });
  } catch (error) {
    console.error('Error creating workout plan:', error);
    return NextResponse.json({ error: 'Failed to create workout plan' }, { status: 500 });
  }
}
