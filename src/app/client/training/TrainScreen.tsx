'use client';

import React, { useState } from 'react';
import { Check, Download } from 'lucide-react';
import { Button, EmptyState, ListRow, ListRows, Menu, Pill, Section } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { SessionLogger } from './SessionLogger';

export interface TrainExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  tempo: string | null;
  rpe: number | null;
  rir: number | null;
  progressionGuidance: string | null;
  coachNotes: string | null;
}

export interface TrainWorkout {
  id: string;
  dayName: string;
  title: string;
  exercises: TrainExercise[];
  logs: { id: string; completedAt: string; setDetail: string | null; adherenceScore: number }[];
}

export interface TrainPlan {
  id: string;
  title: string;
  durationWeeks: number;
  workouts: TrainWorkout[];
}

export function effortLine(e: TrainExercise) {
  const parts = [`${e.sets} × ${e.reps}`];
  if (e.rpe != null) parts.push(`RPE ${e.rpe}`);
  if (e.rir != null) parts.push(`RIR ${e.rir}`);
  if (e.tempo) parts.push(`tempo ${e.tempo}`);
  return parts.join(' · ');
}

function doneThisWeek(w: TrainWorkout) {
  const last = w.logs[0]?.completedAt;
  if (!last) return null;
  const d = new Date(last);
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return d >= monday ? d : null;
}

export function TrainScreen({
  access,
  plan,
  nextIndex,
  week,
  sessionMinutes,
}: {
  access: boolean;
  plan: TrainPlan | null;
  nextIndex: number;
  week: number;
  sessionMinutes: number;
}) {
  const [selected, setSelected] = useState(Math.max(0, nextIndex));
  const [running, setRunning] = useState<number | null>(null);

  if (!access) {
    return (
      <EmptyState
        message="Your training programme, set logging and progression guidance come with the Essential plan and above. Your nutrition log and progress history stay free."
        action={<Button href="/client/profile#membership" size="sm">See plans</Button>}
      />
    );
  }
  if (!plan || plan.workouts.length === 0) {
    return <EmptyState message={`${BRAND.coachName} is building your programme from your assessment. You will get a notification when it is ready.`} />;
  }

  const workout = plan.workouts[selected];

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="t-h3">{plan.title}</p>
          <p className="t-body-sm mt-1">
            Week {Math.min(week, plan.durationWeeks)} of {plan.durationWeeks} · {plan.workouts.length} sessions a week
          </p>
        </div>
        <Menu items={[{ label: 'Download programme PDF', icon: <Download size={16} />, href: `/print/workout-programme/${plan.id}?autoprint=1` }]} label="Programme options" />
      </div>

      <Section title="This week" first>
        <ListRows className="hairline">
          {plan.workouts.map((w, i) => {
            const done = doneThisWeek(w);
            return (
              <ListRow
                key={w.id}
                onClick={() => setSelected(i)}
                leading={
                  <span
                    aria-hidden
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold tnum ${done ? 'bg-brand-strong text-brand-on-strong' : i === selected ? 'border-2 border-[var(--brand)] text-brand' : 'border border-[var(--border-input)] text-ink-secondary'}`}
                  >
                    {done ? <Check size={16} /> : i + 1}
                  </span>
                }
                title={w.title}
                subtitle={`${w.dayName} · ${w.exercises.length} exercises${done ? ` · done ${done.toLocaleDateString('en-GB', { weekday: 'short' })}` : ''}`}
                trailing={i === nextIndex && !done ? <Pill tone="brand">Next</Pill> : undefined}
                chevron={false}
                className={i === selected ? 'bg-[var(--bg-card-hover)]' : ''}
              />
            );
          })}
        </ListRows>
      </Section>

      <Section title={workout.title} description={`${workout.dayName} · about ${sessionMinutes} minutes`}>
        <ol className="divide-y divide-[var(--border-subtle)] hairline-b">
          {workout.exercises.map((e, i) => (
            <li key={e.id} className="grid grid-cols-[2ch_1fr] gap-3 py-4">
              <span className="t-caption tnum pt-0.5">{i + 1}</span>
              <div className="min-w-0 space-y-1">
                <p className="t-ui">{e.name}</p>
                <p className="t-body-sm tnum">{effortLine(e)} · rest {e.restSeconds}s</p>
                {e.progressionGuidance && <p className="t-caption">{e.progressionGuidance}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Primary action: sticky above the tab bar on phones */}
      <div className="sticky z-20 -mx-4 px-4 py-3 md:static md:mx-0 md:px-0 md:py-0 bg-[var(--bg-header)] md:bg-transparent backdrop-blur-md md:backdrop-blur-none" style={{ bottom: 'calc(var(--tabbar-height) + env(safe-area-inset-bottom, 0px))' }}>
        <Button size="lg" full className="md:w-auto" onClick={() => setRunning(selected)}>
          Start {workout.dayName.toLowerCase()}
        </Button>
      </div>

      {running !== null && <SessionLogger workout={plan.workouts[running]} onClose={() => setRunning(null)} />}
    </>
  );
}
