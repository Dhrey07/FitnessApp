import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCoach } from '@/lib/printAuth';

export async function GET() {
  const coach = await isCoach();
  if (!coach) return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
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
  const coach = await isCoach();
  if (!coach) return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
  try {
    const body = await request.json();
    const { checkInId, coachFeedback, adjustedCalorieTarget, adjustedNotes } = body;

    if (!checkInId) {
      return NextResponse.json({ error: 'Check-in ID is required' }, { status: 400 });
    }
    if (!String(coachFeedback ?? '').trim()) {
      return NextResponse.json({ error: 'Write some feedback before sending.' }, { status: 400 });
    }

    const updatedCheckIn = await prisma.weeklyCheckIn.update({
      where: { id: checkInId },
      data: {
        status: 'REVIEWED',
        coachFeedback: coachFeedback || null,
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
        title: 'Your weekly check-in has been reviewed',
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
