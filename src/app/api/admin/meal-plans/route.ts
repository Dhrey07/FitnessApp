import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

const LABEL_TO_TYPE: Record<string, string> = { 'Meal 1': 'BREAKFAST', 'Meal 2': 'LUNCH', 'Meal 3': 'DINNER', Snack: 'SNACK' };

async function requireCoach() {
  const me = await getSessionUser();
  if (!me || (me.role !== 'COACH' && me.role !== 'ADMIN')) return null;
  return me;
}

/** Coach: fetch a client's active meal plan (items ordered by day, then position). */
export async function GET(request: Request) {
  const me = await requireCoach();
  if (!me) return NextResponse.json({ error: 'Coach access required' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  const mealPlan = await prisma.mealPlan.findFirst({
    where: { userId, active: true },
    include: { items: { orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }] } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ mealPlan });
}

/** Coach: create a day-by-day meal plan and make it the client's active plan. */
export async function POST(request: Request) {
  const me = await requireCoach();
  if (!me) return NextResponse.json({ error: 'Coach access required' }, { status: 403 });

  try {
    const body = await request.json();
    const { userId, title, dailyCalorieTarget, proteinTargetG, carbsTargetG, fatTargetG, durationDays, guidelinesIncluded, notes, days } = body;
    if (!userId || !title || !Array.isArray(days) || days.length === 0) {
      return NextResponse.json({ error: 'userId, title and at least one day are required' }, { status: 400 });
    }

    const num = (v: unknown, d = 0) => (v == null || v === '' || Number.isNaN(Number(v)) ? d : Number(v));

    const items = days.flatMap((d: any, dIdx: number) =>
      (d.items || [])
        .filter((it: any) => it.foodName && String(it.foodName).trim())
        .map((it: any, iIdx: number) => ({
          dayNumber: num(d.dayNumber, dIdx + 1),
          orderIndex: iIdx + 1,
          mealLabel: it.mealLabel || 'Meal 1',
          mealType: it.mealType || LABEL_TO_TYPE[it.mealLabel] || 'LUNCH',
          foodName: String(it.foodName).trim(),
          quantity: it.quantity ? String(it.quantity).trim() : null,
          portion: it.quantity ? String(it.quantity).trim() : String(it.portion || ''),
          calories: num(it.calories),
          proteinG: num(it.proteinG),
          carbsG: num(it.carbsG),
          fatG: num(it.fatG),
          culturalAlternative: it.culturalAlternative || null,
          notes: it.notes || null,
        }))
    );
    if (items.length === 0) return NextResponse.json({ error: 'Add at least one food item' }, { status: 400 });

    const [, mealPlan] = await prisma.$transaction([
      prisma.mealPlan.updateMany({ where: { userId, active: true }, data: { active: false } }),
      prisma.mealPlan.create({
        data: {
          userId,
          coachId: me.id,
          title: String(title).trim(),
          dailyCalorieTarget: num(dailyCalorieTarget),
          proteinTargetG: num(proteinTargetG),
          carbsTargetG: num(carbsTargetG),
          fatTargetG: num(fatTargetG),
          durationDays: Math.max(1, Math.min(31, num(durationDays, days.length))),
          guidelinesIncluded: guidelinesIncluded !== false,
          notes: notes || null,
          active: true,
          items: { create: items },
        },
        include: { items: { orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }] } },
      }),
    ]);

    await prisma.notification.create({
      data: {
        userId,
        title: 'Your meal plan is ready',
        message: `Your coach has published "${mealPlan.title}". Open Nutrition to see each day.`,
        link: '/client/nutrition',
      },
    });

    await prisma.auditLog.create({
      data: { actorId: me.id, action: 'CREATE_MEAL_PLAN', entityType: 'MealPlan', entityId: mealPlan.id, details: `${items.length} items over ${mealPlan.durationDays} days` },
    });

    return NextResponse.json({ success: true, mealPlan });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    return NextResponse.json({ error: 'Failed to create meal plan' }, { status: 500 });
  }
}
