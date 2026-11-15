import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

/** Coach-only: update a client's programme framing (starting/target weight, duration, start date, steps). */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getSessionUser();
  if (!me || (me.role !== 'COACH' && me.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Coach access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const num = (v: unknown) => (v == null || v === '' ? null : Number(v));
    const data: Record<string, unknown> = {};
    if ('startingWeightKg' in body) data.startingWeightKg = num(body.startingWeightKg);
    if ('targetWeightKg' in body) data.targetWeightKg = num(body.targetWeightKg);
    if ('averageDailySteps' in body) data.averageDailySteps = num(body.averageDailySteps) == null ? null : Math.round(Number(body.averageDailySteps));
    if ('programmeDurationWeeks' in body) data.programmeDurationWeeks = num(body.programmeDurationWeeks) == null ? null : Math.round(Number(body.programmeDurationWeeks));
    if ('programmeStartDate' in body) data.programmeStartDate = body.programmeStartDate ? new Date(body.programmeStartDate) : null;

    const profile = await prisma.profile.update({ where: { userId: id }, data });

    await prisma.auditLog.create({
      data: { actorId: me.id, action: 'UPDATE_PROGRAMME_TARGETS', entityType: 'Profile', entityId: profile.id, details: JSON.stringify(data) },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error updating client targets:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
