'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { ProgressReportForm, emptyReport, toValues, type ReportValues } from '@/components/reports/ProgressReportForm';

export default function NewReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const search = useSearchParams();
  const checkInId = search.get('checkInId');
  const [initial, setInitial] = useState<ReportValues | null>(null);
  const [used, setUsed] = useState(0);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/admin/progress-reports?prefill=1&userId=${id}${checkInId ? `&checkInId=${checkInId}` : ''}`);
      const data = await r.json();
      setInitial(data.draft ? toValues(data.draft) : emptyReport);
      setUsed(data.draft?.checkInsUsed || 0);
    })();
  }, [id, checkInId]);

  const save = async (values: ReportValues, publish: boolean) => {
    const res = await fetch('/api/admin/progress-reports', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, ...values, publish }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not save');
    router.push(`/admin/clients/${id}/reports/${data.report.id}`);
  };

  return (
    <AdminAppShell title="New progress report" subtitle={used ? `Prefilled from the profile and the last ${used} check-in${used === 1 ? '' : 's'}. Edit anything before publishing.` : 'Fill in the period and the numbers, then write the assessment.'}>
      <Link href={`/admin/clients/${id}/reports`} className="text-xs text-brand hover:underline inline-flex items-center gap-1.5 font-semibold"><ArrowLeft size={14} /> All reports for this client</Link>
      {initial ? <ProgressReportForm initial={initial} onSave={save} /> : <div className="surface p-6 text-sm text-ink-muted">Preparing the draft…</div>}
    </AdminAppShell>
  );
}
