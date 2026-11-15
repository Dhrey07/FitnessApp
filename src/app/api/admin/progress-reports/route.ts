import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCoach } from '@/lib/printAuth';
import { buildProgressReportDraft } from '@/lib/services/progressReportPrefill';
import { reportDataFromBody } from '@/lib/services/progressReportBody';

/** Coach: list reports (optionally for one client) or get a prefilled draft (?prefill=1&userId=&checkInId=). */
export async function GET(request: Request) {
  const me = await isCoach();
  if (!me) return NextResponse.json({ error: 'Coach access required' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (searchParams.get('prefill') === '1') {
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    const draft = await buildProgressReportDraft(userId, searchParams.get('checkInId'));
    if (!draft) return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
    return NextResponse.json({ draft });
  }

  const reports = await prisma.progressReport.findMany({
    where: userId ? { userId } : undefined,
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    orderBy: { periodEnd: 'desc' },
  });
  return NextResponse.json({ reports });
}

/** Coach: create a report (draft by default; `publish: true` publishes and notifies the client). */
export async function POST(request: Request) {
  const me = await isCoach();
  if (!me) return NextResponse.json({ error: 'Coach access required' }, { status: 403 });
  try {
    const body = await request.json();
    if (!body.userId || !body.periodStart || !body.periodEnd) {
      return NextResponse.json({ error: 'userId, periodStart and periodEnd are required' }, { status: 400 });
    }
    const publish = body.publish === true;
    const data = reportDataFromBody(body);
    if (publish && (!data.coachAssessment.trim() || !data.nextAdjustments.trim())) {
      return NextResponse.json({ error: 'Coach assessment and next adjustments are required to publish' }, { status: 400 });
    }
    const report = await prisma.progressReport.create({
      data: { userId: body.userId, coachId: me.id, ...data, publishedAt: publish ? new Date() : null },
    });
    if (publish) {
      await prisma.notification.create({
        data: { userId: body.userId, title: 'Your progress report is ready', message: 'Your coach has published a progress report with an assessment and next adjustments.', link: '/client/progress' },
      });
    }
    await prisma.auditLog.create({ data: { actorId: me.id, action: publish ? 'PUBLISH_PROGRESS_REPORT' : 'CREATE_PROGRESS_REPORT', entityType: 'ProgressReport', entityId: report.id } });
    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error creating progress report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
