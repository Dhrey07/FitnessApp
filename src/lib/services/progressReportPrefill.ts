import { prisma } from '@/lib/db';

const avg = (xs: (number | null | undefined)[]) => {
  const v = xs.filter((x): x is number => typeof x === 'number' && !Number.isNaN(x));
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
};

/**
 * Draft a progress report from the client's profile and their last four check-ins
 * (or the four ending at a given check-in). The coach edits everything before publishing.
 */
export async function buildProgressReportDraft(userId: string, checkInId?: string | null) {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) return null;

  let anchorDate: Date | undefined;
  if (checkInId) {
    const anchor = await prisma.weeklyCheckIn.findUnique({ where: { id: checkInId } });
    if (anchor && anchor.userId === userId) anchorDate = anchor.checkInDate;
  }

  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { userId, ...(anchorDate ? { checkInDate: { lte: anchorDate } } : {}) },
    orderBy: { checkInDate: 'desc' },
    take: 4,
  });
  const latest = checkIns[0];
  const oldest = checkIns[checkIns.length - 1];

  const firstRecord = await prisma.progressRecord.findFirst({ where: { userId }, orderBy: { recordDate: 'asc' } });

  const periodEnd = latest?.checkInDate ?? new Date();
  const periodStart = profile.programmeStartDate ?? oldest?.checkInDate ?? new Date(periodEnd.getTime() - 28 * 86400000);

  const trainingPct = checkIns.map((c) =>
    c.trainingSessionsCompleted != null && c.trainingSessionsPlanned
      ? Math.round((c.trainingSessionsCompleted / c.trainingSessionsPlanned) * 100)
      : c.workoutAdherence
  );

  const join = (xs: (string | null)[]) => xs.filter(Boolean).map((s) => `• ${s}`).join('\n') || '';

  return {
    periodStart: periodStart.toISOString().slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10),
    startingWeightKg: profile.startingWeightKg ?? firstRecord?.weightKg ?? profile.weightKg,
    currentWeightKg: latest?.currentWeightKg ?? profile.weightKg,
    waistCm: latest?.waistCm ?? profile.waistCm,
    averageSteps: avg(checkIns.map((c) => c.averageDailySteps)) ?? profile.averageDailySteps ?? null,
    trainingConsistency: Math.round(avg(trainingPct) ?? 0),
    nutritionAdherence: Math.round(avg(checkIns.map((c) => c.nutritionAdherence)) ?? 0),
    hunger: avg(checkIns.map((c) => c.hungerLevel)),
    energy: avg(checkIns.map((c) => c.energyLevel)),
    sleep: avg(checkIns.map((c) => c.sleepQuality)),
    strengthPerformance: '',
    challenges: join(checkIns.map((c) => c.challenges)),
    wins: join(checkIns.map((c) => c.wins)),
    coachAssessment: '',
    nextAdjustments: '',
    checkInsUsed: checkIns.length,
  };
}
