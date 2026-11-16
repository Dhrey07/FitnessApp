import type { Metadata } from 'next';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { entitlementsOf, getMealPlan, getMeals, requireClient, shellUserOf } from '@/lib/client/data';
import { FoodScreen } from './FoodScreen';

export const metadata: Metadata = { title: 'Food' };
export const dynamic = 'force-dynamic';

export default async function FoodPage() {
  const me = await requireClient();
  const access = entitlementsOf(me);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86400000);
  const tomorrow = new Date(today.getTime() + 86400000);

  const [meals, mealPlan] = await Promise.all([getMeals(me.id, yesterday, tomorrow), access.mealPlan ? getMealPlan(me.id) : Promise.resolve(null)]);
  const todayIso = today.toISOString();

  return (
    <ClientAppShell user={shellUserOf(me)} title="Food">
      <FoodScreen
        todayStart={todayIso}
        meals={meals}
        targets={{
          kcal: Math.round(me.profile?.dailyCalories ?? 0),
          protein: Math.round(me.profile?.targetProteinG ?? 0),
          carbs: Math.round(me.profile?.targetCarbsG ?? 0),
          fat: Math.round(me.profile?.targetFatG ?? 0),
        }}
        mealPlan={mealPlan}
        mealPlanState={!access.mealPlan ? 'upgrade' : mealPlan ? 'ready' : 'none'}
        clientName={`${me.firstName} ${me.lastName}`}
      />
    </ClientAppShell>
  );
}
