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
    name: 'Food Police Free',
    priceNgn: 0,
    tagline: 'Always Free for All Registered Clients',
    description: 'Instant food logging, natural language macro parsing, and human coach review.',
    features: ['food_police'],
    bulletPoints: [
      'Food photo & natural language meal logging',
      'Instant AI calorie & macronutrient estimation',
      'Nigerian & global food staple recognition',
      'Human-in-the-loop coach portion verification',
      'Daily nutrition intake timeline',
    ],
  },
  SILVER: {
    tier: 'SILVER',
    name: 'Silver Coaching',
    priceNgn: 15000,
    tagline: 'Essential Guidance & Accountability',
    description: 'Structured coaching guidance with weekly check-ins and coach feedback.',
    features: ['food_police', 'weekly_checkin'],
    bulletPoints: [
      'Everything in Free Food Police',
      'Structured weekly check-in system',
      'Personal coach progress reviews & advice',
      'Weight, waist, and milestone metrics',
      'Monthly training adjustments',
    ],
  },
  GOLD: {
    tier: 'GOLD',
    name: 'Gold Fitness Police',
    priceNgn: 25000,
    badge: 'MOST POPULAR',
    tagline: 'Personalised Training, Nutrition & WhatsApp',
    description: 'Complete bespoke fitness routines, meal plans, and direct WhatsApp accountability.',
    features: [
      'food_police',
      'weekly_checkin',
      'personalised_nutrition',
      'personalised_training',
      'whatsapp_accountability',
    ],
    bulletPoints: [
      'Everything in Silver Coaching',
      'Custom 4-day & 5-day workout routines (Home/Gym)',
      'Interactive set, rep, and weight logger',
      'Bespoke African & international meal plans',
      'Direct WhatsApp coach accountability',
    ],
  },
  DIAMOND: {
    tier: 'DIAMOND',
    name: 'Diamond VIP Coaching',
    priceNgn: 40000,
    badge: 'VIP HIGH-TOUCH',
    tagline: '1-on-1 VIP Coaching & Custom Calls',
    description: 'High-touch 1-on-1 coaching, frequent check-ins, custom progress reports, and calls.',
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
      'Everything in Gold Fitness Police',
      '1-on-1 bi-weekly coaching video/voice calls',
      'Priority same-day coach feedback',
      'Dynamic weekly macro & volume micro-adjustments',
      'Comprehensive monthly transformation reports',
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
 * Determines whether user has active Fitness Police access (via active trial or paid subscription).
 */
export function hasFitnessPoliceAccess(subscription?: {
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
      return 'Weekly check-ins require Silver tier (₦15,000/mo) or active trial.';
    case 'personalised_nutrition':
      return 'Personalised African/Global meal plans require Gold tier (₦25,000/mo) or active trial.';
    case 'personalised_training':
      return 'Personalised workout routines & set logging require Gold tier (₦25,000/mo) or active trial.';
    case 'whatsapp_accountability':
      return 'WhatsApp direct coach accountability requires Gold tier (₦25,000/mo).';
    case 'one_on_one_coaching':
    case 'coaching_calls':
    case 'progress_reports':
      return '1-on-1 VIP coaching calls and custom reports require Diamond tier (₦40,000/mo).';
    default:
      return 'This feature requires an active Fitness Police subscription.';
  }
}
