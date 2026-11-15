'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { DownloadPdfButton } from '@/components/brand/DownloadPdfButton';

export default function ClientReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [reports, setReports] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/admin/progress-reports?userId=${id}`);
      const data = (await r.json()).reports || [];
      setReports(data);
      if (data[0]?.user) setName(`${data[0].user.firstName} ${data[0].user.lastName}`);
      else {
        const c = await fetch('/api/admin/clients?search=');
        const m = ((await c.json()).clients || []).find((x: any) => x.id === id);
        if (m) setName(`${m.firstName} ${m.lastName}`);
      }
    })();
  }, [id]);

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <AdminAppShell title={name ? `Progress reports: ${name}` : 'Progress reports'} subtitle="Drafts stay private to you until you publish.">
      <div className="flex items-center justify-between gap-3">
        <Link href={`/admin/clients/${id}`} className="text-xs text-brand hover:underline inline-flex items-center gap-1.5 font-semibold"><ArrowLeft size={14} /> Back to client profile</Link>
        <Link href={`/admin/clients/${id}/reports/new`} className="btn-brand text-xs"><Plus size={14} /> New report</Link>
      </div>
      {reports.length === 0 && <div className="surface p-6 text-sm text-ink-muted">No reports for this client yet.</div>}
      <div className="space-y-3">
        {reports.map((r) => (
          <article key={r.id} className="surface p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">{fmt(r.periodStart)} to {fmt(r.periodEnd)}</p>
              <p className="text-xs text-ink-muted">{r.startingWeightKg} kg to {r.currentWeightKg} kg · waist {r.waistCm} cm · training {r.trainingConsistency}% · nutrition {r.nutritionAdherence}%</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${r.publishedAt ? 'badge-approved' : 'badge-pending'}`}>{r.publishedAt ? 'Published' : 'Draft'}</span>
              <Link href={`/admin/clients/${id}/reports/${r.id}`} className="btn-secondary text-xs py-1.5 px-3">Open <ArrowRight size={12} /></Link>
              <DownloadPdfButton href={`/print/progress-report/${r.id}`} />
            </div>
          </article>
        ))}
      </div>
    </AdminAppShell>
  );
}
