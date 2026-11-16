import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveActingUser } from '@/lib/auth';
import { FoodAnalysisService } from '@/lib/services/aiService';
import { FitnessGoal } from '@/lib/services/nutritionEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submissionType, rawInput, imageUrl, mealType } = body;
    const acting = await resolveActingUser(body.userId);
    if (!acting.userId) {
      return NextResponse.json({ error: acting.status === 401 ? 'Not signed in' : 'Forbidden' }, { status: acting.status });
    }
    const userId = acting.userId;

    if (!rawInput) {
      return NextResponse.json({ error: 'Describe the meal or add a photo.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return NextResponse.json({ error: 'User profile not found. Complete onboarding first.' }, { status: 400 });
    }

    // Run AI Analysis
    const aiAnalysisResult = await FoodAnalysisService.analyzeFoodSubmission({
      submissionType: submissionType || 'NATURAL_LANGUAGE',
      rawInput,
      imageUrl,
      mealType: mealType || 'LUNCH',
      userGoal: user.profile.primaryGoal as FitnessGoal,
      userDailyCalorieTarget: user.profile.dailyCalories,
    });

    // Create DB records
    const submission = await prisma.foodSubmission.create({
      data: {
        userId: user.id,
        submissionType: submissionType || 'NATURAL_LANGUAGE',
        rawInput,
        imageUrl: imageUrl || null,
        mealType: mealType || 'LUNCH',
        status: 'AWAITING_COACH',
        // Meals queued offline carry the time they were eaten.
        ...(body.loggedAt && !Number.isNaN(Date.parse(body.loggedAt)) ? { createdAt: new Date(body.loggedAt) } : {}),
        foodAnalysis: {
          create: {
            estimatedCalories: aiAnalysisResult.estimatedCalories,
            estimatedProtein: aiAnalysisResult.estimatedProtein,
            estimatedCarbs: aiAnalysisResult.estimatedCarbs,
            estimatedFat: aiAnalysisResult.estimatedFat,
            portionAssessment: aiAnalysisResult.portionAssessment,
            mealQualityScore: aiAnalysisResult.mealQualityScore,
            goalAlignmentNotes: aiAnalysisResult.goalAlignmentNotes,
            potentialConcerns: aiAnalysisResult.potentialConcerns,
            suggestedAlternatives: aiAnalysisResult.suggestedAlternatives,
            aiRawOutput: JSON.stringify(aiAnalysisResult),
          },
        },
      },
      include: {
        foodAnalysis: true,
      },
    });

    return NextResponse.json({
      message: 'Meal logged. Estimate ready and awaiting coach review.',
      submission,
    });
  } catch (error) {
    console.error('Error submitting food:', error);
    return NextResponse.json({ error: 'Failed to process food submission' }, { status: 500 });
  }
}
