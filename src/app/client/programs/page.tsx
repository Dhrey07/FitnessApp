'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { Layers, Dumbbell, Clock, Calendar, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function ProgramsClientPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const programs = [
    {
      id: '1',
      title: '12-Week Lean Muscle Recomposition',
      goal: 'FAT_LOSS_AND_MUSCLE',
      durationWeeks: 12,
      daysPerWeek: 4,
      difficulty: 'INTERMEDIATE',
      equipment: 'Dumbbells, Barbells, Cable Machines',
      tagline: 'Scientific progressive overload program calibrated for fat loss while maintaining or building muscle.',
      category: 'HYPERTROPHY',
      isPremium: true,
      features: ['Upper/Lower 4-Day Split', 'Auto-calculated RPE progression', 'Weekly macro adjustments'],
    },
    {
      id: '2',
      title: '8-Week Metabolic Conditioning & Shred',
      goal: 'FAT_LOSS',
      durationWeeks: 8,
      daysPerWeek: 5,
      difficulty: 'ADVANCED',
      equipment: 'Dumbbells & Resistance Bands',
      tagline: 'High-density superset workouts designed for rapid calorie expenditure and cardiovascular fitness.',
      category: 'FAT_LOSS',
      isPremium: true,
      features: ['HIIT & Resistance Supersets', 'Home or Gym accessible', 'Custom heart rate zone cues'],
    },
    {
      id: '3',
      title: '4-Week Home Bodyweight Foundation',
      goal: 'STRENGTH_BASELINE',
      durationWeeks: 4,
      daysPerWeek: 3,
      difficulty: 'BEGINNER',
      equipment: 'No Equipment Needed',
      tagline: 'Master fundamental movement patterns (squats, pushups, hinges, planks) with zero gym equipment.',
      category: 'FOUNDATION',
      isPremium: false,
      features: ['Zero equipment required', 'Joint-friendly tempo work', 'Included free for all registered athletes'],
    },
  ];

  const filteredPrograms = selectedCategory === 'ALL'
    ? programs
    : programs.filter((p) => p.category === selectedCategory);

  return (
    <ClientAppShell
      title="Training Programs Library"
      subtitle="Explore structured multi-week fitness routines engineered for specific body composition goals."
    >
      {/* Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 surface p-4 border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-sky-400" />
          <span className="text-xs font-bold text-[var(--text-heading)]">Filter Programs:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'HYPERTROPHY', 'FAT_LOSS', 'FOUNDATION'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-400 text-slate-950 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="surface p-6 flex flex-col justify-between space-y-5 border border-[var(--border-subtle)] surface-hover"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="label-xs text-sky-400">{prog.category}</span>
                <span className={`badge text-[9px] ${prog.isPremium ? 'badge-trial' : 'badge-approved'}`}>
                  {prog.isPremium ? 'PREMIUM TIER' : 'FREE TIER'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[var(--text-heading)] leading-snug">{prog.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">{prog.tagline}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                <span>Duration: <strong className="text-[var(--text-heading)]">{prog.durationWeeks} Weeks</strong></span>
                <span>Frequency: <strong className="text-[var(--text-heading)]">{prog.daysPerWeek} Days / Wk</strong></span>
                <span>Level: <strong className="text-[var(--text-heading)]">{prog.difficulty}</strong></span>
                <span className="truncate">Setup: <strong className="text-[var(--text-heading)]">{prog.equipment.split(',')[0]}</strong></span>
              </div>

              <ul className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                {prog.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-sky-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <Link
                href="/client/fitness-police"
                className="btn-brand text-xs w-full justify-center py-2.5 font-bold shadow-md shadow-sky-500/20"
              >
                View Workout Schedule <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </ClientAppShell>
  );
}
