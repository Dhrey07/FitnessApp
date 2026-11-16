import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Download } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { Menu } from '@/components/ui/Menu';
import { toValues } from '@/lib/reportValues';
import { prisma } from '@/lib/db';
import { requireCoach } from '@/lib/coach/data';
import { ReportEditor } from '../_components/ReportEditor';

export const metadata: Metadata = { title: 'Progress report' };
export const dynamic = 'force-dynamic';

export default async function EditReportPage({ params }: { params: Promise<{ id: string; reportId: string }> }) {
  await requireCoach();
  const { id, reportId } = await params;
  const report = await prisma.progressReport.findUnique({ where: { id: reportId }, include: { user: { select: { firstName: true, lastName: true } } } });
  if (!report || report.userId !== id) notFound();
  const name = `${report.user.firstName} ${report.user.lastName}`;

  return (
    <AdminAppShell
      title={`Report · ${report.user.firstName}`}
      subtitle="Edit in place. Publishing notifies the client."
      back={
        <Link href={`/admin/clients/${id}`} aria-label={`Back to ${report.user.firstName}`} className="focus-ring h-11 w-11 rounded-full flex items-center justify-center text-ink-secondary">
          <ChevronLeft size={22} />
        </Link>
      }
      action={<Menu items={[{ label: 'Download PDF', icon: <Download size={16} />, href: `/print/progress-report/${reportId}?autoprint=1` }]} label="Report options" />}
    >
      <ReportEditor clientId={id} clientName={name} reportId={reportId} initial={toValues(report)} publishedAt={report.publishedAt ? report.publishedAt.toISOString() : null} />
    </AdminAppShell>
  );
}
