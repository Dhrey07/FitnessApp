'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { DownloadPdfButton } from '@/components/brand/DownloadPdfButton';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [r, c] = await Promise.all([fetch('/api/admin/progress-reports'), fetch('/api/admin/clients?search=')]);
      setReports((await r.json()).reports || []);
      setClients((await c.json()).clients || []);
    })();
  }, []);

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <AdminAppShell title="Progress reports" subtitle="Branded reports with the period's numbers, your assessment and the next adjustments.">
      <div className="surface p-5 flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink-secondary">Start a report for</span>
        {clients.map((c) => (
          <Link key={c.id} href={`/admin/clients/${c.id}/reports/new`} className="btn-secondary text-xs py-1.5 px-3">{c.firstName} {c.lastName}</Link>
        ))}
      </div>

      {reports.length === 0 && <div className="surface p-6 text-sm text-ink-muted">No reports yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <article key={r.id} className="surface p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0"><FileText size={16} /></span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink truncate">{r.user?.firstName} {r.user?.lastName}</p>
                  <p className="text-xs text-ink-muted">{fmt(r.periodStart)} to {fmt(r.periodEnd)}</p>
                </div>
              </div>
              <span className={`badge ${r.publishedAt ? 'badge-approved' : 'badge-pending'}`}>{r.publishedAt ? 'Published' : 'Draft'}</span>
            </div>
            <p className="text-xs text-ink-secondary">{r.startingWeightKg} kg to {r.currentWeightKg} kg · waist {r.waistCm} cm · training {r.trainingConsistency}% · nutrition {r.nutritionAdherence}%</p>
            <div className="flex items-center gap-2">
              <Link href={`/admin/clients/${r.userId}/reports/${r.id}`} className="btn-secondary text-xs py-1.5 px-3">Open <ArrowRight size={12} /></Link>
              <DownloadPdfButton href={`/print/progress-report/${r.id}`} />
            </div>
          </article>
        ))}
      </div>
    </AdminAppShell>
  );
}
