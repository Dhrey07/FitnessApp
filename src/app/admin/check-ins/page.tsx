import type { Metadata } from 'next';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { prisma } from '@/lib/db';
import { requireCoach } from '@/lib/coach/data';
import { CheckInReview, type ReviewItem } from './CheckInReview';

export const metadata: Metadata = { title: 'Check-ins' };
export const dynamic = 'force-dynamic';

export default async function CheckInsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireCoach();
  const { id } = await searchParams;

  const [pending, reviewed] = await Promise.all([
    prisma.weeklyCheckIn.findMany({ where: { status: 'PENDING_REVIEW' }, orderBy: { checkInDate: 'asc' }, include: { user: { include: { profile: true } } } }),
    prisma.weeklyCheckIn.findMany({ where: { status: 'REVIEWED' }, orderBy: { reviewedAt: 'desc' }, take: 20, include: { user: { include: { profile: true } } } }),
  ]);
  // If a specific check-in was linked and is not in either list, include it.
  const linked = id && ![...pending, ...reviewed].some((c) => c.id === id)
    ? await prisma.weeklyCheckIn.findUnique({ where: { id }, include: { user: { include: { profile: true } } } })
    : null;

  const all = [...pending, ...reviewed, ...(linked ? [linked] : [])];
  const items: ReviewItem[] = await Promise.all(
    all.map(async (c) => {
      const prev = await prisma.weeklyCheckIn.findFirst({ where: { userId: c.userId, checkInDate: { lt: c.checkInDate } }, orderBy: { checkInDate: 'desc' }, select: { currentWeightKg: true, waistCm: true } });
      return {
        id: c.id,
        userId: c.userId,
        name: `${c.user.firstName} ${c.user.lastName}`,
        firstName: c.user.firstName,
        date: c.checkInDate.toISOString(),
        status: c.status,
        weightKg: c.currentWeightKg,
        waistCm: c.waistCm,
        prevWeightKg: prev?.currentWeightKg ?? null,
        prevWaistCm: prev?.waistCm ?? null,
        steps: c.averageDailySteps,
        sessions: c.trainingSessionsPlanned ? `${c.trainingSessionsCompleted ?? 0} of ${c.trainingSessionsPlanned}` : `${c.workoutAdherence}%`,
        nutrition: c.nutritionAdherence,
        hunger: c.hungerLevel,
        energy: c.energyLevel,
        sleep: c.sleepQuality,
        stress: c.stressLevel,
        wins: c.wins,
        challenges: c.challenges,
        helpNeeded: c.helpNeeded || c.generalFeedback,
        summary: c.aiTrendsSummary,
        feedback: c.coachFeedback,
        calories: Math.round(c.user.profile?.dailyCalories ?? 0),
      };
    })
  );

  return (
    <AdminAppShell title="Check-ins" subtitle={pending.length ? `${pending.length} waiting for your feedback.` : 'All caught up.'} hideTitle>
      <CheckInReview items={items} initialId={id ?? pending[0]?.id ?? null} linked={Boolean(id)} pendingCount={pending.length} />
    </AdminAppShell>
  );
}
