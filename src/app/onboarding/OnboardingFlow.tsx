'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button, ChoiceList, Field, Photo, SelectField, Segmented, type Choice } from '@/components/ui';
import { calculateNutritionProfile, type ActivityLevel, type FitnessGoal, type Sex } from '@/lib/services/nutritionEngine';
import type { ResolvedPhoto } from '@/lib/photos';
import { useTween } from '@/lib/useTween';
import { BRAND } from '@/lib/brand';

const STORAGE_KEY = 'ericonet.onboarding.v2';

const STEPS = ['Account', 'About you', 'Goal and timeline', 'Training setup', 'Food preferences', 'Review'] as const;

const ACTIVITY: Choice<ActivityLevel>[] = [
  { value: 'SEDENTARY', title: 'Mostly seated', description: 'Desk job, under 4,000 steps a day.' },
  { value: 'LIGHTLY_ACTIVE', title: 'Lightly active', description: 'Some walking and errands, 5,000 to 7,000 steps.' },
  { value: 'MODERATELY_ACTIVE', title: 'On your feet', description: 'Active days, 8,000 to 10,000 steps.' },
  { value: 'VERY_ACTIVE', title: 'Very active', description: 'Physical job or busy days, 12,000 steps or more.' },
  { value: 'EXTREMELY_ACTIVE', title: 'Extremely active', description: 'Manual labour or training twice a day.' },
];

const GOALS: Choice<FitnessGoal>[] = [
  { value: 'FAT_LOSS', title: 'Lose body fat', description: 'A moderate deficit that protects muscle.' },
  { value: 'BODY_RECOMPOSITION', title: 'Recompose', description: 'Lose fat and build muscle at roughly the same weight.' },
  { value: 'MUSCLE_GAIN', title: 'Build muscle', description: 'A small surplus with progressive training.' },
  { value: 'STRENGTH_PERFORMANCE', title: 'Get stronger', description: 'Strength and conditioning first.' },
  { value: 'GENERAL_HEALTH', title: 'General health', description: 'Better habits, energy and fitness.' },
  { value: 'HEALTHY_WEIGHT_GAIN', title: 'Gain weight healthily', description: 'A steady surplus of nutritious food.' },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  sex: Sex;
  age: string;
  heightCm: string;
  weightKg: string;
  waistCm: string;
  activityLevel: ActivityLevel;
  primaryGoal: FitnessGoal;
  targetWeightKg: string;
  programmeDurationWeeks: string;
  fitnessLevel: string;
  trainingExperience: string;
  preferredWorkoutDays: string;
  preferredDurationMin: string;
  trainingEnvironment: string;
  availableEquipment: string;
  dietaryPreference: string;
  typicalMealFrequency: string;
  allergies: string;
  foodRestrictions: string;
}

const INITIAL: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  sex: 'male',
  age: '',
  heightCm: '',
  weightKg: '',
  waistCm: '',
  activityLevel: 'MODERATELY_ACTIVE',
  primaryGoal: 'FAT_LOSS',
  targetWeightKg: '',
  programmeDurationWeeks: '12',
  fitnessLevel: 'INTERMEDIATE',
  trainingExperience: '',
  preferredWorkoutDays: '4',
  preferredDurationMin: '45',
  trainingEnvironment: 'BOTH',
  availableEquipment: '',
  dietaryPreference: 'OMNIVORE',
  typicalMealFrequency: '3',
  allergies: '',
  foodRestrictions: '',
};

type Errors = Partial<Record<keyof FormState | 'password', string>>;

const num = (v: string) => {
  const n = parseFloat(v.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
};

function validate(step: number, f: FormState, password: string): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!f.firstName.trim()) e.firstName = 'Enter your first name.';
    if (!f.lastName.trim()) e.lastName = 'Enter your last name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
    if (password.length < 8) e.password = 'Use at least 8 characters.';
  }
  if (step === 1) {
    const age = num(f.age), h = num(f.heightCm), w = num(f.weightKg), waist = num(f.waistCm);
    if (!(age >= 16 && age <= 90)) e.age = 'Enter an age between 16 and 90.';
    if (!(h >= 120 && h <= 230)) e.heightCm = 'Enter a height between 120 and 230 cm.';
    if (!(w >= 35 && w <= 300)) e.weightKg = 'Enter a weight between 35 and 300 kg.';
    if (!(waist >= 45 && waist <= 200)) e.waistCm = 'Enter a waist between 45 and 200 cm.';
  }
  if (step === 2 && f.targetWeightKg) {
    const t = num(f.targetWeightKg);
    if (!(t >= 35 && t <= 300)) e.targetWeightKg = 'Enter a target between 35 and 300 kg, or leave it blank.';
  }
  return e;
}

