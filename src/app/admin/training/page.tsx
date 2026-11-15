'use client';

import React, { useState, useEffect } from 'react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { DownloadPdfButton } from '@/components/brand/DownloadPdfButton';
import {
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function AdminTrainingBuilderPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [planTitle, setPlanTitle] = useState('4-Week Metabolic Hypertrophy');
  const [planGoal, setPlanGoal] = useState('FAT_LOSS');
  const [durationWeeks, setDurationWeeks] = useState('4');

  const [workouts, setWorkouts] = useState([
    {
      dayName: 'Day 1',
      title: 'Upper Body Push & Core',
      exercises: [
        { name: 'Incline Dumbbell Bench Press', sets: 4, reps: '8-10', restSeconds: 75, tempo: '2-0-1', rpe: '8', rir: '2', progressionGuidance: 'Add 2.5 kg once every set reaches the top of the range at RPE 8.', coachNotes: 'Control the descent', notes: 'Control the descent' },
        { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 60, tempo: '2-0-1', rpe: '8', rir: '2', progressionGuidance: 'Add 2.5 kg once every set reaches the top of the range at RPE 8.', coachNotes: 'Full lockout', notes: 'Full lockout' },
        { name: 'Push-ups', sets: 3, reps: '15', restSeconds: 45, tempo: '2-0-1', rpe: '8', rir: '2', progressionGuidance: 'Add 2.5 kg once every set reaches the top of the range at RPE 8.', coachNotes: 'Chest to floor', notes: 'Chest to floor' },
      ],
    },
    {
      dayName: 'Day 2',
      title: 'Lower Body & Conditioning',
      exercises: [
        { name: 'Barbell Back Squats', sets: 4, reps: '8-10', restSeconds: 90, tempo: '2-0-1', rpe: '8', rir: '2', progressionGuidance: 'Add 2.5 kg once every set reaches the top of the range at RPE 8.', coachNotes: 'Below parallel', notes: 'Below parallel' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', restSeconds: 75, tempo: '2-0-1', rpe: '8', rir: '2', progressionGuidance: 'Add 2.5 kg once every set reaches the top of the range at RPE 8.', coachNotes: 'Feel the hamstring stretch', notes: 'Feel the hamstring stretch' },
        { name: 'Walking Lunges', sets: 3, reps: '12 per leg', restSeconds: 60, tempo: '2-0-1', rpe: '8', rir: '2', progressionGuidance: 'Add 2.5 kg once every set reaches the top of the range at RPE 8.', coachNotes: 'Upright torso', notes: 'Upright torso' },
      ],
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchClientsAndPlans();
  }, []);

  const fetchClientsAndPlans = async () => {
    try {
      const cRes = await fetch('/api/admin/clients');
      const cData = await cRes.json();
      setClients(cData.clients || []);
      if (cData.clients?.length > 0) {
        setSelectedClientId(cData.clients[0].id);
      }

      const pRes = await fetch('/api/admin/workout-plans');
      const pData = await pRes.json();
      setPlans(pData.workoutPlans || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddExercise = (workoutIdx: number) => {
    const updated = [...workouts];
    updated[workoutIdx].exercises.push({
      name: 'New Exercise',
      sets: 3,
      reps: '10-12',
      restSeconds: 60,
      tempo: '2-0-1',
      rpe: '8',
      rir: '2',
      progressionGuidance: '',
      coachNotes: '',
      notes: '',
    });
    setWorkouts(updated);
  };

  const handleRemoveExercise = (workoutIdx: number, exerciseIdx: number) => {
    const updated = [...workouts];
    updated[workoutIdx].exercises.splice(exerciseIdx, 1);
    setWorkouts(updated);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/workout-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedClientId,
          title: planTitle,
          goal: planGoal,
          durationWeeks,
          workouts,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Programme assigned to the client.');
        fetchClientsAndPlans();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAppShell
      title="Training Builder"
      subtitle="Build a programme with sets, reps, rest, tempo, effort targets and progression guidance, then assign it."
    >
      {successMsg && (
        <div className="p-4 rounded-xl bg-status-approved/15 border border-status-approved/40 text-status-approved text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Plan Builder Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleCreatePlan} className="surface p-6 sm:p-7 space-y-6 border border-[var(--border-subtle)]">
            <div>
              <span className="label-xs text-brand">Programme</span>
              <h3 className="section-title text-base mt-0.5">Build a training programme</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="field-label">Target Client</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="field-input"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.subscriptions?.[0]?.planTier || 'FREE'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Plan Title</label>
                <input
                  type="text"
                  required
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="field-input"
                />
              </div>

              <div>
                <label className="field-label">Primary Goal</label>
                <select
                  value={planGoal}
                  onChange={(e) => setPlanGoal(e.target.value)}
                  className="field-input"
                >
                  <option value="FAT_LOSS">Fat Loss</option>
                  <option value="BODY_RECOMPOSITION">Body Recomposition</option>
                  <option value="MUSCLE_GAIN">Muscle Gain</option>
                </select>
              </div>
            </div>

            {/* Workouts Splits */}
            <div className="space-y-5">
              {workouts.map((w, wIdx) => (
                <div key={wIdx} className="p-5 surface rounded-xl border border-[var(--border-subtle)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-trial text-xs">{w.dayName}</span>
                      <h4 className="font-bold text-[var(--text-heading)] text-sm">{w.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddExercise(wIdx)}
                      className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Exercise
                    </button>
                  </div>

                  <div className="space-y-2">
                    {w.exercises.map((ex, exIdx) => {
                      const set = (field: string, value: string | number) => {
                        const updated = [...workouts];
                        (updated[wIdx].exercises[exIdx] as any)[field] = value;
                        setWorkouts(updated);
                      };
                      return (
                        <div key={exIdx} className="p-3.5 bg-paper rounded-xl border border-line space-y-2.5 text-xs">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              aria-label="Exercise name"
                              value={ex.name}
                              onChange={(e) => set('name', e.target.value)}
                              className="field-input font-semibold flex-1"
                            />
                            <button type="button" onClick={() => handleRemoveExercise(wIdx, exIdx)} className="p-2 text-ink-muted hover:text-status-rejected" aria-label="Remove exercise">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {[
                              ['sets', 'Sets', 'number'],
                              ['reps', 'Reps', 'text'],
                              ['restSeconds', 'Rest (s)', 'number'],
                              ['tempo', 'Tempo', 'text'],
                              ['rpe', 'RPE', 'number'],
                              ['rir', 'RIR', 'number'],
                            ].map(([field, label, type]) => (
                              <label key={field} className="block">
                                <span className="label-xs text-ink-muted block mb-1">{label}</span>
                                <input
                                  type={type}
                                  step={field === 'rpe' ? '0.5' : '1'}
                                  value={(ex as any)[field] ?? ''}
                                  onChange={(e) => set(field, type === 'number' && field !== 'rpe' && field !== 'rir' ? Number(e.target.value) : e.target.value)}
                                  className="field-input py-1.5"
                                />
                              </label>
                            ))}
                          </div>
                          <label className="block">
                            <span className="label-xs text-ink-muted block mb-1">Progression guidance</span>
                            <input type="text" value={(ex as any).progressionGuidance ?? ''} onChange={(e) => set('progressionGuidance', e.target.value)} placeholder="When and how to add load or reps" className="field-input py-1.5" />
                          </label>
                          <label className="block">
                            <span className="label-xs text-ink-muted block mb-1">Coach notes</span>
                            <input type="text" value={(ex as any).coachNotes ?? ''} onChange={(e) => set('coachNotes', e.target.value)} placeholder="Technique cue or substitution" className="field-input py-1.5" />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-md"
            >
              {submitting ? 'Assigning…' : 'Assign programme to client'} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Right Column: Existing Plans Library */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="section-title text-sm">Active Assigned Plans</h3>

          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.id} className="surface p-5 space-y-3 border border-[var(--border-subtle)] text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[var(--text-heading)] text-sm">{p.title}</h4>
                  <span className="badge badge-trial text-xs">{p.durationWeeks} Weeks</span>
                </div>
                <p className="text-[var(--text-muted)]">
                  Client: <strong className="text-[var(--text-heading)]">{p.user?.firstName} {p.user?.lastName}</strong>
                </p>
                <div className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <span>{p.workouts?.length || 0} training days</span>
                  <DownloadPdfButton href={`/print/workout-programme/${p.id}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminAppShell>
  );
}
