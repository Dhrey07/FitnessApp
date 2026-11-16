'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button, IconButton } from '@/components/ui/Button';
import { RestTimer } from '@/components/ui/RestTimer';
import { Sheet } from '@/components/ui/Sheet';
import { Stat, StatRow } from '@/components/ui/Stat';
import { Stepper } from '@/components/ui/Stepper';
import { toast } from '@/components/ui/Toast';
import { sendOrQueue } from '@/lib/offlineQueue';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/cn';
import { effortLine, type TrainWorkout } from './TrainScreen';

interface LoggedSet {
  kg: number;
  reps: number;
}

type SetLog = Record<string, LoggedSet[]>;

interface SetDetailEntry {
  exerciseId: string;
  name: string;
  sets: LoggedSet[];
}

const draftKey = (workoutId: string) => `ericonet.session.${workoutId}`;

function firstNumber(reps: string, fallback = 10) {
  const m = reps.match(/\d+/);
  return m ? Number(m[0]) : fallback;
}

/** The last logged sets for each exercise in this workout, from the newest log with set detail. */
function lastTime(workout: TrainWorkout): Record<string, LoggedSet[]> {
  for (const log of workout.logs) {
    if (!log.setDetail) continue;
    try {
      const entries = JSON.parse(log.setDetail) as SetDetailEntry[];
      return Object.fromEntries(entries.map((e) => [e.exerciseId, e.sets]));
    } catch {
      /* ignore malformed detail */
    }
  }
  return {};
}

function formatSets(sets: LoggedSet[]) {
  return sets.map((s) => `${s.kg} × ${s.reps}`).join(', ');
}

/**
 * Full-screen set logger. Two large steppers (kg, reps), one Done that
 * records the set and hands the bottom bar to the rest timer. Progress is
 * kept on the device until the session is saved.
 */
