'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { DownloadPdfButton } from '@/components/brand/DownloadPdfButton';

/** Client: published progress reports (a Private Coaching feature). */
export function ProgressReportsList() {
  const [state, setState] = useState<'loading' | 'ready' | 'upgrade' | 'error'>('loading');
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/progress-reports/mine');
        const data = await res.json();
        if (res.status === 403 && data.requiresUpgrade) return setState('upgrade');
        if (!res.ok) return setState('error');
        setReports(data.reports || []); setState('ready');
      } catch { setState('error'); }
    })();
  }, []);

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section className="surface p-6 space-y-4 w-full">
      <div>
        <p className="label-xs text-brand">Progress reports</p>
        <h3 className="section-title text-base mt-0.5">Your coach&apos;s written reports</h3>
      </div>
      {state === 'loading' && <p className="text-sm text-ink-muted">Loading…</p>}
      {state === 'error' && <p className="text-sm text-status-rejected">Could not load reports.</p>}
      {state === 'upgrade' && (
        <div className="p-4 rounded-xl bg-paper border border-line text-sm text-ink-secondary space-y-2">
          <p>Monthly progress reports, with a written coach assessment and the next adjustments, are part of Private Coaching.</p>
          <Link href="/client/profile#membership" className="btn-secondary text-xs inline-flex">See plans</Link>
        </div>
      )}
      {state === 'ready' && reports.length === 0 && <p className="text-sm text-ink-muted">No reports published yet.</p>}
      {state === 'ready' && reports.map((r) => (
        <article key={r.id} className="p-4 rounded-xl bg-paper border border-line space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center"><FileText size={16} /></span>
              <div>
                <p className="font-semibold text-ink text-sm">{fmt(r.periodStart)} to {fmt(r.periodEnd)}</p>
                <p className="text-xs text-ink-muted">{r.startingWeightKg} kg to {r.currentWeightKg} kg · waist {r.waistCm} cm</p>
              </div>
            </div>
            <DownloadPdfButton href={`/print/progress-report/${r.id}`} />
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed"><span className="font-semibold text-ink">Assessment:</span> {r.coachAssessment}</p>
          <p className="text-sm text-ink-secondary leading-relaxed"><span className="font-semibold text-ink">Next:</span> {r.nextAdjustments}</p>
        </article>
      ))}
    </section>
  );
}
