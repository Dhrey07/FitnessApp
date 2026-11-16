'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { dayTotals, planDays, type MealPlanLike } from './MealPlanTable';
import { Button } from '@/components/ui/Button';
import { Document, DocumentRow } from '@/components/ui/Document';
import { EmptyState } from '@/components/ui/EmptyState';
import { Menu } from '@/components/ui/Menu';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Segmented } from '@/components/ui/Segmented';
import { StatRow, Stat } from '@/components/ui/Stat';
import { BRAND } from '@/lib/brand';

/**
 * The client's meal plan as a Document with a day switcher and totals.
 * The plan comes from the server; `state` covers the no-plan and
 * upgrade cases.
 */
export function MealPlanView({ plan, state, clientName }: { plan: MealPlanLike | null; state: 'ready' | 'none' | 'upgrade'; clientName: string }) {
  const [day, setDay] = useState(1);

  if (state === 'upgrade') {
    return (
      <EmptyState
        message="A personalised meal plan comes with the Signature and Private Coaching plans. Your coach builds it day by day around the foods you already eat."
        action={<Button href="/client/profile#membership" size="sm">See plans</Button>}
      />
    );
  }
  if (state === 'none' || !plan) {
    return <EmptyState message={`${BRAND.coachName} has not published your meal plan yet. You will get a notification when it is ready.`} />;
  }

  const days = planDays(plan);
  const items = plan.items.filter((i) => i.dayNumber === day);
  const totals = dayTotals(items);

  return (
    <div className="space-y-6">
      <StatRow>
        <Stat label="Calories a day" value={Math.round(plan.dailyCalorieTarget)} unit="kcal" />
        <Stat label="Protein" value={Math.round(plan.proteinTargetG)} unit="g" />
        <Stat label="Carbohydrate" value={Math.round(plan.carbsTargetG)} unit="g" />
        <Stat label="Fat" value={Math.round(plan.fatTargetG)} unit="g" />
      </StatRow>

      <div className="flex items-center justify-between gap-3">
        {days.length > 1 ? (
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hidden">
            <Segmented
              label="Plan day"
              size="sm"
              value={String(day)}
              onChange={(v) => setDay(Number(v))}
              options={days.map((d) => ({ value: String(d), label: `Day ${d}` }))}
              className="w-max md:w-max"
            />
          </div>
        ) : (
          <span />
        )}
        {plan.id && (
          <Menu items={[{ label: 'Download PDF', icon: <Download size={16} />, href: `/print/meal-plan/${plan.id}?autoprint=1` }]} label="Meal plan options" />
        )}
      </div>

      <Document
        title={`${plan.title} · Day ${day} of ${days.length}`}
        meta={<>{clientName}<br />{Math.round(plan.dailyCalorieTarget).toLocaleString()} kcal target</>}
        footer={<span className="tnum">P {Math.round(totals.proteinG)} g · C {Math.round(totals.carbsG)} g · F {Math.round(totals.fatG)} g</span>}
      >
        {items.length === 0 && <p className="text-sm text-[#6B7370] py-3">No meals entered for this day yet.</p>}
        {items.map((it, i) => (
          <DocumentRow key={it.id ?? i} label={it.mealLabel || it.mealType} value={`${Math.round(it.calories)} kcal`}>
            <span>
              {it.foodName}
              {(it.quantity || it.portion) && <span className="text-[#6B7370]"> · {it.quantity || it.portion}</span>}
            </span>
            {it.culturalAlternative && <span className="block text-xs text-[#6B7370] mt-0.5">Swap: {it.culturalAlternative}</span>}
          </DocumentRow>
        ))}
        {items.length > 0 && (
          <DocumentRow value={`${Math.round(totals.calories).toLocaleString()} kcal`}>
            <span className="font-semibold">Daily total</span>
          </DocumentRow>
        )}
      </Document>

      <ProgressBar label="Day total against target" value={Math.round(totals.calories)} max={Math.round(plan.dailyCalorieTarget)} unit="kcal" />
      {plan.notes && <p className="t-body-sm">{plan.notes}</p>}
    </div>
  );
}
