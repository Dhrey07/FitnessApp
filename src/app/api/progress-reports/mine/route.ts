import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { hasFeatureEntitlement, getUpgradeMessage, type PlanTier } from '@/lib/services/entitlements';

/** Client: own published reports. Progress reports are a Private Coaching feature. */
export async function GET() {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const tier = (me.subscriptions?.[0]?.planTier || 'FREE') as PlanTier;
  if (me.role === 'CLIENT' && !hasFeatureEntitlement(tier, 'progress_reports')) {
    return NextResponse.json({ error: getUpgradeMessage('progress_reports'), requiresUpgrade: true }, { status: 403 });
  }
  const reports = await prisma.progressReport.findMany({
    where: { userId: me.id, publishedAt: { not: null } },
    orderBy: { periodEnd: 'desc' },
  });
  return NextResponse.json({ reports });
}
