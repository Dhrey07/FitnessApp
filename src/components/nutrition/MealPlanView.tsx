'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MealPlanDayTable, planDays, type MealPlanLike } from './MealPlanTable';

/** Client-side "My meal plan": loads the active plan and shows it day by day. */
export function MealPlanView({ userId }: { userId: string }) {
  const [plan, setPlan] = useState<MealPlanLike | null>(null);
  const [day, setDay] = useState(1);
  const [state, setState] = useState<'loading' | 'ready' | 'upgrade' | 'none' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/training/meal-plan?userId=${userId}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 403 && data.requiresUpgrade) return setState('upgrade');
        if (!res.ok) return setState('error');
        if (!data.mealPlan) return setState('none');
        setPlan(data.mealPlan);
        setState('ready');
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  if (state === 'loading') return <div className="surface p-6 text-sm text-ink-muted">Loading your meal plan…</div>;
  if (state === 'upgrade') {
    return (
      <div className="surface p-6 space-y-3">
        <p className="font-semibold text-ink">A personalised meal plan is part of the Signature and Private Coaching plans.</p>
        <p className="text-sm text-ink-secondary">Your nutrition log stays free. When you upgrade, your coach builds a day-by-day plan with exact quantities around the foods you already eat.</p>
        <Link href="/client/profile#membership" className="btn-brand text-sm inline-flex">See plans</Link>
      </div>
    );
  }
  if (state === 'none') return <div className="surface p-6 text-sm text-ink-muted">Your coach has not published a meal plan yet. You will get a notification when it is ready.</div>;
  if (state === 'error' || !plan) return <div className="surface p-6 text-sm text-status-rejected">Could not load your meal plan. Please try again.</div>;

  const days = planDays(plan);

  return (
    <div className="space-y-5 w-full">
      <div className="surface p-6 grid grid-cols-2 sm:grid-cols-5 gap-4 items-end">
        <div className="col-span-2 sm:col-span-1">
          <p className="label-xs text-brand">My meal plan</p>
          <h3 className="font-display font-bold text-ink text-base mt-0.5">{plan.title}</h3>
          <p className="text-xs text-ink-muted mt-0.5">{days.length} day{days.length === 1 ? '' : 's'}</p>
        </div>
        {[
          ['Calories', `${Math.round(plan.dailyCalorieTarget).toLocaleString()} kcal`],
          ['Protein', `${plan.proteinTargetG} g`],
          ['Carbohydrate', `${plan.carbsTargetG} g`],
          ['Fat', `${plan.fatTargetG} g`],
        ].map(([k, v]) => (
          <div key={k} className="p-3 rounded-xl bg-paper border border-line">
            <p className="text-xs text-ink-muted">{k}</p>
            <p className="font-semibold text-ink">{v}</p>
          </div>
        ))}
      </div>

      <div className="surface p-6 space-y-4">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Plan days">
          {days.map((d) => (
            <button
              key={d}
              role="tab"
              aria-selected={day === d}
              onClick={() => setDay(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${day === d ? 'bg-brand-strong text-brand-on-strong border-transparent' : 'bg-surface text-ink-secondary border-line hover:border-line-active'}`}
            >
              Day {d}
            </button>
          ))}
        </div>
        <MealPlanDayTable plan={plan} day={day} />
        {plan.notes && <p className="text-xs text-ink-muted border-t border-line pt-3">{plan.notes}</p>}
      </div>
    </div>
  );
}
