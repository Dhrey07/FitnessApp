import type { Metadata } from 'next';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { Avatar } from '@/components/ui/Avatar';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Section } from '@/components/ui/Section';
import { Stat, StatRow } from '@/components/ui/Stat';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { entitlementsOf, requireClient, shellUserOf, subscriptionOf } from '@/lib/client/data';
import { PlanSwitcher } from './PlanSwitcher';
import { SignOutButton } from './SignOutButton';

export const metadata: Metadata = { title: 'Profile and billing' };
export const dynamic = 'force-dynamic';

const GOAL: Record<string, string> = {
  FAT_LOSS: 'Lose body fat',
  BODY_RECOMPOSITION: 'Recompose',
  MUSCLE_GAIN: 'Build muscle',
  STRENGTH_PERFORMANCE: 'Get stronger',
  GENERAL_HEALTH: 'General health',
  HEALTHY_WEIGHT_GAIN: 'Gain weight healthily',
};
const ACTIVITY: Record<string, string> = {
  SEDENTARY: 'Mostly seated',
  LIGHTLY_ACTIVE: 'Lightly active',
  MODERATELY_ACTIVE: 'On your feet',
  VERY_ACTIVE: 'Very active',
  EXTREMELY_ACTIVE: 'Extremely active',
};

export default async function ProfilePage() {
  const me = await requireClient();
  const shell = shellUserOf(me);
  const sub = subscriptionOf(me);
  const access = entitlementsOf(me);
  const p = me.profile;

  return (
    <ClientAppShell user={shell} title="Profile and billing">
      <div className="flex items-center gap-4">
        <Avatar name={shell.name} src={me.avatarUrl} size="xl" />
        <div className="min-w-0">
          <p className="t-h3 truncate">{shell.name}</p>
          <p className="t-body-sm truncate">{me.email}</p>
          <p className="t-caption mt-1">{shell.detail}</p>
        </div>
      </div>

      {p && (
        <Section title="Your daily targets" description="Set from your assessment and adjusted by your coach after check-ins.">
          <StatRow>
            <Stat label="calories" value={Math.round(p.dailyCalories)} unit="kcal" />
            <Stat label="protein" value={Math.round(p.targetProteinG)} unit="g" />
            <Stat label="carbohydrate" value={Math.round(p.targetCarbsG)} unit="g" />
            <Stat label="fat" value={Math.round(p.targetFatG)} unit="g" />
          </StatRow>
          <ListRows className="hairline">
            <ListRow title="Goal" trailing={GOAL[p.primaryGoal] ?? p.primaryGoal} />
            <ListRow title="Daily activity" trailing={ACTIVITY[p.activityLevel] ?? p.activityLevel} />
            <ListRow title="Age, height" trailing={`${p.age} · ${p.heightCm} cm`} />
            <ListRow title="Starting weight" trailing={p.startingWeightKg ? `${p.startingWeightKg} kg` : `${p.weightKg} kg`} />
            {p.targetWeightKg && <ListRow title="Target weight" trailing={`${p.targetWeightKg} kg`} />}
            <ListRow title="Resting energy (BMR)" trailing={`${Math.round(p.bmr).toLocaleString()} kcal`} />
            <ListRow title="Maintenance (TDEE)" trailing={`${Math.round(p.tdee).toLocaleString()} kcal`} />
          </ListRows>
        </Section>
      )}

      <section id="membership" className="scroll-mt-20">
        <Section title="Plan" description={access.trial.isTrial && access.trial.isActive ? `You are on a 14-day trial with Signature access, day ${access.trial.currentDay} of 14.` : 'Change plan at any time. Your nutrition log and history stay with you.'}>
          <PlanSwitcher current={(sub.planTier ?? 'FREE') as 'FREE' | 'SILVER' | 'GOLD' | 'DIAMOND'} onTrial={Boolean(access.trial.isTrial && access.trial.isActive)} />
        </Section>
      </section>

      <Section title="Appearance">
        <div className="flex items-center justify-between gap-4">
          <p className="t-body-sm">Light, dark, or follow your phone.</p>
          <ThemeToggle variant="buttons" />
        </div>
      </Section>

      <Section>
        <SignOutButton />
      </Section>
    </ClientAppShell>
  );
}
