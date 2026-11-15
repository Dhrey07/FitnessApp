'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Flame, Utensils, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WorkoutCompletionModalProps {
  summary: {
    durationMinutes: number;
    totalSets: number;
    totalVolumeKg: number;
  };
  onClose: () => void;
}

export function WorkoutCompletionModal({ summary, onClose }: WorkoutCompletionModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="surface max-w-lg w-full p-8 text-center space-y-6 border border-status-approved/40 shadow-2xl relative animate-fade-in my-auto">
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-status-approved/15 text-status-approved flex items-center justify-center mx-auto border border-status-approved/40">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1.5">
          <span className="badge badge-approved text-xs">SESSION LOGGED</span>
          <h2 className="text-2xl font-extrabold text-[var(--text-heading)]">Workout Complete. Great Work.</h2>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            Your sets and progressive overload numbers have been saved to your timeline.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3.5 bg-paper rounded-xl border border-line space-y-0.5">
            <span className="label-xs text-ink-muted">Duration</span>
            <p className="text-xl font-extrabold text-[var(--text-heading)]">{summary.durationMinutes} <span className="text-xs font-normal text-ink-muted">min</span></p>
          </div>

          <div className="p-3.5 bg-paper rounded-xl border border-line space-y-0.5">
            <span className="label-xs text-ink-muted">Total Sets</span>
            <p className="text-xl font-extrabold text-brand">{summary.totalSets}</p>
          </div>

          <div className="p-3.5 bg-paper rounded-xl border border-line space-y-0.5">
            <span className="label-xs text-ink-muted">Consistency</span>
            <p className="text-xl font-extrabold text-status-approved">15 Days</p>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="space-y-3 pt-2 border-t border-line">
          <p className="text-xs font-bold text-ink-muted uppercase tracking-wider text-left">Recommended Next Actions</p>

          <Link
            href="/client/nutrition"
            onClick={onClose}
            className="btn-brand text-xs w-full justify-between py-3 px-4 font-bold shadow-md"
          >
            <span className="flex items-center gap-2">
              <Utensils size={15} /> Log your post-workout meal
            </span>
            <ArrowRight size={14} />
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/client/progress"
              onClick={onClose}
              className="btn-secondary text-xs justify-center py-2.5"
            >
              <TrendingUp size={14} /> View Progress
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs justify-center py-2.5"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
