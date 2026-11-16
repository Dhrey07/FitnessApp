import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSessionUser, isCoachRole } from '@/lib/auth';
import { PLAN_DETAILS, calculateTrialInfo, planTierLabel, type PlanTier } from '@/lib/services/entitlements';

/** Server-side data for the coach app. Pages call requireCoach() first. */

export async function requireCoach() {
  const me = await getSessionUser();
  if (!me) redirect('/login?role=coach');
  if (!isCoachRole(me.role)) redirect('/client/dashboard');
  return me;
}

export function planLabelFor(sub: { planTier: string; isTrial: boolean; status: string; trialEndDate?: Date | null } | undefined) {
  if (!sub) return 'Starter';
  if (sub.isTrial) {
    const t = calculateTrialInfo(sub);
    return t.isActive ? `Trial · day ${t.currentDay}` : 'Trial ended';
  }
  return planTierLabel(sub.planTier);
}

/** Every client with what the coach needs at a glance. */
export async function getClientsOverview() {
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    orderBy: { firstName: 'asc' },
    include: {
      profile: true,
      subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
      weeklyCheckIns: { orderBy: { checkInDate: 'desc' }, take: 8, select: { id: true, checkInDate: true, currentWeightKg: true, waistCm: true, status: true } },
      foodSubmissions: { orderBy: { createdAt: 'desc' }, take: 1, select: { createdAt: true } },
      workoutLogs: { orderBy: { completedAt: 'desc' }, take: 1, select: { completedAt: true } },
    },
  });

  return clients.map((c) => {
    const sub = c.subscriptions[0];
    const lastCheckIn = c.weeklyCheckIns[0]?.checkInDate ?? null;
    const lastMeal = c.foodSubmissions[0]?.createdAt ?? null;
    const lastWorkout = c.workoutLogs[0]?.completedAt ?? null;
    const times = [lastCheckIn, lastMeal, lastWorkout].filter(Boolean).map((d) => new Date(d as Date).getTime());
    const lastActive = times.length ? new Date(Math.max(...times)) : null;
    return {
      id: c.id,
      name: `${c.firstName} ${c.lastName}`.trim(),
      firstName: c.firstName,
      email: c.email,
      phone: c.phone,
      avatarUrl: c.avatarUrl,
      tier: (sub?.planTier ?? 'FREE') as PlanTier,
      plan: planLabelFor(sub),
      isTrial: Boolean(sub?.isTrial),
      goal: c.profile?.primaryGoal ?? null,
      weightKg: c.weeklyCheckIns[0]?.currentWeightKg ?? c.profile?.weightKg ?? null,
      weights: [...c.weeklyCheckIns].reverse().map((w) => w.currentWeightKg),
      lastCheckIn: lastCheckIn ? lastCheckIn.toISOString() : null,
      pendingCheckIn: c.weeklyCheckIns.some((w) => w.status === 'PENDING_REVIEW'),
      lastActive: lastActive ? lastActive.toISOString() : null,
      joined: c.createdAt.toISOString(),
    };
  });
}

export type ClientSummary = Awaited<ReturnType<typeof getClientsOverview>>[number];

/** Pending check-ins with the client's previous check-in for deltas. */
export async function getPendingCheckIns() {
  const pending = await prisma.weeklyCheckIn.findMany({
    where: { status: 'PENDING_REVIEW' },
    orderBy: { checkInDate: 'asc' },
    include: { user: { select: { id: true, firstName: true, lastName: true, phone: true } } },
  });
  return Promise.all(
    pending.map(async (c) => {
      const prev = await prisma.weeklyCheckIn.findFirst({
        where: { userId: c.userId, checkInDate: { lt: c.checkInDate } },
        orderBy: { checkInDate: 'desc' },
        select: { currentWeightKg: true, waistCm: true },
      });
      return { ...c, prevWeightKg: prev?.currentWeightKg ?? null, prevWaistCm: prev?.waistCm ?? null };
    })
  );
}

export async function getPendingMeals() {
  return prisma.foodSubmission.findMany({
    where: { status: { in: ['AWAITING_COACH', 'PENDING', 'AI_PROCESSED'] } },
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { id: true, firstName: true, lastName: true } }, foodAnalysis: true },
  });
}

/** Monthly revenue and counts from current subscriptions. */
export async function getBusinessStats() {
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  let paid = 0;
  let trial = 0;
  let mrr = 0;
  for (const c of clients) {
    const s = c.subscriptions[0];
    if (!s || s.status !== 'ACTIVE') continue;
    if (s.isTrial) {
      if (calculateTrialInfo(s).isActive) trial++;
      continue;
    }
    const price = PLAN_DETAILS[s.planTier as PlanTier]?.priceNgn ?? 0;
    if (price > 0) {
      paid++;
      mrr += price;
    }
  }
  return { clients: clients.length, paid, trial, mrr };
}

export function daysSince(d: string | Date | null) {
  if (!d) return Infinity;
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}

export function relDay(d: string | Date | null) {
  const n = daysSince(d);
  if (n === Infinity) return 'never';
  if (n <= 0) return 'today';
  if (n === 1) return 'yesterday';
  if (n < 7) return `${n} days ago`;
  return new Date(d as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export const GOAL_LABEL: Record<string, string> = {
  FAT_LOSS: 'Fat loss',
  BODY_RECOMPOSITION: 'Recomposition',
  MUSCLE_GAIN: 'Muscle gain',
  STRENGTH_PERFORMANCE: 'Strength',
  GENERAL_HEALTH: 'General health',
  HEALTHY_WEIGHT_GAIN: 'Weight gain',
};
