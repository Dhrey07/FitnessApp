import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const SAMPLE = [
  { ex: 'Barbell back squat', sets: '4', reps: '6-8', rest: '150 s', tempo: '3-1-1', rpe: 'RPE 8' },
  { ex: 'Romanian deadlift', sets: '3', reps: '8-10', rest: '120 s', tempo: '3-0-1', rpe: 'RIR 2' },
  { ex: 'Walking lunge', sets: '3', reps: '10/leg', rest: '90 s', tempo: '2-0-1', rpe: 'RIR 2' },
  { ex: 'Seated leg curl', sets: '3', reps: '12-15', rest: '60 s', tempo: '2-1-1', rpe: 'RIR 1' },
];

export function TrainingSection() {
  return (
    <section id="training" className="py-20 sm:py-24 bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 surface p-6 space-y-4 overflow-x-auto">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-ink">Day 2 · Lower body</p>
            <span className="label-xs text-ink-muted">Example programme</span>
          </div>
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="label-xs text-ink-muted text-left">
                <th className="py-2 font-bold">Exercise</th>
                <th className="py-2 font-bold">Sets</th>
                <th className="py-2 font-bold">Reps</th>
                <th className="py-2 font-bold">Rest</th>
                <th className="py-2 font-bold">Tempo</th>
                <th className="py-2 font-bold">Effort</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((r) => (
                <tr key={r.ex} className="border-t border-line text-ink-secondary">
                  <td className="py-3 font-semibold text-ink">{r.ex}</td>
                  <td className="py-3">{r.sets}</td>
                  <td className="py-3">{r.reps}</td>
                  <td className="py-3">{r.rest}</td>
                  <td className="py-3">{r.tempo}</td>
                  <td className="py-3">{r.rpe}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-ink-muted border-t border-line pt-3">
            Progression: add 2.5 kg to the squat when all sets reach 8 reps at RPE 8 or lower.
          </p>
        </div>

        <div className="order-1 lg:order-2 space-y-6">
          <p className="label-xs text-brand">Training</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
            Structured training and progressive overload.
          </h2>
          <p className="text-ink-secondary leading-relaxed">
            Home or gym, three to five days a week. Each session lists the exercise, sets, reps, rest, tempo and an effort target, with clear guidance on when to add load. You log what you did, and the programme moves forward with you.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              'Matched to your equipment, experience and available days',
              'RPE or reps-in-reserve targets so effort is consistent',
              'Set, rep and load logging in the app',
              'Coach notes and monthly programme adjustments',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                <span className="text-ink-secondary">{t}</span>
              </li>
            ))}
          </ul>
          <Link href="/onboarding" className="btn-brand text-sm inline-flex">
            Start your assessment <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
