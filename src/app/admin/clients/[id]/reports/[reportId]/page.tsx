'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { DownloadPdfButton } from '@/components/brand/DownloadPdfButton';
import { ProgressReportForm, toValues, type ReportValues } from '@/components/reports/ProgressReportForm';

export default function EditReportPage({ params }: { params: Promise<{ id: string; reportId: string }> }) {
  const { id, reportId } = use(params);
  const [report, setReport] = useState<any>(null);

  const load = async () => {
    const r = await fetch(`/api/admin/progress-reports/${reportId}`);
    const data = await r.json();
    setReport(data.report || null);
  };
  useEffect(() => { load(); }, [reportId]); // eslint-disable-line react-hooks/exhaustive-deps

  const patch = async (body: any) => {
    const res = await fetch(`/api/admin/progress-reports/${reportId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not save');
    await load();
  };

  const name = report?.user ? `${report.user.firstName} ${report.user.lastName}` : '';

  return (
    <AdminAppShell title={name ? `Progress report: ${name}` : 'Progress report'} subtitle="Edit, publish, or download the branded PDF.">
      <div className="flex items-center justify-between gap-3">
        <Link href={`/admin/clients/${id}/reports`} className="text-xs text-brand hover:underline inline-flex items-center gap-1.5 font-semibold"><ArrowLeft size={14} /> All reports for this client</Link>
        <DownloadPdfButton href={`/print/progress-report/${reportId}`} />
      </div>
      {report ? (
        <ProgressReportForm
          key={report.updatedAt}
          initial={toValues(report)}
          publishedAt={report.publishedAt}
          onSave={(values: ReportValues, publish) => patch({ ...values, publish })}
          onUnpublish={() => patch({ publish: false })}
        />
      ) : (
        <div className="surface p-6 text-sm text-ink-muted">Loading…</div>
      )}
    </AdminAppShell>
  );
}
