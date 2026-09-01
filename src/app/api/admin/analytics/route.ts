import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });

    const allSubscriptions = await prisma.subscription.findMany();

    let freeCount = 0;
    let silverCount = 0;
    let goldCount = 0;
    let diamondCount = 0;
    let trialUsers = 0;
    let paidClients = 0;
    let expiredSubscriptions = 0;
    let totalMRR = 0;

    allSubscriptions.forEach((sub) => {
      if (sub.isTrial && sub.status === 'ACTIVE') {
        trialUsers++;
      } else if (sub.status === 'ACTIVE') {
        if (sub.planTier === 'FREE') {
          freeCount++;
        } else {
          paidClients++;
          if (sub.planTier === 'SILVER') {
            silverCount++;
            totalMRR += 15000;
          } else if (sub.planTier === 'GOLD') {
            goldCount++;
            totalMRR += 25000;
          } else if (sub.planTier === 'DIAMOND') {
            diamondCount++;
            totalMRR += 40000;
          }
        }
      } else if (sub.status === 'EXPIRED') {
        expiredSubscriptions++;
      }
    });

    const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
    const newSignupsThisWeek = await prisma.user.count({
      where: { role: 'CLIENT', createdAt: { gte: oneWeekAgo } },
    });

    const pendingCheckInsCount = await prisma.weeklyCheckIn.count({
      where: { status: 'PENDING_REVIEW' },
    });

    const pendingFoodReviewsCount = await prisma.foodSubmission.count({
      where: { status: 'AWAITING_COACH' },
    });

    const totalFoodSubmissions = await prisma.foodSubmission.count();
    const approvedFoodSubmissions = await prisma.foodSubmission.count({
      where: { status: 'APPROVED' },
    });

    const aiApprovalRate = totalFoodSubmissions > 0 ? Math.round((approvedFoodSubmissions / totalFoodSubmissions) * 100) : 100;

    return NextResponse.json({
      metrics: {
        totalClients,
        activeClients: paidClients + trialUsers + freeCount,
        trialUsers,
        paidClients,
        expiredSubscriptions,
        newSignupsThisWeek,
        checkInsDue: pendingCheckInsCount,
        pendingFoodReviewsCount,
        monthlyRecurringRevenueNgn: totalMRR,
        tierDistribution: {
          FREE: freeCount,
          SILVER: silverCount,
          GOLD: goldCount,
          DIAMOND: diamondCount,
          TRIAL: trialUsers,
        },
        aiStats: {
          totalFoodSubmissions,
          approvedFoodSubmissions,
          aiApprovalRatePercent: aiApprovalRate,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
