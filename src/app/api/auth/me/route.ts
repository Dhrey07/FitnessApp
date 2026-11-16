import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { calculateTrialInfo, hasTrainingAccess } from '@/lib/services/entitlements';

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!email) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const activeSubscription = user.subscriptions[0] || {
      planTier: 'FREE',
      status: 'ACTIVE',
      isTrial: false,
    };

    const trialInfo = calculateTrialInfo(activeSubscription);
    const trainingUnlocked = hasTrainingAccess(activeSubscription);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        profile: user.profile,
        subscription: activeSubscription,
        trialInfo,
        trainingUnlocked,
      },
    });
  } catch (error) {
    console.error('Error fetching me:', error);
    return NextResponse.json({ error: 'Failed to fetch user context' }, { status: 500 });
  }
}
