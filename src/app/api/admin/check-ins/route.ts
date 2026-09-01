import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const checkIns = await prisma.weeklyCheckIn.findMany({
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
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ checkIns });
  } catch (error) {
    console.error('Error fetching admin check-ins:', error);
    return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkInId, coachFeedback, adjustedCalorieTarget, adjustedNotes } = body;

    if (!checkInId) {
      return NextResponse.json({ error: 'Check-in ID is required' }, { status: 400 });
    }

    const updatedCheckIn = await prisma.weeklyCheckIn.update({
      where: { id: checkInId },
      data: {
        status: 'REVIEWED',
        coachFeedback: coachFeedback || 'Great work this week! Targets updated.',
        reviewedAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    // If coach adjusted daily calories, update profile
    if (adjustedCalorieTarget && updatedCheckIn.user) {
      await prisma.profile.updateMany({
        where: { userId: updatedCheckIn.userId },
        data: { dailyCalories: parseFloat(String(adjustedCalorieTarget)) },
      });
    }

    // Send notification to client
    await prisma.notification.create({
      data: {
        userId: updatedCheckIn.userId,
        title: 'Weekly Check-In Reviewed by Oga Eric',
        message: `Your coach reviewed your weekly progress and left personalized feedback.`,
        link: '/client/check-in',
      },
    });

    return NextResponse.json({ success: true, checkIn: updatedCheckIn });
  } catch (error) {
    console.error('Error updating check-in review:', error);
    return NextResponse.json({ error: 'Failed to submit check-in review' }, { status: 500 });
  }
}
