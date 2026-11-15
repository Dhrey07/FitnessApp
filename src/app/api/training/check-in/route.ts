import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProgressAnalysisService } from '@/lib/services/aiService';
import { FitnessGoal } from '@/lib/services/nutritionEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
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
    } = body;

    if (!userId || !currentWeightKg || !waistCm) {
      return NextResponse.json({ error: 'Missing required fields (userId, currentWeightKg, waistCm)' }, { status: 400 });
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

    // AI Check-in Analysis
    const aiResult = ProgressAnalysisService.analyzeCheckIn(
      Number(currentWeightKg),
      previousWeight,
      Number(workoutAdherence) || 80,
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
        workoutAdherence: Number(workoutAdherence) || 80,
        nutritionAdherence: Number(nutritionAdherence) || 80,
        difficultyLevel: difficultyLevel || 'Moderate',
        challenges: challenges || null,
        generalFeedback: generalFeedback || null,
        photoUrl: photoUrl || null,
        status: 'PENDING_REVIEW',
        aiTrendsSummary: aiResult.trendsSummary,
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
