import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { emptyReport, toValues } from '@/lib/reportValues';
import { prisma } from '@/lib/db';
import { requireCoach } from '@/lib/coach/data';
import { buildProgressReportDraft } from '@/lib/services/progressReportPrefill';
import { ReportEditor } from '../_components/ReportEditor';

export const metadata: Metadata = { title: 'New progress report' };
export const dynamic = 'force-dynamic';

export default async function NewReportPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ checkInId?: string }> }) {
  await requireCoach();
  const { id } = await params;
  const { checkInId } = await searchParams;
  const client = await prisma.user.findUnique({ where: { id }, select: { firstName: true, lastName: true, role: true } });
  if (!client || client.role !== 'CLIENT') notFound();
  const draft = await buildProgressReportDraft(id, checkInId ?? null);
  const name = `${client.firstName} ${client.lastName}`;

  return (
    <AdminAppShell
      title="New progress report"
      subtitle={draft?.checkInsUsed ? `Prefilled from ${client.firstName}'s profile and last ${draft.checkInsUsed} ${draft.checkInsUsed === 1 ? 'check-in' : 'check-ins'}. Edit anything before publishing.` : 'Fill in the period and the numbers, then write the assessment.'}
      back={
        <Link href={`/admin/clients/${id}`} aria-label={`Back to ${client.firstName}`} className="focus-ring h-11 w-11 rounded-full flex items-center justify-center text-ink-secondary">
          <ChevronLeft size={22} />
        </Link>
      }
    >
      <ReportEditor clientId={id} clientName={name} initial={draft ? toValues(draft) : emptyReport} />
    </AdminAppShell>
  );
}
