import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { prisma } from '@/lib/db';
import { requireCoach } from '@/lib/coach/data';
import { MealPlanBuilder, type BuilderRow } from './MealPlanBuilder';

export const metadata: Metadata = { title: 'Meal plan builder' };
export const dynamic = 'force-dynamic';

export default async function MealPlanBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireCoach();
  const { id } = await params;
  const client = await prisma.user.findUnique({ where: { id }, include: { profile: true } });
  if (!client || client.role !== 'CLIENT') notFound();
  const plan = await prisma.mealPlan.findFirst({ where: { userId: id, active: true }, orderBy: { createdAt: 'desc' }, include: { items: { orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }] } } });
  const p = client.profile;

  const dayCount = plan ? Math.max(plan.durationDays ?? 1, ...plan.items.map((i) => i.dayNumber), 1) : 7;
  const days: BuilderRow[][] = Array.from({ length: dayCount }, () => []);
  plan?.items.forEach((i) => {
    days[i.dayNumber - 1].push({
      mealLabel: i.mealLabel || 'Meal 1',
      foodName: i.foodName,
      quantity: i.quantity || i.portion || '',
      calories: String(Math.round(i.calories)),
      proteinG: String(Math.round(i.proteinG)),
      carbsG: String(Math.round(i.carbsG)),
      fatG: String(Math.round(i.fatG)),
      culturalAlternative: i.culturalAlternative || '',
    });
  });

  return (
    <AdminAppShell
      title={`Meal plan · ${client.firstName}`}
      subtitle="Day by day, with exact quantities. Totals check against the targets as you type."
      back={
        <Link href={`/admin/clients/${id}`} aria-label={`Back to ${client.firstName}`} className="focus-ring h-11 w-11 rounded-full flex items-center justify-center text-ink-secondary">
          <ChevronLeft size={22} />
        </Link>
      }
    >
      <MealPlanBuilder
        clientId={id}
        firstName={client.firstName}
        existingPlanId={plan?.id ?? null}
        initial={{
          title: plan?.title ?? `${client.firstName}'s ${String(p?.primaryGoal ?? 'nutrition').toLowerCase().replace(/_/g, ' ')} plan`,
          kcal: String(Math.round(plan?.dailyCalorieTarget ?? p?.dailyCalories ?? 0)),
          protein: String(Math.round(plan?.proteinTargetG ?? p?.targetProteinG ?? 0)),
          carbs: String(Math.round(plan?.carbsTargetG ?? p?.targetCarbsG ?? 0)),
          fat: String(Math.round(plan?.fatTargetG ?? p?.targetFatG ?? 0)),
          guidelines: plan?.guidelinesIncluded !== false,
          notes: plan?.notes ?? '',
          days,
        }}
      />
    </AdminAppShell>
  );
}
