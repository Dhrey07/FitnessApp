import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hasFeatureEntitlement } from '@/lib/services/entitlements';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tier = user.subscriptions[0]?.planTier || 'FREE';
    const isEntitled = hasFeatureEntitlement(tier as any, 'personalised_nutrition');

    if (!isEntitled) {
      return NextResponse.json(
        {
          error: 'A personalised meal plan is included from the Signature plan (₦25,000/month).',
          requiresUpgrade: true,
        },
        { status: 403 }
      );
    }

    const mealPlan = await prisma.mealPlan.findFirst({
      where: { userId, active: true },
      include: {
        items: { orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }] },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ mealPlan });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return NextResponse.json({ error: 'Failed to fetch meal plan' }, { status: 500 });
  }
}
