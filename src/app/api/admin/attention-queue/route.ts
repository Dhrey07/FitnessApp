import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // 1. Pending meal submissions
    const pendingFoodSubmissions = await prisma.foodSubmission.findMany({
      where: { status: 'AWAITING_COACH' },
      include: {
        user: { include: { profile: true } },
        foodAnalysis: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Pending Weekly Check-Ins
    const pendingCheckIns = await prisma.weeklyCheckIn.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Clients with low adherence or missed activity
    const clientsWithLowAdherence = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        weeklyCheckIns: {
          some: {
            OR: [{ workoutAdherence: { lt: 70 } }, { nutritionAdherence: { lt: 70 } }],
          },
        },
      },
      include: {
        profile: true,
        subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
        weeklyCheckIns: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    return NextResponse.json({
      attentionSummary: {
        pendingFoodReviewsCount: pendingFoodSubmissions.length,
        pendingCheckInsCount: pendingCheckIns.length,
        lowAdherenceClientsCount: clientsWithLowAdherence.length,
        totalItemsNeedingReview:
          pendingFoodSubmissions.length + pendingCheckIns.length + clientsWithLowAdherence.length,
      },
      pendingFoodSubmissions,
      pendingCheckIns,
      clientsWithLowAdherence,
    });
  } catch (error) {
    console.error('Error fetching attention queue:', error);
    return NextResponse.json({ error: 'Failed to fetch attention queue' }, { status: 500 });
  }
}