export function SessionLogger({ workout, onClose }: { workout: TrainWorkout; onClose: () => void }) {
  const router = useRouter();
  const previous = useMemo(() => lastTime(workout), [workout]);
  const [index, setIndex] = useState(0);
  const [log, setLog] = useState<SetLog>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [resting, setResting] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const exercise = workout.exercises[index];
  const done = log[exercise.id] ?? [];
  const last = previous[exercise.id];
  const seed = done[done.length - 1] ?? last?.[Math.min(done.length, (last?.length ?? 1) - 1)] ?? { kg: 0, reps: firstNumber(exercise.reps) };
  const [kg, setKg] = useState(seed.kg);
  const [reps, setReps] = useState(seed.reps);

  // Restore an unfinished session for this workout.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey(workout.id));
      if (raw) {
        const d = JSON.parse(raw) as { log: SetLog; index: number; startedAt: number };
        if (Date.now() - d.startedAt < 6 * 3600_000) {
          setLog(d.log);
          setIndex(Math.min(d.index, workout.exercises.length - 1));
          setStartedAt(d.startedAt);
        }
      }
    } catch {
      /* ignore */
    }
  }, [workout.id, workout.exercises.length]);

  useEffect(() => {
    try {
      localStorage.setItem(draftKey(workout.id), JSON.stringify({ log, index, startedAt }));
    } catch {
      /* ignore */
    }
  }, [log, index, startedAt, workout.id]);

  useEffect(() => {
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  // Lock page scroll behind the logger.
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  // When the exercise changes, seed the steppers from what was done or last time.
  useEffect(() => {
    const d = log[exercise.id] ?? [];
    const l = previous[exercise.id];
    const s = d[d.length - 1] ?? l?.[0] ?? { kg: 0, reps: firstNumber(exercise.reps) };
    setKg(s.kg);
    setReps(s.reps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const totalPlanned = workout.exercises.reduce((s, e) => s + e.sets, 0);
  const totalDone = Object.values(log).reduce((s, sets) => s + sets.length, 0);
  const volume = Object.values(log).reduce((s, sets) => s + sets.reduce((v, x) => v + x.kg * x.reps, 0), 0);

  const doneSet = () => {
    haptic(15);
    const next = [...done, { kg, reps }];
    setLog((l) => ({ ...l, [exercise.id]: next }));
    const finishedExercise = next.length >= exercise.sets;
    const isLast = index === workout.exercises.length - 1;
    if (finishedExercise && isLast) {
      setFinishing(true);
      return;
    }
    setResting(exercise.restSeconds || 60);
    if (finishedExercise) {
      // Move on once the rest starts so the next exercise is ready.
      setIndex((i) => Math.min(workout.exercises.length - 1, i + 1));
    }
  };

  const removeSet = (i: number) => setLog((l) => ({ ...l, [exercise.id]: (l[exercise.id] ?? []).filter((_, j) => j !== i) }));

  const endRest = useCallback(() => setResting(null), []);

  const save = async () => {
    setSaving(true);
    const detail: SetDetailEntry[] = workout.exercises
      .filter((e) => (log[e.id] ?? []).length > 0)
      .map((e) => ({ exerciseId: e.id, name: e.name, sets: log[e.id] }));
    const allSets = detail.flatMap((d) => d.sets);
    const top = allSets.reduce((m, s) => Math.max(m, s.kg), 0);
    const summary = detail.map((d) => `${d.name}: ${formatSets(d.sets)}`).join('; ');
    const result = await sendOrQueue('workout', '/api/training/workouts', {
      workoutId: workout.id,
      setsCompleted: allSets.length,
      repsCompleted: allSets.map((s) => s.reps).join(','),
      weightUsedKg: top,
      notes: `${Math.round(elapsed / 60)} min. ${summary}`,
      setDetail: detail,
      adherenceScore: totalPlanned ? Math.round((allSets.length / totalPlanned) * 100) : 100,
    });
    setSaving(false);
    if (result.status === 'error') {
      toast.error('Could not save the session', result.message);
      return;
    }
    localStorage.removeItem(draftKey(workout.id));
    toast(result.status === 'queued' ? 'Session saved on this phone' : 'Session saved', result.status === 'queued' ? 'It will sync when you are back online.' : `${allSets.length} sets · ${Math.round(volume).toLocaleString()} kg moved`);
    onClose();
    router.refresh();
  };

  const discard = () => {
    localStorage.removeItem(draftKey(workout.id));
    onClose();
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 bg-paper flex flex-col motion-enter" role="dialog" aria-modal="true" aria-label={`${workout.title} session`}>
      {/* Header */}
      <header className="shrink-0 border-b border-[var(--border-subtle)]">
        <div className="mx-auto max-w-[640px] px-2 h-14 flex items-center gap-1">
          <IconButton label="Leave session" onClick={() => (totalDone > 0 ? setConfirmExit(true) : discard())}>
            <X size={20} />
          </IconButton>
          <p className="flex-1 text-center t-ui truncate">{workout.title}</p>
          <span className="w-11 text-right pr-2 t-caption tnum" aria-label="Session time">{mm}:{ss}</span>
        </div>
        <div className="h-0.5 bg-[var(--border-subtle)]">
          <div className="h-full bg-brand transition-[width] duration-[var(--dur-3)]" style={{ width: `${(totalDone / Math.max(1, totalPlanned)) * 100}%` }} />
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[640px] px-4 py-6 space-y-6">
          <div className="flex items-center justify-between gap-2">
            <IconButton label="Previous exercise" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
              <ChevronLeft size={20} />
            </IconButton>
            <p className="t-caption tnum">Exercise {index + 1} of {workout.exercises.length}</p>
            <IconButton label="Next exercise" disabled={index === workout.exercises.length - 1} onClick={() => setIndex((i) => Math.min(workout.exercises.length - 1, i + 1))}>
              <ChevronRight size={20} />
            </IconButton>
          </div>

          <div key={exercise.id} className="motion-enter space-y-2">
            <h2 className="t-h1 text-[28px] md:text-[36px]">{exercise.name}</h2>
            <p className="t-body-sm tnum">{effortLine(exercise)}</p>
            {exercise.progressionGuidance && <p className="t-body-sm">{exercise.progressionGuidance}</p>}
            {exercise.coachNotes && (
              <p className="surface-inset px-4 py-3 t-body-sm text-ink">{exercise.coachNotes}</p>
            )}
          </div>

          <div className="space-y-4">
            <p className="t-ui tnum">
              Set {Math.min(done.length + 1, exercise.sets)} of {exercise.sets}
              {done.length >= exercise.sets && <span className="text-brand"> · all sets done</span>}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Stepper label="Weight" value={kg} onChange={setKg} step={2.5} min={0} max={500} unit="kg" />
              <Stepper label="Reps" value={reps} onChange={setReps} step={1} min={0} max={100} />
            </div>
            <p className="t-caption text-center tnum">{last?.length ? `Last time: ${formatSets(last)}` : 'First time logging this exercise'}</p>
          </div>

          {done.length > 0 && (
            <ol className="divide-y divide-[var(--border-subtle)] hairline hairline-b" aria-label="Completed sets">
              {done.map((s, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  <span className="t-caption tnum w-12">Set {i + 1}</span>
                  <span className="flex-1 t-ui tnum">{s.kg} kg × {s.reps}</span>
                  <button type="button" onClick={() => removeSet(i)} className="focus-ring h-9 px-3 rounded-full t-caption hover:text-status-rejected">Undo</button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>

      {/* Bottom bar: Done set, or the rest timer */}
      {resting !== null ? (
        <RestTimer seconds={resting} running onDone={endRest} onSkip={endRest} onExtend={() => undefined} className="!relative !inset-auto" />
      ) : (
        <footer className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] safe-pb">
          <div className="mx-auto max-w-[640px] px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" onClick={() => setFinishing(true)} disabled={totalDone === 0}>Finish</Button>
            <Button size="lg" full onClick={doneSet} disabled={reps <= 0}>
              Done set
            </Button>
          </div>
        </footer>
      )}

      <Sheet
        open={finishing}
        onOpenChange={setFinishing}
        title="Session complete"
        description={workout.title}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setFinishing(false)}>Keep going</Button>
            <Button full loading={saving} onClick={save}>Save session</Button>
          </div>
        }
      >
        <StatRow>
          <Stat label="minutes" value={Math.max(1, Math.round(elapsed / 60))} />
          <Stat label={`of ${totalPlanned} sets`} value={totalDone} />
          <Stat label="kg moved" value={Math.round(volume)} />
        </StatRow>
        <ul className="mt-5 divide-y divide-[var(--border-subtle)] hairline hairline-b">
          {workout.exercises.map((e) => (
            <li key={e.id} className={cn('py-3 text-sm flex justify-between gap-4', !(log[e.id] ?? []).length && 'text-ink-muted')}>
              <span className="min-w-0 truncate">{e.name}</span>
              <span className="tnum shrink-0">{(log[e.id] ?? []).length ? formatSets(log[e.id]) : 'skipped'}</span>
            </li>
          ))}
        </ul>
      </Sheet>

      <Sheet
        open={confirmExit}
        onOpenChange={setConfirmExit}
        title="Leave this session?"
        description="Your sets stay on this phone for six hours, so you can pick up where you left off."
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={discard} className="text-status-rejected">Discard</Button>
            <Button full onClick={onClose}>Keep and leave</Button>
          </div>
        }
      >
        <p className="t-body-sm tnum">{totalDone} of {totalPlanned} sets logged.</p>
      </Sheet>
    </div>
  );
}
