import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { canViewClientDocument } from '@/lib/printAuth';
import { BRAND } from '@/lib/brand';
import { PrintSheet, PrintCover, PrintClosing } from '@/components/print/PrintSheet';
import { PrintToolbar } from '@/components/print/PrintChrome';
import { MealPlanDayTable, planDays } from '@/components/nutrition/MealPlanTable';
import { SimpleMarkdown } from '@/components/brand/SimpleMarkdown';

export const dynamic = 'force-dynamic';

const goalLabel = (g?: string | null) => (g || 'FAT_LOSS').toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export default async function MealPlanPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await prisma.mealPlan.findUnique({
    where: { id },
    include: { items: { orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }] }, user: { include: { profile: true } } },
  });
  if (!plan) notFound();
  const { ok } = await canViewClientDocument(plan.userId);
  if (!ok) notFound();

  const client = `${plan.user.firstName} ${plan.user.lastName}`;
  const p = plan.user.profile;
  const days = planDays(plan);
  const guidelines = plan.guidelinesIncluded ? await prisma.nutritionGuideline.findMany({ where: { active: true }, orderBy: { orderIndex: 'asc' } }) : [];
  const chunks: typeof guidelines[] = [];
  for (let i = 0; i < guidelines.length; i += 2) chunks.push(guidelines.slice(i, i + 2));

  const weeks = p?.programmeDurationWeeks ? `${p.programmeDurationWeeks} weeks` : `${days.length} days`;

  return (
    <>
      <PrintToolbar title={`${client} · ${plan.title}`} />
      <PrintCover
        kicker="Personalised meal plan"
        title={client}
        subtitle={plan.title}
        footerLeft={client}
        rows={[
          ['Primary goal', goalLabel(p?.primaryGoal)],
          ['Starting weight', p?.startingWeightKg ? `${p.startingWeightKg} kg` : p?.weightKg ? `${p.weightKg} kg` : '—'],
          ['Target weight', p?.targetWeightKg ? `${p.targetWeightKg} kg` : 'To be confirmed with your coach'],
          ['Programme duration', weeks],
          ['Daily calorie target', `${Math.round(plan.dailyCalorieTarget).toLocaleString()} kcal`],
          ['Protein / carbohydrate / fat', `${plan.proteinTargetG} g / ${plan.carbsTargetG} g / ${plan.fatTargetG} g`],
          ['Coach', BRAND.coachName],
          ['Prepared', new Date(plan.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
        ]}
      />

      {days.map((d) => (
        <PrintSheet key={d} footerLeft={client} docTitle={`Day ${d} of ${days.length}`}>
          <h2 className="text-[16pt] font-bold mb-1">Day {d}</h2>
          <p className="text-[9.5pt] text-[var(--brand-stone-500)] mb-4">Quantities are cooked for grains, beans and tubers and raw for meat, fish and eggs unless stated. Daily target {Math.round(plan.dailyCalorieTarget).toLocaleString()} kcal · {plan.proteinTargetG} g protein · {plan.carbsTargetG} g carbohydrate · {plan.fatTargetG} g fat.</p>
          <MealPlanDayTable plan={plan} day={d} compact />
          {plan.notes && <p className="mt-4 text-[9.5pt] text-[var(--brand-stone-500)]">{plan.notes}</p>}
        </PrintSheet>
      ))}

      {chunks.map((pair, i) => (
        <PrintSheet key={i} footerLeft={client} docTitle="Nutrition guidelines">
          {i === 0 && <h2 className="text-[16pt] font-bold mb-4">Nutrition guidelines</h2>}
          <div className="space-y-6">
            {pair.map((g) => (
              <article key={g.id} className="avoid-break">
                <h3 className="text-[12.5pt] font-bold mb-2">{g.orderIndex}. {g.title}</h3>
                <SimpleMarkdown source={g.body} className="!text-[10pt] !space-y-2.5" />
              </article>
            ))}
          </div>
        </PrintSheet>
      ))}

      <PrintClosing clientName={client} />
    </>
  );
}
