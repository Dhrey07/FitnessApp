import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { Avatar, EmptyState, ListRow, ListRows, Menu, Pill, Section } from '@/components/ui';
import { prisma } from '@/lib/db';
import { requireCoach } from '@/lib/coach/data';

export const metadata: Metadata = { title: 'Reports' };
export const dynamic = 'force-dynamic';

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

export default async function ReportsPage() {
  await requireCoach();
  const [reports, clients] = await Promise.all([
    prisma.progressReport.findMany({ orderBy: { periodEnd: 'desc' }, include: { user: { select: { id: true, firstName: true, lastName: true } } } }),
    prisma.user.findMany({ where: { role: 'CLIENT' }, orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
  ]);
  const drafts = reports.filter((r) => !r.publishedAt);
  const published = reports.filter((r) => r.publishedAt);

  const row = (r: (typeof reports)[number]) => (
    <ListRow
      key={r.id}
      href={`/admin/clients/${r.userId}/reports/${r.id}`}
      leading={<Avatar name={`${r.user.firstName} ${r.user.lastName}`} size="sm" />}
      title={`${r.user.firstName} ${r.user.lastName}`}
      subtitle={`${fmt(r.periodStart)} to ${fmt(r.periodEnd)} · ${r.startingWeightKg} to ${r.currentWeightKg} kg · training ${r.trainingConsistency}%`}
      trailing={r.publishedAt ? <Pill tone="approved">Published</Pill> : <Pill tone="pending">Draft</Pill>}
    />
  );

  return (
    <AdminAppShell
      title="Reports"
      subtitle="Monthly progress reports with the numbers, your assessment and the next adjustments."
      action={
        <Menu
          label="Start a report"
          items={clients.map((c) => ({ label: `New report for ${c.firstName} ${c.lastName}`, href: `/admin/clients/${c.id}/reports/new` }))}
          trigger={<button type="button" className="focus-ring h-10 px-4 rounded-full bg-brand-strong text-brand-on-strong text-sm font-semibold">New report</button>}
        />
      }
    >
      {reports.length === 0 && <EmptyState message="No reports yet. Start one from a client, or from a reviewed check-in." />}
      {drafts.length > 0 && (
        <Section title={`Drafts (${drafts.length})`} first>
          <ListRows>{drafts.map(row)}</ListRows>
        </Section>
      )}
      {published.length > 0 && (
        <Section title="Published" first={drafts.length === 0}>
          <ListRows>{published.map(row)}</ListRows>
        </Section>
      )}
      <p className="t-caption flex items-center gap-1.5"><Download size={12} aria-hidden /> Each report has a branded PDF in its menu.</p>
    </AdminAppShell>
  );
}
