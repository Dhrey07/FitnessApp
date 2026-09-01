import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { calculateTrialInfo, hasFitnessPoliceAccess } from '@/lib/services/entitlements';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookieStore = await cookies();
  const sessionEmail = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const email = searchParams.get('email') || sessionEmail || 'chidi@example.com';

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
    const fitnessPoliceUnlocked = hasFitnessPoliceAccess(activeSubscription);

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
        fitnessPoliceUnlocked,
      },
    });
  } catch (error) {
    console.error('Error fetching me:', error);
    return NextResponse.json({ error: 'Failed to fetch user context' }, { status: 500 });
  }
}
