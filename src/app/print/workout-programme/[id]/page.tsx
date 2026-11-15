import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { canViewClientDocument } from '@/lib/printAuth';
import { BRAND } from '@/lib/brand';
import { PrintSheet } from '@/components/print/PrintSheet';
import { PrintToolbar } from '@/components/print/PrintChrome';

export const dynamic = 'force-dynamic';

const goalLabel = (g?: string | null) => (g || 'FAT_LOSS').toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export default async function WorkoutProgrammePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await prisma.workoutPlan.findUnique({
    where: { id },
    include: { user: { include: { profile: true } }, workouts: { orderBy: { orderIndex: 'asc' }, include: { exercises: { orderBy: { orderIndex: 'asc' } } } } },
  });
  if (!plan) notFound();
  const { ok } = await canViewClientDocument(plan.userId);
  if (!ok) notFound();

  const client = `${plan.user.firstName} ${plan.user.lastName}`;
  const p = plan.user.profile;

  return (
    <>
      <PrintToolbar title={`${client} · ${plan.title}`} />
      {plan.workouts.map((w, i) => (
        <PrintSheet key={w.id} footerLeft={client} docTitle="Training programme">
          {i === 0 && (
            <div className="mb-6">
              <p className="label-xs text-[var(--brand-green-900)]">Training programme</p>
              <h1 className="text-[20pt] font-extrabold leading-tight mt-1">{plan.title}</h1>
              <p className="text-[10pt] text-[var(--brand-stone-500)] mt-1">
                {client} · {goalLabel(plan.goal)} · {plan.durationWeeks} weeks · {plan.workouts.length} days a week{p?.trainingEnvironment ? ` · ${p.trainingEnvironment.toLowerCase()}` : ''}
              </p>
              <p className="text-[9.5pt] text-[var(--brand-stone-500)] mt-2">RPE is effort out of 10. RIR is reps left in the tank at the end of a set. Rest is between working sets. Tempo is seconds lowering-pause-lifting.</p>
              <div className="h-px w-16 bg-[var(--brand-champagne)] mt-3" />
            </div>
          )}
          <h2 className="text-[14pt] font-bold">{w.dayName} · {w.title}</h2>
          {w.notes && <p className="text-[9.5pt] text-[var(--brand-stone-500)] mt-1">{w.notes}</p>}
          <table className="w-full text-[9.5pt] mt-3">
            <thead>
              <tr className="text-left text-[8pt] uppercase tracking-wider text-[var(--brand-stone-500)] border-b border-[var(--brand-champagne)]">
                <th className="py-1.5 pr-2 font-bold">Exercise</th>
                <th className="py-1.5 pr-2 font-bold">Sets</th>
                <th className="py-1.5 pr-2 font-bold">Reps</th>
                <th className="py-1.5 pr-2 font-bold">Rest</th>
                <th className="py-1.5 pr-2 font-bold">Tempo</th>
                <th className="py-1.5 pr-2 font-bold">RPE / RIR</th>
                <th className="py-1.5 font-bold">Progression and coach notes</th>
              </tr>
            </thead>
            <tbody>
              {w.exercises.map((ex) => (
                <tr key={ex.id} className="border-b border-line align-top avoid-break">
                  <td className="py-2 pr-2 font-semibold">{ex.name}</td>
                  <td className="py-2 pr-2">{ex.sets}</td>
                  <td className="py-2 pr-2">{ex.reps}</td>
                  <td className="py-2 pr-2">{ex.restSeconds} s</td>
                  <td className="py-2 pr-2">{ex.tempo || '—'}</td>
                  <td className="py-2 pr-2">{ex.rpe != null ? `RPE ${ex.rpe}` : ''}{ex.rpe != null && ex.rir != null ? ' / ' : ''}{ex.rir != null ? `${ex.rir} RIR` : ''}{ex.rpe == null && ex.rir == null ? '—' : ''}</td>
                  <td className="py-2 text-[var(--brand-stone-500)]">
                    {ex.progressionGuidance && <span className="block">{ex.progressionGuidance}</span>}
                    {(ex.coachNotes || ex.notes) && <span className="block">{ex.coachNotes || ex.notes}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 text-[9pt] text-[var(--brand-stone-500)]">
            <p className="font-semibold text-[var(--brand-charcoal)] mb-1">Log</p>
            <div className="grid grid-cols-4 gap-2">
              {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((wk) => <div key={wk} className="h-14 rounded-lg border border-line p-1.5">{wk}</div>)}
            </div>
          </div>
          {i === plan.workouts.length - 1 && <p className="mt-6 text-[9pt] text-[var(--brand-stone-500)]">Questions about form or substitutions go to {BRAND.coachName} at your weekly check-in.</p>}
        </PrintSheet>
      ))}
    </>
  );
}
