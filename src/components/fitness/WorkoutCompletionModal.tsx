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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="surface max-w-lg w-full p-8 text-center space-y-6 border border-emerald-500/40 shadow-2xl relative animate-fade-in my-auto">
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1.5">
          <span className="badge badge-approved text-[10px]">SESSION LOGGED</span>
          <h2 className="text-2xl font-extrabold text-white">Workout Complete. Great Work.</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your sets and progressive overload numbers have been saved to your timeline.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 bg-slate-900 rounded-xl border border-white/5 space-y-0.5">
            <span className="label-xs text-slate-400">Duration</span>
            <p className="text-xl font-extrabold text-white">{summary.durationMinutes} <span className="text-xs font-normal text-slate-400">min</span></p>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-white/5 space-y-0.5">
            <span className="label-xs text-slate-400">Total Sets</span>
            <p className="text-xl font-extrabold text-sky-400">{summary.totalSets}</p>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-white/5 space-y-0.5">
            <span className="label-xs text-slate-400">Consistency</span>
            <p className="text-xl font-extrabold text-emerald-400">15 Days</p>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">Recommended Next Actions</p>

          <Link
            href="/client/food-police"
            onClick={onClose}
            className="btn-brand text-xs w-full justify-between py-3 px-4 font-bold shadow-md"
          >
            <span className="flex items-center gap-2">
              <Utensils size={15} /> Log Post-Workout Meal in Food Police
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
