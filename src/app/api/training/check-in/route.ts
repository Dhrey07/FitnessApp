import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProgressAnalysisService } from '@/lib/services/aiService';
import { FitnessGoal } from '@/lib/services/nutritionEngine';
import { getSessionUser, resolveActingUser } from '@/lib/auth';

/** A client's recent check-ins (own only); coaches may read any client's. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (me.id !== userId && me.role === 'CLIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { userId },
    orderBy: { checkInDate: 'desc' },
    take: 8,
  });
  return NextResponse.json({ checkIns });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId: requestedUserId,
      currentWeightKg,
      waistCm,
      energyLevel,
      sleepQuality,
      workoutAdherence,
      nutritionAdherence,
      difficultyLevel,
      challenges,
      generalFeedback,
      photoUrl,
      averageDailySteps,
      trainingSessionsCompleted,
      trainingSessionsPlanned,
      hungerLevel,
      stressLevel,
      wins,
      helpNeeded,
    } = body;

    const acting = await resolveActingUser(requestedUserId);
    if (!acting.userId) {
      return NextResponse.json({ error: acting.status === 401 ? 'Not signed in' : 'Forbidden' }, { status: acting.status });
    }
    const userId = acting.userId;
    if (!currentWeightKg || !waistCm) {
      return NextResponse.json({ error: 'Weight and waist are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        weeklyCheckIns: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!user || !user.profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const previousCheckIn = user.weeklyCheckIns[0];
    const previousWeight = previousCheckIn ? previousCheckIn.currentWeightKg : null;

    // Training consistency: derive from sessions when both are supplied, otherwise use the % given.
    const completed = trainingSessionsCompleted != null && trainingSessionsCompleted !== '' ? Number(trainingSessionsCompleted) : null;
    const planned = trainingSessionsPlanned != null && trainingSessionsPlanned !== '' ? Number(trainingSessionsPlanned) : user.profile.preferredWorkoutDays || null;
    const derivedWorkoutAdherence =
      completed != null && planned ? Math.max(0, Math.min(100, Math.round((completed / planned) * 100))) : Number(workoutAdherence) || 80;
    const clamp15 = (v: unknown) => (v == null || v === '' ? null : Math.max(1, Math.min(5, Math.round(Number(v)))));

    // AI Check-in Analysis
    const aiResult = ProgressAnalysisService.analyzeCheckIn(
      Number(currentWeightKg),
      previousWeight,
      derivedWorkoutAdherence,
      Number(nutritionAdherence) || 80,
      user.profile.primaryGoal as FitnessGoal
    );

    // Create Check-In
    const checkIn = await prisma.weeklyCheckIn.create({
      data: {
        userId,
        currentWeightKg: Number(currentWeightKg),
        waistCm: Number(waistCm),
        energyLevel: Number(energyLevel) || 4,
        sleepQuality: Number(sleepQuality) || 4,
        workoutAdherence: derivedWorkoutAdherence,
        nutritionAdherence: Number(nutritionAdherence) || 80,
        difficultyLevel: difficultyLevel || 'Moderate',
        averageDailySteps: averageDailySteps != null && averageDailySteps !== '' ? Math.round(Number(averageDailySteps)) : null,
        trainingSessionsCompleted: completed,
        trainingSessionsPlanned: planned,
        hungerLevel: clamp15(hungerLevel),
        stressLevel: clamp15(stressLevel),
        challenges: challenges || null,
        wins: wins || null,
        helpNeeded: helpNeeded || null,
        generalFeedback: generalFeedback || null,
        photoUrl: photoUrl || null,
        status: 'PENDING_REVIEW',
        aiTrendsSummary: aiResult.trendsSummary,
      },
    });

    // Keep the profile's current measurements in step with the latest check-in
    await prisma.profile.update({
      where: { userId },
      data: {
        weightKg: Number(currentWeightKg),
        waistCm: Number(waistCm),
        ...(averageDailySteps != null && averageDailySteps !== '' ? { averageDailySteps: Math.round(Number(averageDailySteps)) } : {}),
      },
    });

    // Record in ProgressRecord
    await prisma.progressRecord.create({
      data: {
        userId,
        weightKg: Number(currentWeightKg),
        waistCm: Number(waistCm),
        notes: `Weekly Check-In: ${aiResult.adherenceRating}`,
      },
    });

    return NextResponse.json({
      message: 'Weekly check-in submitted successfully. Your coach will review your progress!',
      checkIn,
      aiResult,
    });
  } catch (error) {
    console.error('Error submitting check-in:', error);
    return NextResponse.json({ error: 'Failed to submit check-in' }, { status: 500 });
  }
}
