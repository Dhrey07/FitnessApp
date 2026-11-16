import type { Metadata } from 'next';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { entitlementsOf, getWorkoutPlan, nextWorkoutIndex, programmeWeek, requireClient, shellUserOf } from '@/lib/client/data';
import { TrainScreen, type TrainPlan } from './TrainScreen';

export const metadata: Metadata = { title: 'Train' };
export const dynamic = 'force-dynamic';

export default async function TrainPage() {
  const me = await requireClient();
  const access = entitlementsOf(me);
  const plan = access.training ? await getWorkoutPlan(me.id) : null;

  // Only what the client needs, serialisable.
  const data: TrainPlan | null = plan
    ? {
        id: plan.id,
        title: plan.title,
        durationWeeks: plan.durationWeeks,
        workouts: plan.workouts.map((w) => ({
          id: w.id,
          dayName: w.dayName,
          title: w.title,
          exercises: w.exercises.map((e) => ({
            id: e.id,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            restSeconds: e.restSeconds,
            tempo: e.tempo,
            rpe: e.rpe,
            rir: e.rir,
            progressionGuidance: e.progressionGuidance,
            coachNotes: e.coachNotes ?? e.notes,
          })),
          logs: w.workoutLogs.map((l) => ({ id: l.id, completedAt: l.completedAt.toISOString(), setDetail: l.setDetail, adherenceScore: l.adherenceScore })),
        })),
      }
    : null;

  return (
    <ClientAppShell user={shellUserOf(me)} title="Train">
      <TrainScreen
        access={access.training}
        plan={data}
        nextIndex={nextWorkoutIndex(plan)}
        week={programmeWeek(me).week}
        sessionMinutes={me.profile?.preferredDurationMin ?? 45}
      />
    </ClientAppShell>
  );
}
