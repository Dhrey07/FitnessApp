import React from 'react';
import type { Metadata } from 'next';
import { Calendar, Play, Utensils } from 'lucide-react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { HeroStat } from '@/components/ui/Stat';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Pill } from '@/components/ui/Pill';
import { Quote } from '@/components/ui/Banner';
import { Section } from '@/components/ui/Section';
import { BRAND } from '@/lib/brand';
import {
  checkInWindow,
  entitlementsOf,
  getCheckIns,
  getTodayMeals,
  getWorkoutPlan,
  nextWorkoutIndex,
  programmeWeek,
  requireClient,
  shellUserOf,
  timeAgo,
} from '@/lib/client/data';

export const metadata: Metadata = { title: 'Today' };
export const dynamic = 'force-dynamic';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function RowIcon({ children }: { children: React.ReactNode }) {
  return <span className="h-10 w-10 rounded-full surface-inset flex items-center justify-center text-brand">{children}</span>;
}

export default async function TodayPage() {
  const me = await requireClient();
  const access = entitlementsOf(me);
  const [checkIns, meals, plan] = await Promise.all([
    getCheckIns(me.id, 8),
    getTodayMeals(me.id),
    access.training ? getWorkoutPlan(me.id) : Promise.resolve(null),
  ]);

  const { week, total } = programmeWeek(me);
  const profile = me.profile;

  // Weight: latest check-in, delta against the one before (or the starting weight).
  const latest = checkIns[0];
  const previous = checkIns[1];
  const currentWeight = latest?.currentWeightKg ?? profile?.weightKg ?? null;
  const baseline = previous?.currentWeightKg ?? profile?.startingWeightKg ?? null;
  const delta = currentWeight != null && baseline != null && latest ? Math.round((currentWeight - baseline) * 10) / 10 : undefined;
  const series = [...checkIns].reverse().map((c) => c.currentWeightKg);
  const goodWhen = profile?.primaryGoal === 'MUSCLE_GAIN' || profile?.primaryGoal === 'HEALTHY_WEIGHT_GAIN' ? 'up' : 'down';

  // Food today
  const kcal = meals.reduce((s, m) => s + m.kcal, 0);
  const kcalTarget = Math.round(profile?.dailyCalories ?? 0);

  // Next session
  const idx = nextWorkoutIndex(plan);
  const session = idx >= 0 ? plan!.workouts[idx] : null;

  // Check-in
  const window = checkInWindow(latest);
  const coachNote = checkIns.find((c) => c.coachFeedback);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const coachQuote = coachNote ? (
    <Quote by={BRAND.coachName} when={timeAgo(coachNote.reviewedAt ?? coachNote.checkInDate)}>
      {coachNote.coachFeedback}
    </Quote>
  ) : null;

  return (
    <ClientAppShell
      user={shellUserOf(me)}
      meta={today}
      title={`${greeting()}, ${me.firstName}`}
      rail={
        <>
          {coachQuote ?? <p className="t-body-sm">Your coach&apos;s feedback appears here after your first check-in is reviewed.</p>}
          <ListRows>
            <ListRow
              href="/client/check-in"
              title={window.submitted ? 'Check-in sent' : `Check-in due ${window.label}`}
              subtitle={window.submitted ? `${BRAND.coachName} reviews it on Sunday` : 'About five minutes'}
              trailing={window.submitted ? <Pill tone="approved">Sent</Pill> : <Pill tone="pending">Due</Pill>}
            />
          </ListRows>
        </>
      }
    >
      {/* Signature moment: the programme week at display size */}
      <section aria-label="Programme progress" className="space-y-3">
        <p className="t-display">
          Week {week} <span className="text-ink-muted">of {total}</span>
        </p>
        <div className="h-0.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={week} aria-label={`Week ${week} of ${total}`}>
          <div className="h-full bg-brand rounded-full" style={{ width: `${(week / total) * 100}%` }} />
        </div>
      </section>

      {currentWeight != null && (
        <HeroStat
          label="Weight"
          value={currentWeight.toFixed(1)}
          unit="kg"
          delta={delta || undefined}
          goodWhen={goodWhen}
          context={
            delta === 0
              ? `no change since ${previous ? 'your last check-in' : 'you started'}`
              : delta !== undefined
                ? previous ? 'since your last check-in' : 'since you started'
                : latest ? undefined : 'your starting weight'
          }
          series={series.length > 1 ? series : undefined}
        />
      )}

      <Section first>
        <ListRows className="hairline">
          {access.training ? (
            session ? (
              <ListRow
                href="/client/training"
                leading={<RowIcon><Play size={18} aria-hidden /></RowIcon>}
                title={session.title}
                subtitle={`${session.dayName} · ${session.exercises.length} exercises · ${profile?.preferredDurationMin ?? 45} min`}
                trailing={<span className="t-caption">Next</span>}
              />
            ) : (
              <ListRow leading={<RowIcon><Play size={18} aria-hidden /></RowIcon>} title="Your programme is being built" subtitle={`${BRAND.coachName} will share it here`} />
            )
          ) : (
            <ListRow
              href="/client/profile#membership"
              leading={<RowIcon><Play size={18} aria-hidden /></RowIcon>}
              title="Training programme"
              subtitle="Included from the Essential plan"
            />
          )}
          <ListRow
            href="/client/nutrition"
            leading={<RowIcon><Utensils size={18} aria-hidden /></RowIcon>}
            title={kcalTarget ? `${kcal.toLocaleString()} of ${kcalTarget.toLocaleString()} kcal` : `${kcal.toLocaleString()} kcal logged`}
            subtitle={meals.length === 0 ? 'Nothing logged yet today' : `${meals.length} ${meals.length === 1 ? 'meal' : 'meals'} logged today`}
          />
          <ListRow
            href="/client/check-in"
            leading={<RowIcon><Calendar size={18} aria-hidden /></RowIcon>}
            title={window.submitted ? 'Check-in sent' : `Check-in due ${window.label}`}
            subtitle={window.submitted ? `${BRAND.coachName} reviews it on Sunday` : 'About five minutes'}
            trailing={window.submitted ? <Pill tone="approved">Sent</Pill> : <Pill tone="pending">Due</Pill>}
          />
        </ListRows>
      </Section>

      {coachQuote && <div className="xl:hidden">{coachQuote}</div>}
    </ClientAppShell>
  );
}
