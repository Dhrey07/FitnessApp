import React from 'react';

export interface MealPlanItemLike {
  id?: string;
  dayNumber: number;
  mealLabel?: string | null;
  mealType?: string;
  foodName: string;
  quantity?: string | null;
  portion?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  culturalAlternative?: string | null;
  notes?: string | null;
}

export interface MealPlanLike {
  title: string;
  dailyCalorieTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
  durationDays?: number;
  notes?: string | null;
  items: MealPlanItemLike[];
}

export function dayTotals(items: MealPlanItemLike[]) {
  return items.reduce(
    (t, i) => ({ calories: t.calories + (i.calories || 0), proteinG: t.proteinG + (i.proteinG || 0), carbsG: t.carbsG + (i.carbsG || 0), fatG: t.fatG + (i.fatG || 0) }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
}

export function planDays(plan: MealPlanLike): number[] {
  const fromItems = Array.from(new Set(plan.items.map((i) => i.dayNumber))).sort((a, b) => a - b);
  const n = Math.max(plan.durationDays || 0, fromItems[fromItems.length - 1] || 0, 1);
  return Array.from({ length: n }, (_, i) => i + 1);
}

/** One day of a meal plan in the brief's layout: meal, food, exact quantity, kcal, P/C/F, and daily totals vs target. Used on screen and in print. */
export function MealPlanDayTable({ plan, day, compact = false }: { plan: MealPlanLike; day: number; compact?: boolean }) {
  const items = plan.items.filter((i) => i.dayNumber === day);
  const totals = dayTotals(items);
  const pct = plan.dailyCalorieTarget ? Math.round((totals.calories / plan.dailyCalorieTarget) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className={`w-full ${compact ? 'text-xs' : 'text-sm'}`}>
          <thead>
            <tr className="label-xs text-ink-muted text-left">
              <th className="py-2 pr-3 font-bold">Meal</th>
              <th className="py-2 pr-3 font-bold">Food</th>
              <th className="py-2 pr-3 font-bold">Quantity</th>
              <th className="py-2 pr-3 font-bold text-right">kcal</th>
              <th className="py-2 pr-3 font-bold text-right">P</th>
              <th className="py-2 pr-3 font-bold text-right">C</th>
              <th className="py-2 font-bold text-right">F</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={7} className="py-4 text-ink-muted">No meals entered for this day yet.</td></tr>
            )}
            {items.map((it, idx) => (
              <tr key={it.id || idx} className="border-t border-line align-top">
                <td className="py-2.5 pr-3 font-semibold text-ink whitespace-nowrap">{it.mealLabel || it.mealType}</td>
                <td className="py-2.5 pr-3 text-ink-secondary">
                  {it.foodName}
                  {it.culturalAlternative && <span className="block text-xs text-ink-muted">Swap: {it.culturalAlternative}</span>}
                  {it.notes && <span className="block text-xs text-ink-muted">{it.notes}</span>}
                </td>
                <td className="py-2.5 pr-3 text-ink-secondary">{it.quantity || it.portion}</td>
                <td className="py-2.5 pr-3 text-right font-semibold text-ink">{Math.round(it.calories)}</td>
                <td className="py-2.5 pr-3 text-right text-ink-secondary">{Math.round(it.proteinG)} g</td>
                <td className="py-2.5 pr-3 text-right text-ink-secondary">{Math.round(it.carbsG)} g</td>
                <td className="py-2.5 text-right text-ink-secondary">{Math.round(it.fatG)} g</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--accent)] font-semibold text-ink">
              <td className="pt-2.5" colSpan={3}>Daily total · target {Math.round(plan.dailyCalorieTarget).toLocaleString()} kcal</td>
              <td className="pt-2.5 text-right">{Math.round(totals.calories).toLocaleString()}</td>
              <td className="pt-2.5 text-right">{Math.round(totals.proteinG)} g</td>
              <td className="pt-2.5 text-right">{Math.round(totals.carbsG)} g</td>
              <td className="pt-2.5 text-right">{Math.round(totals.fatG)} g</td>
            </tr>
            <tr className="text-xs text-ink-muted">
              <td colSpan={3} className="pt-1">Targets: {plan.proteinTargetG} g protein · {plan.carbsTargetG} g carbohydrate · {plan.fatTargetG} g fat</td>
              <td colSpan={4} className="pt-1 text-right">{pct}% of calorie target</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="h-1.5 rounded-full bg-paper border border-line overflow-hidden" aria-hidden="true">
        <div className={`h-full ${pct > 105 ? 'bg-status-pending' : 'bg-brand'}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}
