import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSessionUser, isCoachRole } from '@/lib/auth';
import { calculateTrialInfo, hasFeatureEntitlement, hasTrainingAccess, planTierLabel, type PlanTier } from '@/lib/services/entitlements';

/**
 * Server-side data for the client app. Every helper scopes to the signed-in
 * client; pages call requireClient() first.
 */

export type ClientUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;

export async function requireClient(): Promise<ClientUser> {
  const me = await getSessionUser();
  if (!me) redirect('/login');
  if (isCoachRole(me.role)) redirect('/admin/dashboard');
  return me;
}

export function subscriptionOf(me: ClientUser) {
  return me.subscriptions[0] ?? { planTier: 'FREE', status: 'ACTIVE', isTrial: false, trialStartDate: null, trialEndDate: null };
}

export function shellUserOf(me: ClientUser) {
  const sub = subscriptionOf(me);
  const trial = calculateTrialInfo(sub);
  return {
    name: `${me.firstName} ${me.lastName}`.trim(),
    email: me.email,
    avatarUrl: me.avatarUrl,
    detail: trial.isTrial && trial.isActive ? `Trial · day ${trial.currentDay} of 14` : planTierLabel(sub.planTier),
    trialInfo: trial,
  };
}

export function entitlementsOf(me: ClientUser) {
  const sub = subscriptionOf(me);
  const tier = (sub.planTier ?? 'FREE') as PlanTier;
  const trial = calculateTrialInfo(sub);
  // During an active trial the client has Signature access.
  const effective: PlanTier = trial.isTrial && trial.isActive ? 'GOLD' : tier;
  return {
    training: hasTrainingAccess(sub),
    mealPlan: hasFeatureEntitlement(effective, 'personalised_nutrition'),
    checkIn: hasFeatureEntitlement(effective, 'weekly_checkin') || (trial.isTrial && trial.isActive),
    reports: hasFeatureEntitlement(effective, 'progress_reports'),
    tier,
    trial,
  };
}

/** Week of the programme, 1-based and capped at the programme length. */
export function programmeWeek(me: ClientUser) {
  const total = me.profile?.programmeDurationWeeks ?? 12;
  const start = me.profile?.programmeStartDate ?? me.profile?.createdAt ?? me.createdAt;
  const days = Math.floor((Date.now() - new Date(start).getTime()) / 86400000);
  const week = Math.min(total, Math.max(1, Math.floor(days / 7) + 1));
  return { week, total, start: new Date(start) };
}

export async function getCheckIns(userId: string, take = 12) {
  return prisma.weeklyCheckIn.findMany({ where: { userId }, orderBy: { checkInDate: 'desc' }, take });
}

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Meals between two dates, newest first, with the coach's numbers when reviewed. */
export async function getMeals(userId: string, from: Date, to: Date) {
  const rows = await prisma.foodSubmission.findMany({
    where: { userId, createdAt: { gte: from, lt: to } },
    orderBy: { createdAt: 'asc' },
    include: { foodAnalysis: true, coachReview: true },
  });
  return rows.map((r) => {
    const review = r.coachReview;
    const ai = r.foodAnalysis;
    return {
      id: r.id,
      mealType: r.mealType,
      text: r.rawInput,
      imageUrl: r.imageUrl,
      createdAt: r.createdAt.toISOString(),
      status: r.status,
      kcal: Math.round(review?.finalCalories ?? ai?.estimatedCalories ?? 0),
      protein: Math.round(review?.finalProtein ?? ai?.estimatedProtein ?? 0),
      carbs: Math.round(review?.finalCarbs ?? ai?.estimatedCarbs ?? 0),
      fat: Math.round(review?.finalFat ?? ai?.estimatedFat ?? 0),
      coachFeedback: review?.coachFeedback ?? null,
      reviewed: Boolean(review),
    };
  });
}

export type Meal = Awaited<ReturnType<typeof getMeals>>[number];

export async function getTodayMeals(userId: string) {
  const from = startOfDay();
  const to = new Date(from.getTime() + 86400000);
  return getMeals(userId, from, to);
}

export async function getWorkoutPlan(userId: string) {
  return prisma.workoutPlan.findFirst({
    where: { userId, active: true },
    orderBy: { createdAt: 'desc' },
    include: {
      workouts: {
        orderBy: { orderIndex: 'asc' },
        include: {
          exercises: { orderBy: { orderIndex: 'asc' } },
          workoutLogs: { where: { userId }, orderBy: { completedAt: 'desc' }, take: 6 },
        },
      },
    },
  });
}

export type WorkoutPlanData = NonNullable<Awaited<ReturnType<typeof getWorkoutPlan>>>;

/** The session after the most recently completed one; the first if none yet. */
export function nextWorkoutIndex(plan: WorkoutPlanData | null) {
  if (!plan || plan.workouts.length === 0) return -1;
  let latestIdx = -1;
  let latest = 0;
  plan.workouts.forEach((w, i) => {
    const t = w.workoutLogs[0]?.completedAt ? new Date(w.workoutLogs[0].completedAt).getTime() : 0;
    if (t > latest) {
      latest = t;
      latestIdx = i;
    }
  });
  return latestIdx === -1 ? 0 : (latestIdx + 1) % plan.workouts.length;
}

export async function getMealPlan(userId: string) {
  return prisma.mealPlan.findFirst({
    where: { userId, active: true },
    orderBy: { createdAt: 'desc' },
    include: { items: { orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }] } },
  });
}

/** Next Sunday (today if it is Sunday) and whether this week's check-in is in. */
export function checkInWindow(latest: { checkInDate: Date } | undefined) {
  const now = new Date();
  const due = new Date(now);
  due.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  due.setHours(0, 0, 0, 0);
  const weekStart = new Date(due.getTime() - 6 * 86400000);
  const submitted = Boolean(latest && new Date(latest.checkInDate) >= weekStart);
  const label = due.toDateString() === startOfDay(now).toDateString() ? 'today' : due.toLocaleDateString('en-GB', { weekday: 'long' });
  return { due, submitted, label };
}

export function timeAgo(d: Date | string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? 'last week' : `${weeks} weeks ago`;
}
