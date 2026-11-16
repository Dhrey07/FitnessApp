import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { canViewClientDocument } from '@/lib/printAuth';
import { BRAND } from '@/lib/brand';
import { PrintSheet } from '@/components/print/PrintSheet';
import { PrintToolbar } from '@/components/print/PrintChrome';

export const dynamic = 'force-dynamic';

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function ProgressReportPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await prisma.progressReport.findUnique({ where: { id }, include: { user: { include: { profile: true } }, coach: true } });
  if (!r) notFound();
  const { ok, me } = await canViewClientDocument(r.userId);
  if (!ok) notFound();
  // Clients only see published reports
  if (me && me.role === 'CLIENT' && !r.publishedAt) notFound();

  const client = `${r.user.firstName} ${r.user.lastName}`;
  const delta = Math.round((r.currentWeightKg - r.startingWeightKg) * 10) / 10;
  const target = r.user.profile?.targetWeightKg;

  const metrics: [string, string][] = [
    ['Starting weight', `${r.startingWeightKg} kg`],
    ['Current weight', `${r.currentWeightKg} kg (${delta > 0 ? '+' : ''}${delta} kg)`],
    ['Waist measurement', `${r.waistCm} cm`],
    ['Average steps', r.averageSteps ? r.averageSteps.toLocaleString() : '—'],
    ['Training consistency', `${r.trainingConsistency}%`],
    ['Nutrition adherence', `${r.nutritionAdherence}%`],
    ['Hunger', r.hunger != null ? `${r.hunger} / 5` : '—'],
    ['Energy', r.energy != null ? `${r.energy} / 5` : '—'],
    ['Sleep', r.sleep != null ? `${r.sleep} / 5` : '—'],
    ['Strength / performance', r.strengthPerformance || '—'],
  ];

  return (
    <>
      <PrintToolbar title={`${client} · Progress report`} />
      <PrintSheet footerLeft={client} docTitle="Progress report">
        <div className="space-y-6">
          <div>
            <p className="t-overline !text-[var(--brand-green-900)]">Progress report</p>
            <h1 className="font-display text-[22pt] font-bold leading-[1.1] tracking-[-0.02em] mt-1">{client}</h1>
            <p className="text-[10.5pt] text-[var(--brand-stone-500)] mt-1">{fmt(r.periodStart)} to {fmt(r.periodEnd)}{target ? ` · target weight ${target} kg` : ''}</p>
            <div className="h-px w-16 bg-[var(--brand-champagne)] mt-3" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[['Weight change', `${delta > 0 ? '+' : ''}${delta} kg`], ['Waist', `${r.waistCm} cm`], ['Training', `${r.trainingConsistency}%`]].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line p-3">
                <p className="text-[8.5pt] uppercase tracking-wider text-[var(--brand-stone-500)]">{k}</p>
                <p className="font-display text-[16pt] font-bold tnum">{v}</p>
              </div>
            ))}
          </div>

          <table className="w-full text-[10.5pt]">
            <tbody>
              {metrics.map(([k, v]) => (
                <tr key={k} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 text-left font-semibold text-[var(--brand-stone-500)] w-[40%]">{k}</th>
                  <td className="py-2 font-semibold">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(r.challenges || r.wins) && (
            <div className="grid grid-cols-2 gap-4 text-[10.5pt]">
              <div><h3 className="font-bold mb-1">Challenges</h3><p className="whitespace-pre-line text-[var(--brand-stone-500)]">{r.challenges || '—'}</p></div>
              <div><h3 className="font-bold mb-1">Wins</h3><p className="whitespace-pre-line text-[var(--brand-stone-500)]">{r.wins || '—'}</p></div>
            </div>
          )}

          <div className="rounded-xl bg-[var(--brand-offwhite)] p-4 space-y-3 avoid-break">
            <h3 className="font-bold">Coach assessment</h3>
            <p className="whitespace-pre-line">{r.coachAssessment}</p>
          </div>
          <div className="rounded-xl border-l-4 border-[var(--brand-green-900)] pl-4 py-1 space-y-2 avoid-break">
            <h3 className="font-bold">Next adjustments</h3>
            <p className="whitespace-pre-line">{r.nextAdjustments}</p>
          </div>

          <div className="pt-4 flex items-end justify-between text-[9.5pt] text-[var(--brand-stone-500)]">
            <div>
              <p className="font-semibold text-[var(--brand-charcoal)]">{BRAND.coachName}</p>
              <p>Head coach, {BRAND.legalName}</p>
            </div>
            <p>{r.publishedAt ? `Published ${fmt(r.publishedAt)}` : 'Draft'}</p>
          </div>
        </div>
      </PrintSheet>
    </>
  );
}
