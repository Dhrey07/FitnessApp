'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import {
  Dumbbell,
  CheckCircle2,
  Lock,
  ArrowRight,
  Play,
  Clock,
  Flame,
  Award,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import { PLAN_DETAILS, hasTrainingAccess } from '@/lib/services/entitlements';
import { ActiveWorkoutModal } from '@/components/fitness/ActiveWorkoutModal';
import { WorkoutCompletionModal } from '@/components/fitness/WorkoutCompletionModal';

export default function TrainingClientPage() {
  const [user, setUser] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [setsDone, setSetsDone] = useState('4');
  const [repsDone, setRepsDone] = useState('10');
  const [weightUsed, setWeightUsed] = useState('60');
  const [logSuccess, setLogSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Active workout focus mode modals
  const [activeWorkoutOpen, setActiveWorkoutOpen] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<any>(null);

  useEffect(() => {
    fetchFitnessData();
  }, []);

  const fetchFitnessData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      setUser(meData.user);

      if (meData.user?.id) {
        const wRes = await fetch(`/api/training/workouts?userId=${meData.user.id}`);
        const wData = await wRes.json();
        setWorkoutPlan(wData.workoutPlan);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedExercise) return;

    try {
      const res = await fetch('/api/training/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          workoutId: selectedExercise.workoutId || workoutPlan?.workouts?.[selectedWorkoutIndex]?.id,
          setsCompleted: setsDone,
          repsCompleted: repsDone,
          weightUsedKg: weightUsed,
        }),
      });

      if (res.ok) {
        setLogSuccess(`Logged ${setsDone} sets × ${repsDone} reps @ ${weightUsed}kg for ${selectedExercise.name}!`);
        setSelectedExercise(null);
        setTimeout(() => setLogSuccess(''), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isUnlocked = user ? hasTrainingAccess(user.subscription) : true;
  const currentWorkout = workoutPlan?.workouts?.[selectedWorkoutIndex] || {
    dayName: 'Day 1',
    title: 'Upper Body Hypertrophy & Fat Burn',
    exercises: [
      { id: '1', name: 'Barbell Incline Bench Press', sets: 4, reps: '8-10', restSeconds: 90, tempo: '3-0-1', notes: 'Focus on slow controlled negative' },
      { id: '2', name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 60, tempo: '2-0-1', notes: 'Keep elbows slightly tucked' },
      { id: '3', name: 'Cable Chest Flyes', sets: 3, reps: '12-15', restSeconds: 60, tempo: '2-1-1', notes: 'Peak contraction pause at chest center' },
      { id: '4', name: 'Triceps Rope Pushdowns', sets: 4, reps: '12-15', restSeconds: 45, tempo: '2-0-1', notes: 'Lock elbows tightly to ribcage' },
    ],
  };

  return (
    <ClientAppShell
      title="Training Hub"
      subtitle="Your personalised training routine, progressive overload logger, and exercise instruction."
    >
      {/* Active Workout Focus Mode Modal */}
      {activeWorkoutOpen && (
        <ActiveWorkoutModal
          workoutTitle={currentWorkout.title}
          dayName={currentWorkout.dayName || `Day ${selectedWorkoutIndex + 1}`}
          exercises={currentWorkout.exercises || []}
          onClose={() => setActiveWorkoutOpen(false)}
          onFinishWorkout={(summary) => {
            setActiveWorkoutOpen(false);
            setCompletionSummary(summary);
          }}
        />
      )}

      {/* Workout Completion Modal */}
      {completionSummary && (
        <WorkoutCompletionModal
          summary={completionSummary}
          onClose={() => setCompletionSummary(null)}
        />
      )}

      {/* LOCKED / EXPIRED TRIAL STATE */}
      {!isUnlocked ? (
        <div className="surface p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 border-status-pending/40 animate-fade-in w-full">
          <div className="w-14 h-14 rounded-2xl bg-status-pending/15 text-status-pending flex items-center justify-center mx-auto">
            <Lock size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="page-title text-2xl">Your training programme needs an active plan</h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Your 14-day trial has ended. Your nutrition log and progress history stay free. Choose a plan below to continue your training programme and coach check-ins.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            {[PLAN_DETAILS.SILVER, PLAN_DETAILS.GOLD, PLAN_DETAILS.DIAMOND].map((plan) => (
              <div
                key={plan.tier}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  plan.tier === 'GOLD'
                    ? 'border-2 border-line-active surface shadow-xl'
                    : 'border-[var(--border-subtle)] surface'
                }`}
              >
                <div>
                  <span className="label-xs text-brand">{plan.tier}</span>
                  <h3 className="font-extrabold text-[var(--text-heading)] text-base mt-1">{plan.name}</h3>
                  <p className="text-xl font-black text-[var(--text-heading)] mt-1">₦{plan.priceNgn.toLocaleString()}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{plan.tagline}</p>
                </div>

                <Link
                  href={`/client/profile?tier=${plan.tier}#membership`}
                  className={`text-xs w-full justify-center py-2.5 ${
                    plan.tier === 'GOLD' ? 'btn-brand font-bold' : 'btn-secondary font-bold'
                  }`}
                >
                  Activate {plan.tier} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* UNLOCKED ACTIVE FITNESS HUB */
        <div className="space-y-6 w-full">
          {/* Plan Header Surface & Launch Button */}
          <div className="surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border border-[var(--border-subtle)]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="label-xs text-brand">Active Routine</span>
                <span className="badge badge-approved text-xs">4-Week Phase</span>
                <span className="badge badge-trial text-xs">INTERMEDIATE</span>
              </div>
              <h2 className="text-xl font-extrabold text-[var(--text-heading)]">
                {workoutPlan?.title || '4-Day Hypertrophy & Fat Burn Routine'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Goal: <strong className="text-brand">{workoutPlan?.goal?.replace('_', ' ') || 'FAT LOSS'}</strong> • Home & Gym Accessible • 45 min/session
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Day Switcher */}
              <div className="flex items-center gap-1 bg-paper p-1 rounded-xl border border-[var(--border-subtle)]">
                {(workoutPlan?.workouts || [1, 2, 3, 4]).map((w: any, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedWorkoutIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedWorkoutIndex === idx
                        ? 'bg-brand-strong text-brand-on-strong shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                    }`}
                  >
                    Day {idx + 1}
                  </button>
                ))}
              </div>

              {/* Start Workout Action */}
              <button
                type="button"
                onClick={() => setActiveWorkoutOpen(true)}
                className="btn-brand text-xs font-black py-2.5 px-4 shadow-md"
              >
                <Play size={14} className="fill-current" /> Start Focus Session
              </button>
            </div>
          </div>

          {logSuccess && (
            <div className="p-4 rounded-xl bg-status-approved/15 border border-status-approved/40 text-status-approved text-xs flex items-center gap-2 animate-fade-in w-full">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{logSuccess}</span>
            </div>
          )}

          {/* Metadata Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            <div className="surface p-4 space-y-1">
              <span className="label-xs text-[var(--text-muted)]">Target Muscle Group</span>
              <p className="text-base font-extrabold text-[var(--text-heading)]">Upper Chest & Shoulders</p>
              <p className="text-xs text-[var(--text-muted)]">Push focus day</p>
            </div>

            <div className="surface p-4 space-y-1">
              <span className="label-xs text-[var(--text-muted)]">Est. Duration</span>
              <p className="text-base font-extrabold text-brand">45 Minutes</p>
              <p className="text-xs text-[var(--text-muted)]">Including rest intervals</p>
            </div>

            <div className="surface p-4 space-y-1">
              <span className="label-xs text-[var(--text-muted)]">Equipment Needed</span>
              <p className="text-base font-extrabold text-[var(--text-heading)]">Dumbbells & Bench</p>
              <p className="text-xs text-[var(--text-muted)]">Home or gym setup</p>
            </div>

            <div className="surface p-4 space-y-1">
              <span className="label-xs text-[var(--text-muted)]">Est. Energy Burn</span>
              <p className="text-base font-extrabold text-status-pending">~380 kcal</p>
              <p className="text-xs text-[var(--text-muted)]">Calibrated for fat loss</p>
            </div>
          </div>

          {/* Workout Exercises Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            
            {/* Exercises List Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="section-title text-sm">
                  {currentWorkout?.dayName || `Day ${selectedWorkoutIndex + 1}`} • {currentWorkout?.title || 'Push Session'}
                </h3>
                <span className="text-xs text-[var(--text-muted)]">{currentWorkout?.exercises?.length || 4} Movements</span>
              </div>

              <div className="space-y-3">
                {(currentWorkout?.exercises || [
                  { id: '1', name: 'Barbell Incline Bench Press', sets: 4, reps: '8-10', restSeconds: 90, tempo: '3-0-1', notes: 'Focus on slow controlled negative' },
                  { id: '2', name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 60, tempo: '2-0-1', notes: 'Keep elbows slightly tucked' },
                  { id: '3', name: 'Cable Chest Flyes', sets: 3, reps: '12-15', restSeconds: 60, tempo: '2-1-1', notes: 'Peak contraction pause at chest center' },
                  { id: '4', name: 'Triceps Rope Pushdowns', sets: 4, reps: '12-15', restSeconds: 45, tempo: '2-0-1', notes: 'Lock elbows tightly to ribcage' },
                ]).map((ex: any, idx: number) => (
                  <div
                    key={ex.id || idx}
                    onClick={() => {
                      setSelectedExercise(ex);
                      setSetsDone(String(ex.sets || 3));
                      setRepsDone(String(ex.reps?.split('-')[0] || 10));
                    }}
                    className={`surface p-5 space-y-3 cursor-pointer transition-all ${
                      selectedExercise?.name === ex.name
                        ? 'border-line-active shadow-md'
                        : 'hover:border-[var(--border-active)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-paper text-brand font-bold text-xs flex items-center justify-center border border-[var(--border-subtle)]">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-[var(--text-heading)]">{ex.name}</h4>
                      </div>
                      <span className="text-brand font-bold text-xs">{ex.sets} Sets × {ex.reps}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                      <span>Rest: <strong className="text-[var(--text-heading)]">{ex.restSeconds || 60}s</strong></span>
                      <span>Tempo: <strong className="text-[var(--text-heading)]">{ex.tempo || '2-0-1'}</strong></span>
                      <span className="text-right text-brand font-semibold">Log Set →</span>
                    </div>

                    {ex.notes && (
                      <p className="text-xs text-[var(--text-muted)] italic">Cue: &quot;{ex.notes}&quot;</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Set & Weight Logger Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="surface p-6 space-y-5 border border-line-active sticky top-20">
                <div>
                  <span className="label-xs text-brand">Quick Set Logger</span>
                  <h3 className="text-base font-bold text-[var(--text-heading)] mt-1">
                    {selectedExercise ? selectedExercise.name : 'Select an Exercise to Log'}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Record your load in kg and reps completed to build your overload timeline.
                  </p>
                </div>

                {selectedExercise ? (
                  <form onSubmit={handleLogSet} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="field-label">Sets Done</label>
                        <input
                          type="number"
                          value={setsDone}
                          onChange={(e) => setSetsDone(e.target.value)}
                          className="field-input text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="field-label">Reps / Set</label>
                        <input
                          type="text"
                          value={repsDone}
                          onChange={(e) => setRepsDone(e.target.value)}
                          className="field-input text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="field-label">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={weightUsed}
                          onChange={(e) => setWeightUsed(e.target.value)}
                          className="field-input text-center font-bold text-brand"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-paper rounded-xl border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Rest Interval:</span>
                      <span className="font-mono text-brand font-bold">{selectedExercise.restSeconds || 60} Seconds</span>
                    </div>

                    <button
                      type="submit"
                      className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-md"
                    >
                      <CheckCircle2 size={15} /> Save Set & Track Load
                    </button>
                  </form>
                ) : (
                  <div className="p-8 text-center bg-paper rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs space-y-2">
                    <Dumbbell size={24} className="mx-auto text-ink-muted" />
                    <p>Click any exercise on the left to input your sets, reps, and weights used.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </ClientAppShell>
  );
}
