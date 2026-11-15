export type PlanTier = 'FREE' | 'SILVER' | 'GOLD' | 'DIAMOND';

export type FeatureKey =
  | 'food_police'
  | 'weekly_checkin'
  | 'personalised_nutrition'
  | 'personalised_training'
  | 'whatsapp_accountability'
  | 'one_on_one_coaching'
  | 'coaching_calls'
  | 'progress_reports';

export interface PlanDetails {
  tier: PlanTier;
  name: string;
  priceNgn: number;
  badge?: string;
  tagline: string;
  description: string;
  features: FeatureKey[];
  bulletPoints: string[];
}

export const PLAN_DETAILS: Record<PlanTier, PlanDetails> = {
  FREE: {
    tier: 'FREE',
    name: 'Starter',
    priceNgn: 0,
    tagline: 'Free for every registered client',
    description: 'Log meals in plain language or with a photo, get an instant estimate, and have a coach check it.',
    features: ['food_police'],
    bulletPoints: [
      'Meal logging by photo or plain description',
      'Instant calorie and macro estimate',
      'Nigerian and international foods recognised',
      'Coach checks portions and estimates',
      'Daily nutrition timeline',
    ],
  },
  SILVER: {
    tier: 'SILVER',
    name: 'Essential',
    priceNgn: 15000,
    tagline: 'Structure and weekly accountability',
    description: 'Weekly check-ins reviewed by your coach, with written feedback and monthly adjustments.',
    features: ['food_police', 'weekly_checkin'],
    bulletPoints: [
      'Everything in Starter',
      'Weekly check-in reviewed by your coach',
      'Written coach feedback each week',
      'Weight, waist and milestone tracking',
      'Monthly programme adjustments',
    ],
  },
  GOLD: {
    tier: 'GOLD',
    name: 'Signature',
    priceNgn: 25000,
    badge: 'Most chosen',
    tagline: 'Personalised nutrition, training and WhatsApp support',
    description: 'A personalised meal plan and training programme, with direct WhatsApp accountability.',
    features: [
      'food_police',
      'weekly_checkin',
      'personalised_nutrition',
      'personalised_training',
      'whatsapp_accountability',
    ],
    bulletPoints: [
      'Everything in Essential',
      'Personalised 4 or 5 day training programme (home or gym)',
      'Set, rep and load logging with progression guidance',
      'Personalised meal plan built on familiar foods',
      'Direct WhatsApp accountability with your coach',
    ],
  },
  DIAMOND: {
    tier: 'DIAMOND',
    name: 'Private Coaching',
    priceNgn: 40000,
    badge: 'One to one',
    tagline: 'One-to-one coaching with calls and reports',
    description: 'Closest coach contact: calls, priority feedback, weekly adjustments and monthly progress reports.',
    features: [
      'food_police',
      'weekly_checkin',
      'personalised_nutrition',
      'personalised_training',
      'whatsapp_accountability',
      'one_on_one_coaching',
      'coaching_calls',
      'progress_reports',
    ],
    bulletPoints: [
      'Everything in Signature',
      'Fortnightly one-to-one coaching calls',
      'Priority same-day coach feedback',
      'Weekly calorie, macro and training adjustments',
      'Monthly branded progress report',
    ],
  },
};

export interface TrialInfo {
  isTrial: boolean;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  currentDay: number;
  totalDays: number;
  progressPercent: number;
}

/**
 * Calculates real trial countdown and status from subscription record timestamps.
 */
export function calculateTrialInfo(subscription?: {
  isTrial?: boolean | null;
  trialStartDate?: string | Date | null;
  trialEndDate?: string | Date | null;
  status?: string | null;
  planTier?: string | null;
}): TrialInfo {
  if (!subscription || !subscription.isTrial) {
    return {
      isTrial: false,
      isActive: false,
      isExpired: false,
      daysRemaining: 0,
      currentDay: 0,
      totalDays: 14,
      progressPercent: 0,
    };
  }

  const now = new Date().getTime();
  const start = subscription.trialStartDate ? new Date(subscription.trialStartDate).getTime() : now;
  const end = subscription.trialEndDate ? new Date(subscription.trialEndDate).getTime() : start + 14 * 86400000;

  const totalMs = 14 * 86400000;
  const elapsedMs = Math.max(0, now - start);
  const remainingMs = Math.max(0, end - now);

  const daysRemaining = Math.max(0, Math.ceil(remainingMs / 86400000));
  const currentDay = Math.min(14, Math.max(1, Math.floor(elapsedMs / 86400000) + 1));
  const isExpired = remainingMs <= 0;
  const progressPercent = Math.min(100, Math.round((currentDay / 14) * 100));

  return {
    isTrial: true,
    isActive: !isExpired,
    isExpired,
    daysRemaining,
    currentDay,
    totalDays: 14,
    progressPercent,
  };
}

/**
 * Determines whether the user has Training Hub access (active trial or paid plan).
 */
export function hasTrainingAccess(subscription?: {
  planTier?: string | null;
  status?: string | null;
  isTrial?: boolean | null;
  trialEndDate?: string | Date | null;
}): boolean {
  if (!subscription) return false;
  if (subscription.isTrial) {
    const trial = calculateTrialInfo(subscription);
    return trial.isActive;
  }
  if (subscription.status !== 'ACTIVE') return false;
  return subscription.planTier === 'SILVER' || subscription.planTier === 'GOLD' || subscription.planTier === 'DIAMOND';
}

/**
 * Checks if a plan tier has permission to access a specific feature key.
 */
export function hasFeatureEntitlement(planTier: PlanTier, feature: FeatureKey): boolean {
  const plan = PLAN_DETAILS[planTier] || PLAN_DETAILS.FREE;
  return plan.features.includes(feature);
}

/**
 * Returns human readable error message when user attempts to access a locked feature.
 */
export function getUpgradeMessage(feature: FeatureKey): string {
  switch (feature) {
    case 'weekly_checkin':
      return 'Weekly check-ins are included from the Essential plan (₦15,000/month) or during your trial.';
    case 'personalised_nutrition':
      return 'A personalised meal plan is included from the Signature plan (₦25,000/month) or during your trial.';
    case 'personalised_training':
      return 'A personalised training programme and set logging are included from the Signature plan (₦25,000/month) or during your trial.';
    case 'whatsapp_accountability':
      return 'Direct WhatsApp accountability is included from the Signature plan (₦25,000/month).';
    case 'one_on_one_coaching':
    case 'coaching_calls':
    case 'progress_reports':
      return 'Coaching calls and progress reports are part of Private Coaching (₦40,000/month).';
    default:
      return 'This feature needs an active coaching plan.';
  }
}
