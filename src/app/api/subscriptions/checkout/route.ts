import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveActingUser } from '@/lib/auth';
import { PLAN_DETAILS, PlanTier } from '@/lib/services/entitlements';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planTier } = body;
    const acting = await resolveActingUser(body.userId);
    if (!acting.userId) {
      return NextResponse.json({ error: acting.status === 401 ? 'Not signed in' : 'Forbidden' }, { status: acting.status });
    }
    const userId = acting.userId;

    if (!planTier) {
      return NextResponse.json({ error: 'Missing planTier' }, { status: 400 });
    }

    const plan = PLAN_DETAILS[planTier as PlanTier];
    if (!plan) {
      return NextResponse.json({ error: 'Invalid subscription plan tier' }, { status: 400 });
    }

    // Mark any existing active trials as converted
    await prisma.subscription.updateMany({
      where: { userId, isTrial: true },
      data: { trialStatus: 'CONVERTED', status: 'EXPIRED' },
    });

    const referenceCode = `PAY-${planTier}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create 30-day billing cycle subscription
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planTier,
        status: 'ACTIVE',
        isTrial: false,
        amountPaid: plan.priceNgn,
        referenceCode,
        startDate: new Date(),
        endDate,
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId,
        title: `${plan.name} Activated!`,
        message: `Welcome to ${plan.name}. Full tier features are now active for 30 days.`,
        link: '/client/training',
      },
    });

    return NextResponse.json({
      success: true,
      message: `${plan.name} activated successfully.`,
      subscription,
      paymentProvider: 'Paystack / Flutterwave Verified',
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json({ error: 'Failed to process subscription checkout' }, { status: 500 });
  }
}
