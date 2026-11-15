'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, ChevronRight, X, Clock, Dumbbell, ShieldCheck } from 'lucide-react';

interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds?: number;
  tempo?: string;
  notes?: string;
  mediaUrl?: string;
}

interface ActiveWorkoutModalProps {
  workoutTitle: string;
  dayName: string;
  exercises: Exercise[];
  onClose: () => void;
  onFinishWorkout: (summary: { durationMinutes: number; totalSets: number; totalVolumeKg: number }) => void;
}

export function ActiveWorkoutModal({
  workoutTitle,
  dayName,
  exercises,
  onClose,
  onFinishWorkout,
}: ActiveWorkoutModalProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [repsDone, setRepsDone] = useState('10');
  const [weightUsedKg, setWeightUsedKg] = useState('60');

  // Workout duration timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest timer
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const currentExercise = exercises[currentExerciseIndex] || exercises[0] || {
    name: 'Incline Dumbbell Press',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    tempo: '2-0-1',
    notes: 'Keep shoulder blades retracted and elbows at 45 degree angle.',
  };

  // Workout timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest timer ticker
  useEffect(() => {
    let timer: any = null;
    if (isResting && restSecondsLeft > 0) {
      timer = setInterval(() => {
        setRestSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (restSecondsLeft === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft]);

  const handleLogSet = () => {
    const nextSets = setsCompleted + 1;
    setSetsCompleted(nextSets);

    // Trigger rest timer
    setRestSecondsLeft(currentExercise.restSeconds || 60);
    setIsResting(true);

    // Auto advance to next exercise if all sets completed
    if (nextSets >= (currentExercise.sets || 3)) {
      if (currentExerciseIndex < exercises.length - 1) {
        setTimeout(() => {
          setCurrentExerciseIndex((prev) => prev + 1);
          setSetsCompleted(0);
        }, 1500);
      }
    }
  };

  const handleFinish = () => {
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    onFinishWorkout({
      durationMinutes,
      totalSets: exercises.reduce((acc, ex) => acc + (ex.sets || 3), 0),
      totalVolumeKg: 1240,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="surface max-w-2xl w-full p-5 sm:p-6 space-y-5 border border-line-active shadow-2xl relative animate-fade-in my-4 sm:my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-trial text-xs">ACTIVE WORKOUT FOCUS MODE</span>
              <span className="text-xs text-ink-muted font-mono flex items-center gap-1">
                <Clock size={13} className="text-brand" /> {formatTime(elapsedSeconds)}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-heading)] mt-1">{workoutTitle}</h2>
            <p className="text-xs text-ink-muted">{dayName} • Exercise {currentExerciseIndex + 1} of {exercises.length}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-paper border border-line text-ink-muted hover:text-[var(--text-heading)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Exercise Display Box */}
        <div className="p-5 bg-paper rounded-2xl border border-line-active space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="label-xs text-brand">Current Movement</span>
              <h3 className="text-lg font-black text-[var(--text-heading)]">{currentExercise.name}</h3>
            </div>
            <span className="badge bg-brand-soft text-brand border border-line-active text-xs font-bold">
              Target: {currentExercise.sets} Sets × {currentExercise.reps}
            </span>
          </div>

          {currentExercise.notes && (
            <div className="p-3 bg-paper rounded-xl border border-line text-xs text-ink-secondary flex items-start gap-2">
              <ShieldCheck size={15} className="text-brand shrink-0 mt-0.5" />
              <span>Coaching Cue: &quot;{currentExercise.notes}&quot;</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2.5 bg-paper rounded-xl border border-line">
              <span className="label-xs text-ink-muted block">Tempo</span>
              <span className="font-bold text-[var(--text-heading)] text-sm">{currentExercise.tempo || '2-0-1'}</span>
            </div>
            <div className="p-2.5 bg-paper rounded-xl border border-line">
              <span className="label-xs text-ink-muted block">Rest Interval</span>
              <span className="font-bold text-brand text-sm">{currentExercise.restSeconds || 60}s</span>
            </div>
            <div className="p-2.5 bg-paper rounded-xl border border-line">
              <span className="label-xs text-ink-muted block">Sets Logged</span>
              <span className="font-bold text-status-approved text-sm">{setsCompleted} / {currentExercise.sets || 3}</span>
            </div>
          </div>
        </div>

        {/* Rest Timer Banner */}
        {isResting && (
          <div className="p-4 rounded-xl bg-brand-soft border border-line-active text-center space-y-1 animate-fade-in">
            <span className="text-xs font-bold uppercase tracking-wider text-brand flex items-center justify-center gap-1.5">
              <Clock size={13} /> Active Rest Period
            </span>
            <p className="text-2xl font-black font-mono text-[var(--text-heading)]">{restSecondsLeft}s</p>
            <p className="text-xs text-ink-muted">Breathe and hydrate before your next set.</p>
          </div>
        )}

        {/* Set & Load Logger Inputs */}
        <div className="space-y-3 pt-2 border-t border-line">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="field-label">Set #</label>
              <div className="field-input text-center font-extrabold text-brand text-base">
                Set {setsCompleted + 1}
              </div>
            </div>
            <div>
              <label className="field-label">Reps</label>
              <input
                type="text"
                value={repsDone}
                onChange={(e) => setRepsDone(e.target.value)}
                className="field-input text-center font-bold"
              />
            </div>
            <div>
              <label className="field-label">Load (kg)</label>
              <input
                type="number"
                step="0.5"
                value={weightUsedKg}
                onChange={(e) => setWeightUsedKg(e.target.value)}
                className="field-input text-center font-bold text-brand"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogSet}
            className="btn-brand text-xs w-full justify-center py-3.5 font-extrabold shadow-md"
          >
            <CheckCircle2 size={16} /> Complete Set {setsCompleted + 1} & Start Rest Timer
          </button>
        </div>

        {/* Next Exercise Preview Bar */}
        {currentExerciseIndex < exercises.length - 1 && (
          <div className="p-3 bg-paper rounded-xl border border-line flex items-center justify-between text-xs">
            <span className="text-ink-muted">Up Next:</span>
            <span className="font-bold text-[var(--text-heading)] flex items-center gap-1">
              {exercises[currentExerciseIndex + 1]?.name} <ChevronRight size={14} className="text-brand" />
            </span>
          </div>
        )}

        {/* Finish Workout CTA */}
        <div className="pt-2 border-t border-line flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentExerciseIndex((prev) => Math.min(exercises.length - 1, prev + 1))}
            disabled={currentExerciseIndex >= exercises.length - 1}
            className="btn-secondary text-xs"
          >
            Skip Exercise →
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="btn-brand text-xs px-6 font-black"
          >
            Finish Workout Session
          </button>
        </div>

      </div>
    </div>
  );
}