function addWeeks(weeks: number) {
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function TweenNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const v = useTween(value, 700);
  return <>{v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

export function OnboardingFlow({ reviewPhoto }: { reviewPhoto: ResolvedPhoto }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormState>(INITIAL);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [restored, setRestored] = useState(false);

  // Restore the draft (never the password).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { f: Partial<FormState>; step: number };
        setF((prev) => ({ ...prev, ...saved.f }));
        setStep(Math.min(Math.max(0, saved.step ?? 0), STEPS.length - 2));
      }
    } catch {
      /* ignore a corrupt draft */
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ f, step }));
    } catch {
      /* storage full or disabled */
    }
  }, [f, step, restored]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const targets = useMemo(
    () =>
      calculateNutritionProfile({
        age: num(f.age) || 28,
        sex: f.sex,
        heightCm: num(f.heightCm) || 170,
        weightKg: num(f.weightKg) || 75,
        waistCm: num(f.waistCm) || 85,
        activityLevel: f.activityLevel,
        primaryGoal: f.primaryGoal,
      }),
    [f.age, f.sex, f.heightCm, f.weightKg, f.waistCm, f.activityLevel, f.primaryGoal]
  );

  // Move focus to the first invalid field once the errors have rendered.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!attempt) return;
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [attempt]);

  const next = () => {
    const e = validate(step, f, password);
    setErrors(e);
    if (Object.keys(e).length) {
      setAttempt((a) => a + 1);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async () => {
    // Re-check the account step in case the password was never entered after a restored draft.
    const accountErrors = validate(0, f, password);
    if (Object.keys(accountErrors).length) {
      setErrors(accountErrors);
      setStep(0);
      setAttempt((a) => a + 1);
      return;
    }
    setLoading(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          email: f.email.trim(),
          password,
          trainingExperience: f.trainingExperience || undefined,
          availableEquipment: f.availableEquipment || undefined,
          allergies: f.allergies || 'None',
          foodRestrictions: f.foodRestrictions || 'None',
          targetWeightKg: f.targetWeightKg || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'We could not create your account.');
      localStorage.removeItem(STORAGE_KEY);
      router.push(data.redirectTo || '/client/dashboard');
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'We could not create your account.');
      setLoading(false);
    }
  };

  const isReview = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;
  const target = num(f.targetWeightKg);
  const weeks = parseInt(f.programmeDurationWeeks, 10) || 12;

  return (
    <div className="min-h-dvh bg-paper text-ink flex flex-col">
      {/* Top bar with progress */}
      <header className="sticky top-0 z-30 bg-[var(--bg-header)] backdrop-blur-md">
        <div className="mx-auto max-w-[640px] px-4 h-14 md:h-16 flex items-center gap-2">
          {step > 0 ? (
            <button type="button" onClick={back} aria-label="Back" className="focus-ring h-11 w-11 -ml-2 rounded-full flex items-center justify-center text-ink-secondary hover:text-ink">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <span className="-ml-1">
              <Logo variant="monogram" size={28} href="/" />
            </span>
          )}
          <p className="flex-1 text-center t-ui">
            <span className="text-ink-muted tnum">{step + 1} of {STEPS.length}</span>
            <span className="text-ink-muted"> · </span>
            {STEPS[step]}
          </p>
          <Link href="/" aria-label="Leave assessment" className="focus-ring h-11 w-11 -mr-2 rounded-full flex items-center justify-center text-ink-secondary hover:text-ink">
            <X size={20} />
          </Link>
        </div>
        <div className="h-0.5 bg-[var(--border-subtle)]" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Assessment progress">
          <div className="h-full bg-brand transition-[width] duration-[var(--dur-3)] ease-[var(--ease-enter)]" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-[640px] px-4 pt-8 md:pt-12 pb-6">
        <div key={step} className="motion-enter space-y-8">
          {step === 0 && (
            <>
              <StepTitle title="Create your account" text="Your targets and plan are saved here. Takes about five minutes in total." />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="First name" error={errors.firstName}>
                  <input value={f.firstName} onChange={(e) => set('firstName', e.target.value)} autoComplete="given-name" enterKeyHint="next" />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input value={f.lastName} onChange={(e) => set('lastName', e.target.value)} autoComplete="family-name" enterKeyHint="next" />
                </Field>
              </div>
              <Field label="Email" error={errors.email}>
                <input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" inputMode="email" enterKeyHint="next" />
              </Field>
              <Field label="Password" help="At least 8 characters." error={errors.password}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((x) => ({ ...x, password: undefined }));
                  }}
                  autoComplete="new-password"
                  enterKeyHint="next"
                />
              </Field>
              <p className="t-body-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-brand font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <StepTitle title="About you" text="These set your starting calories. Measure your waist at the navel, relaxed." />
              <div className="space-y-2">
                <p className="t-ui">Sex</p>
                <Segmented label="Sex" value={f.sex} onChange={(v) => set('sex', v)} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
              </div>
              <div className="grid gap-5 grid-cols-2">
                <Field label="Age" unit="years" error={errors.age}>
                  <input value={f.age} onChange={(e) => set('age', e.target.value)} inputMode="numeric" autoComplete="off" enterKeyHint="next" />
                </Field>
                <Field label="Height" unit="cm" error={errors.heightCm}>
                  <input value={f.heightCm} onChange={(e) => set('heightCm', e.target.value)} inputMode="decimal" autoComplete="off" enterKeyHint="next" />
                </Field>
                <Field label="Weight" unit="kg" error={errors.weightKg}>
                  <input value={f.weightKg} onChange={(e) => set('weightKg', e.target.value)} inputMode="decimal" autoComplete="off" enterKeyHint="next" />
                </Field>
                <Field label="Waist" unit="cm" error={errors.waistCm}>
                  <input value={f.waistCm} onChange={(e) => set('waistCm', e.target.value)} inputMode="decimal" autoComplete="off" enterKeyHint="done" />
                </Field>
              </div>
              <div className="space-y-3">
                <p className="t-ui">How active are your days, outside training?</p>
                <ChoiceList label="Daily activity" value={f.activityLevel} onChange={(v) => set('activityLevel', v)} options={ACTIVITY} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepTitle title="Goal and timeline" text="Your goal decides whether calories sit below, at or above maintenance." />
              <ChoiceList label="Primary goal" value={f.primaryGoal} onChange={(v) => set('primaryGoal', v)} options={GOALS} columns={2} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Target weight" unit="kg" help="Optional. Your coach confirms a realistic target with you." error={errors.targetWeightKg}>
                  <input value={f.targetWeightKg} onChange={(e) => set('targetWeightKg', e.target.value)} inputMode="decimal" autoComplete="off" placeholder={f.weightKg ? String(Math.round(num(f.weightKg) * 0.92)) : ''} />
                </Field>
                <SelectField label="Programme length" help="Most clients plan in 12-week blocks." value={f.programmeDurationWeeks} onChange={(e) => set('programmeDurationWeeks', e.target.value)}>
                  <option value="8">8 weeks</option>
                  <option value="12">12 weeks</option>
                  <option value="16">16 weeks</option>
                  <option value="24">24 weeks</option>
                </SelectField>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepTitle title="Training setup" text="Your programme is built around the time and equipment you actually have." />
              <div className="space-y-2">
                <p className="t-ui">Where do you train?</p>
                <Segmented label="Training environment" value={f.trainingEnvironment} onChange={(v) => set('trainingEnvironment', v)} options={[{ value: 'HOME', label: 'Home' }, { value: 'GYM', label: 'Gym' }, { value: 'BOTH', label: 'Both' }]} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Experience" value={f.fitnessLevel} onChange={(e) => set('fitnessLevel', e.target.value)}>
                  <option value="BEGINNER">New, under 6 months</option>
                  <option value="INTERMEDIATE">1 to 3 years</option>
                  <option value="ADVANCED">More than 3 years</option>
                </SelectField>
                <SelectField label="Days per week" value={f.preferredWorkoutDays} onChange={(e) => set('preferredWorkoutDays', e.target.value)}>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                  <option value="6">6 days</option>
                </SelectField>
                <SelectField label="Session length" value={f.preferredDurationMin} onChange={(e) => set('preferredDurationMin', e.target.value)}>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </SelectField>
                <Field label="What you have done before" help="Optional.">
                  <input value={f.trainingExperience} onChange={(e) => set('trainingExperience', e.target.value)} placeholder="Two years of gym, some running" autoComplete="off" />
                </Field>
              </div>
              <Field label="Equipment you can use" help="Optional. List what you have.">
                <input value={f.availableEquipment} onChange={(e) => set('availableEquipment', e.target.value)} placeholder="Dumbbells, bench, resistance bands" autoComplete="off" />
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <StepTitle title="Food preferences" text="Plans use the foods you already eat. Tell us what to leave out." />
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="How you eat" value={f.dietaryPreference} onChange={(e) => set('dietaryPreference', e.target.value)}>
                  <option value="OMNIVORE">Everything</option>
                  <option value="HALAL">Halal</option>
                  <option value="PESCATARIAN">Fish, no meat</option>
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="VEGAN">Plant-based</option>
                </SelectField>
                <SelectField label="Meals a day" value={f.typicalMealFrequency} onChange={(e) => set('typicalMealFrequency', e.target.value)}>
                  <option value="2">2 meals and a snack</option>
                  <option value="3">3 meals</option>
                  <option value="4">4 meals</option>
                  <option value="5">5 smaller meals</option>
                </SelectField>
              </div>
              <Field label="Allergies" help="Leave blank if none.">
                <input value={f.allergies} onChange={(e) => set('allergies', e.target.value)} placeholder="Groundnuts, shellfish" autoComplete="off" />
              </Field>
              <Field label="Foods you avoid" help="Leave blank if none.">
                <input value={f.foodRestrictions} onChange={(e) => set('foodRestrictions', e.target.value)} placeholder="Pork, dairy" autoComplete="off" />
              </Field>
            </>
          )}

          {isReview && (
            <>
              <StepTitle title={`Your starting targets${f.firstName ? `, ${f.firstName}` : ''}`} text="Calculated from your answers. Your coach adjusts them from your weekly check-ins." />
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                <ReviewStat label="Daily calories" unit="kcal"><TweenNumber value={targets.dailyCalories} /></ReviewStat>
                <ReviewStat label="Protein" unit="g a day"><TweenNumber value={targets.targetProteinG} /></ReviewStat>
                <ReviewStat label="Target weight" unit={Number.isFinite(target) ? 'kg' : ''}>
                  {Number.isFinite(target) ? <TweenNumber value={target} decimals={target % 1 ? 1 : 0} /> : <span className="t-stat">Set with your coach</span>}
                </ReviewStat>
                <ReviewStat label="Programme ends" unit="">
                  <span className="t-stat block">{addWeeks(weeks)}</span>
                </ReviewStat>
              </div>
              <dl className="hairline hairline-b grid grid-cols-3 divide-x divide-[var(--border-subtle)] text-sm">
                {[
                  ['Carbohydrate', `${targets.targetCarbsG} g`],
                  ['Fat', `${targets.targetFatG} g`],
                  ['Maintenance', `${targets.tdee.toLocaleString()} kcal`],
                ].map(([k, v]) => (
                  <div key={k} className="py-4 px-3 first:pl-0 last:pr-0">
                    <dt className="t-caption">{k}</dt>
                    <dd className="tnum font-medium mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
              <Photo photo={reviewPhoto} alt="" ratio="16/9" sizes="640px" />
              <p className="t-body-sm">
                Creating your account starts a 14-day trial of the Signature plan: your training programme, set logging and nutrition log, with no charge today. {BRAND.coachName} reviews your first check-in on Sunday.
              </p>
              {submitError && <p className="t-body-sm text-status-rejected" role="alert">{submitError}</p>}
            </>
          )}
        </div>
      </main>

      {/* Sticky action bar: stays above the keyboard on phones */}
      <div className="sticky bottom-0 z-20 bg-[var(--bg-header)] backdrop-blur-md border-t border-[var(--border-subtle)] safe-pb">
        <div className="mx-auto max-w-[640px] px-4 py-3 flex items-center gap-3">
          {step > 0 && (
            <div className="hidden sm:block">
              <Button variant="ghost" onClick={back}>Back</Button>
            </div>
          )}
          <div className="flex-1 flex sm:justify-end">
            {isReview ? (
              <Button size="lg" onClick={submit} loading={loading} full className="sm:w-auto">Create my account</Button>
            ) : (
              <Button size="lg" onClick={next} full className="sm:w-auto">Continue</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h1 className="t-h1">{title}</h1>
      <p className="t-body-sm mt-2 max-w-[52ch]">{text}</p>
    </div>
  );
}

function ReviewStat({ label, unit, children }: { label: string; unit: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="t-body-sm">{label}</p>
      <p className="flex items-baseline gap-1.5 mt-1 flex-wrap">
        <span className="t-stat-hero tnum text-[40px] md:text-[64px]">{children}</span>
        {unit && <span className="text-ink-muted font-medium">{unit}</span>}
      </p>
    </div>
  );
}
