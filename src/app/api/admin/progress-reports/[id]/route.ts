import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCoach } from '@/lib/printAuth';
import { reportDataFromBody } from '@/lib/services/progressReportBody';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await isCoach();
  if (!me) return NextResponse.json({ error: 'Coach access required' }, { status: 403 });
  const { id } = await params;
  const report = await prisma.progressReport.findUnique({ where: { id }, include: { user: { select: { id: true, firstName: true, lastName: true } } } });
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ report });
}

/** Coach: update fields and/or change publication (`publish: true | false`). */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await isCoach();
  if (!me) return NextResponse.json({ error: 'Coach access required' }, { status: 403 });
  const { id } = await params;
  try {
    const body = await request.json();
    const existing = await prisma.progressReport.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: Record<string, unknown> = body.periodStart ? reportDataFromBody(body) : {};
    let notify = false;
    if (body.publish === true) {
      const assessment = String(body.coachAssessment ?? existing.coachAssessment ?? '').trim();
      const next = String(body.nextAdjustments ?? existing.nextAdjustments ?? '').trim();
      if (!assessment || !next) return NextResponse.json({ error: 'Coach assessment and next adjustments are required to publish' }, { status: 400 });
      if (!existing.publishedAt) { data.publishedAt = new Date(); notify = true; }
    } else if (body.publish === false) {
      data.publishedAt = null;
    }

    const report = await prisma.progressReport.update({ where: { id }, data });
    if (notify) {
      await prisma.notification.create({
        data: { userId: report.userId, title: 'Your progress report is ready', message: 'Your coach has published a progress report with an assessment and next adjustments.', link: '/client/progress' },
      });
    }
    await prisma.auditLog.create({ data: { actorId: me.id, action: notify ? 'PUBLISH_PROGRESS_REPORT' : 'UPDATE_PROGRESS_REPORT', entityType: 'ProgressReport', entityId: id } });
    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error updating progress report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
