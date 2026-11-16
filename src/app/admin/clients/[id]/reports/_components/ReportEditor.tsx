'use client';

import { useRouter } from 'next/navigation';
import { ProgressReportForm } from '@/components/reports/ProgressReportForm';
import type { ReportValues } from '@/lib/reportValues';

/** Wires the report document to the create and update APIs. */
export function ReportEditor({ clientId, clientName, reportId, initial, publishedAt }: { clientId: string; clientName: string; reportId?: string; initial: ReportValues; publishedAt?: string | null }) {
  const router = useRouter();

  const call = async (body: Record<string, unknown>) => {
    const res = await fetch(reportId ? `/api/admin/progress-reports/${reportId}` : '/api/admin/progress-reports', {
      method: reportId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportId ? body : { userId: clientId, ...body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not save the report.');
    if (!reportId && data.report?.id) router.replace(`/admin/clients/${clientId}/reports/${data.report.id}`);
    else router.refresh();
  };

  return (
    <ProgressReportForm
      key={publishedAt ?? 'draft'}
      initial={initial}
      clientName={clientName}
      publishedAt={publishedAt}
      onSave={(values: ReportValues, publish) => call({ ...values, publish })}
      onUnpublish={reportId ? () => call({ publish: false }) : undefined}
    />
  );
}
