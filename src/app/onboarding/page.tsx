'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Utensils,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import {
  calculateNutritionProfile,
  FitnessGoal,
  ActivityLevel,
  Sex,
  NutritionEngineResult,
} from '@/lib/services/nutritionEngine';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  // Step 1: About You
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [age, setAge] = useState('28');
  const [sex, setSex] = useState<'male' | 'female'>('male');

  // Step 2: Body Metrics
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('82');
  const [waistCm, setWaistCm] = useState('86');

  // Step 3: Activity Level
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('MODERATELY_ACTIVE');

  // Step 4: Primary Goal
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>('FAT_LOSS');

  // Step 5: Fitness Experience & Environment
  const [fitnessLevel, setFitnessLevel] = useState('INTERMEDIATE');
  const [trainingExperience, setTrainingExperience] = useState('1-2 years');
  const [preferredWorkoutDays, setPreferredWorkoutDays] = useState('4');
  const [preferredDurationMin, setPreferredDurationMin] = useState('45');
  const [trainingEnvironment, setTrainingEnvironment] = useState('BOTH');
  const [availableEquipment, setAvailableEquipment] = useState('Dumbbells, Barbells, Bench');

  // Step 6: Nutrition Preferences
  const [dietaryPreference, setDietaryPreference] = useState('OMNIVORE');
  const [allergies, setAllergies] = useState('None');
  const [foodRestrictions, setFoodRestrictions] = useState('None');
  const [typicalMealFrequency, setTypicalMealFrequency] = useState('3');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Compute live targets for Step 7
  const nutritionResults: NutritionEngineResult = calculateNutritionProfile({
    age: parseInt(age || '28', 10),
    sex: sex as Sex,
    heightCm: parseFloat(heightCm || '175'),
    weightKg: parseFloat(weightKg || '80'),
    waistCm: parseFloat(waistCm || '85'),
    activityLevel: activityLevel,
    primaryGoal: primaryGoal,
  });

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        setErrorMsg('Please provide your first name, last name, and a valid email.');
        return;
      }
    }
    if (step === 2) {
      if (!heightCm || !weightKg || !waistCm) {
        setErrorMsg('Please enter your height, weight, and waist measurement.');
        return;
      }
    }
    setStep((prev) => Math.min(7, prev + 1));
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          age,
          sex,
          heightCm,
          weightKg,
          waistCm,
          activityLevel,
          primaryGoal,
          fitnessLevel,
          trainingExperience,
          preferredWorkoutDays,
          preferredDurationMin,
          trainingEnvironment,
          availableEquipment,
          dietaryPreference,
          allergies,
          foodRestrictions,
          typicalMealFrequency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      router.push('/client/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-4 sm:p-8 transition-colors duration-200">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-sm">
            <Flame size={18} className="fill-slate-950 stroke-none" />
          </div>
          <div>
            <span className="font-extrabold text-[var(--text-heading)] text-base tracking-tight block leading-tight">
              FITNESS POLICE
            </span>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
              Assessment Engine
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle variant="icon" />
          <div className="text-right">
            <span className="text-xs font-bold text-sky-400">Step {step} of 7</span>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              {step === 1 && 'About You'}
              {step === 2 && 'Body Metrics'}
              {step === 3 && 'Daily Activity'}
              {step === 4 && 'Primary Goal'}
              {step === 5 && 'Fitness Profile'}
              {step === 6 && 'Nutrition Preferences'}
              {step === 7 && 'Your Plan & Formula Results'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto w-full my-4 bg-slate-900/60 dark:bg-slate-900 light:bg-slate-200 h-1.5 rounded-full overflow-hidden border border-[var(--border-subtle)]">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300"
          style={{ width: `${(step / 7) * 100}%` }}
        />
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto w-full surface p-6 sm:p-10 space-y-6 my-auto border border-[var(--border-subtle)] shadow-2xl">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: ABOUT YOU */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="label-xs text-sky-400">Step 01 • Identity & Profile</span>
              <h2 className="page-title text-2xl mt-1">Let&apos;s Start with You</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Enter your basic information to initialize your personal coaching command center.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Chidi"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Okonkwo"
                  className="field-input"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chidi@example.com"
                className="field-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Biological Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSex('male')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      sex === 'male'
                        ? 'border-sky-400 bg-sky-500/10 text-sky-400'
                        : 'border-[var(--border-subtle)] surface text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setSex('female')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      sex === 'female'
                        ? 'border-sky-400 bg-sky-500/10 text-sky-400'
                        : 'border-[var(--border-subtle)] surface text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="field-label">Age (Years)</label>
                <input
                  type="number"
                  min="16"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="field-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BODY METRICS */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="label-xs text-sky-400">Step 02 • Physical Baseline</span>
              <h2 className="page-title text-2xl mt-1">Your Body Measurements</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                These measurements allow our Mifflin-St Jeor engine to calculate your exact Basal Metabolic Rate and body mass index.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="field-label">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="175"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="82"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Waist Circumference (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  placeholder="86"
                  className="field-input"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl surface border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] flex items-center gap-2">
              <Scale size={16} className="text-sky-400 shrink-0" />
              <span>Waist is measured around the navel in a relaxed posture for accurate abdominal fat tracking.</span>
            </div>
          </div>
        )}

        {/* STEP 3: ACTIVITY LEVEL */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="label-xs text-sky-400">Step 03 • Lifestyle & Movement</span>
              <h2 className="page-title text-2xl mt-1">What is Your Daily Activity Level?</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Select the option that best reflects your non-exercise daily movement and physical occupation.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'SEDENTARY',
                  title: 'Sedentary (1.20x)',
                  desc: 'Desk job, seated most of the day, under 4,000 steps daily.',
                },
                {
                  id: 'LIGHTLY_ACTIVE',
                  title: 'Lightly Active (1.375x)',
                  desc: 'Light daily walking, desk job with light errands, 5,000 - 7,000 steps.',
                },
                {
                  id: 'MODERATELY_ACTIVE',
                  title: 'Moderately Active (1.55x)',
                  desc: 'On your feet during the day, active lifestyle, 8,000 - 10,000 daily steps.',
                },
                {
                  id: 'VERY_ACTIVE',
                  title: 'Very Active (1.725x)',
                  desc: 'Physically demanding job or heavy daily activity, 12,000+ steps.',
                },
                {
                  id: 'EXTREMELY_ACTIVE',
                  title: 'Extremely Active (1.90x)',
                  desc: 'Hard manual labor or intense two-a-day athletic training.',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActivityLevel(opt.id as ActivityLevel)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activityLevel === opt.id
                      ? 'border-sky-400 bg-sky-500/10 text-[var(--text-heading)] shadow-sm'
                      : 'border-[var(--border-subtle)] surface text-[var(--text-muted)] hover:border-[var(--border-active)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-[var(--text-heading)]">{opt.title}</p>
                    {activityLevel === opt.id && (
                      <CheckCircle2 size={16} className="text-sky-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PRIMARY GOAL */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="label-xs text-sky-400">Step 04 • Destination</span>
              <h2 className="page-title text-2xl mt-1">What is Your Primary Goal?</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Your goal dictates whether your calorie target is placed in a fat loss deficit, maintenance, or hyper-trophy surplus.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'FAT_LOSS',
                  title: 'Fat Loss',
                  desc: 'Caloric deficit (-500 kcal) targeted at reducing body fat while sparing muscle.',
                },
                {
                  id: 'BODY_RECOMPOSITION',
                  title: 'Body Recomposition',
                  desc: 'Iso-caloric maintenance to burn fat and build muscle simultaneously.',
                },
                {
                  id: 'MUSCLE_GAIN',
                  title: 'Muscle Gain',
                  desc: 'Lean caloric surplus (+300 kcal) paired with progressive overload training.',
                },
                {
                  id: 'STRENGTH_PERFORMANCE',
                  title: 'Strength & Performance',
                  desc: 'Focus on compound strength progression and explosive athletic stamina.',
                },
                {
                  id: 'GENERAL_HEALTH',
                  title: 'General Health & Fitness',
                  desc: 'Sustainable cardio-respiratory and metabolic conditioning habits.',
                },
                {
                  id: 'HEALTHY_WEIGHT_GAIN',
                  title: 'Healthy Weight Gain',
                  desc: 'Nutrient-dense caloric surplus (+450 kcal) to increase healthy lean mass.',
                },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setPrimaryGoal(g.id as FitnessGoal)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    primaryGoal === g.id
                      ? 'border-sky-400 bg-sky-500/10 text-[var(--text-heading)] shadow-sm'
                      : 'border-[var(--border-subtle)] surface text-[var(--text-muted)] hover:border-[var(--border-active)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-[var(--text-heading)] uppercase">{g.title}</p>
                    {primaryGoal === g.id && (
                      <CheckCircle2 size={15} className="text-sky-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: FITNESS PROFILE */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="label-xs text-sky-400">Step 05 • Training Experience & Setup</span>
              <h2 className="page-title text-2xl mt-1">Your Fitness & Training Profile</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                We calibrate your assigned workout routines to match your available time and training gear.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Current Fitness Level</label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                  className="field-input"
                >
                  <option value="BEGINNER">Beginner (Under 6 months)</option>
                  <option value="INTERMEDIATE">Intermediate (1 - 3 years)</option>
                  <option value="ADVANCED">Advanced (3+ years)</option>
                </select>
              </div>

              <div>
                <label className="field-label">Training Experience</label>
                <input
                  type="text"
                  value={trainingExperience}
                  onChange={(e) => setTrainingExperience(e.target.value)}
                  placeholder="e.g. 2 years lifting"
                  className="field-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="field-label">Preferred Workout Days</label>
                <select
                  value={preferredWorkoutDays}
                  onChange={(e) => setPreferredWorkoutDays(e.target.value)}
                  className="field-input"
                >
                  <option value="3">3 Days / Week</option>
                  <option value="4">4 Days / Week (Recommended)</option>
                  <option value="5">5 Days / Week</option>
                  <option value="6">6 Days / Week</option>
                </select>
              </div>

              <div>
                <label className="field-label">Workout Duration</label>
                <select
                  value={preferredDurationMin}
                  onChange={(e) => setPreferredDurationMin(e.target.value)}
                  className="field-input"
                >
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="field-label">Environment</label>
                <select
                  value={trainingEnvironment}
                  onChange={(e) => setTrainingEnvironment(e.target.value)}
                  className="field-input"
                >
                  <option value="BOTH">Home & Gym</option>
                  <option value="GYM">Commercial Gym Only</option>
                  <option value="HOME">Home Setup Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Available Equipment</label>
              <input
                type="text"
                value={availableEquipment}
                onChange={(e) => setAvailableEquipment(e.target.value)}
                placeholder="e.g. Dumbbells, Barbell, Resistance Bands, Pull-up Bar"
                className="field-input"
              />
            </div>
          </div>
        )}

        {/* STEP 6: NUTRITION PROFILE */}
        {step === 6 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <span className="label-xs text-sky-400">Step 06 • Dietary Preferences</span>
              <h2 className="page-title text-2xl mt-1">Your Food & Dietary Profile</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Food Police adapts to African food staples, dietary traditions, and personal food tolerances.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Dietary Preference</label>
                <select
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                  className="field-input"
                >
                  <option value="OMNIVORE">Omnivore (Standard - All Foods)</option>
                  <option value="PESCATARIAN">Pescatarian (Fish & Seafood)</option>
                  <option value="HALAL">Halal</option>
                  <option value="VEGETARIAN">Vegetarian (No Meat/Fish)</option>
                  <option value="VEGAN">Plant-Based / Vegan</option>
                </select>
              </div>

              <div>
                <label className="field-label">Typical Daily Meal Frequency</label>
                <select
                  value={typicalMealFrequency}
                  onChange={(e) => setTypicalMealFrequency(e.target.value)}
                  className="field-input"
                >
                  <option value="2">2 Meals + 1 Snack</option>
                  <option value="3">3 Main Meals (Standard)</option>
                  <option value="4">4 Balanced Meals</option>
                  <option value="5">5 Small Meals</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Peanuts, Shellfish, None"
                  className="field-input"
                />
              </div>

              <div>
                <label className="field-label">Foods You Avoid / Restrictions</label>
                <input
                  type="text"
                  value={foodRestrictions}
                  onChange={(e) => setFoodRestrictions(e.target.value)}
                  placeholder="e.g. Dairy, Pork, Refined Sugar"
                  className="field-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: RESULTS & TARGETS */}
        {step === 7 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <span className="label-xs text-sky-400">Step 07 • Your Blueprint</span>
                <h2 className="page-title text-2xl mt-1">Your Personal Metabolic Targets</h2>
              </div>
              <span className="badge badge-trial">14-Day Trial Included</span>
            </div>

            {/* Formula Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="surface p-4 border-[var(--border-subtle)] space-y-1">
                <span className="label-xs text-[var(--text-muted)]">Basal Rate (BMR)</span>
                <p className="text-xl font-black text-[var(--text-heading)]">{nutritionResults.bmr} <span className="text-xs font-normal text-[var(--text-muted)]">kcal</span></p>
                <p className="text-[10px] text-[var(--text-muted)]">Mifflin-St Jeor</p>
              </div>

              <div className="surface p-4 border-[var(--border-subtle)] space-y-1">
                <span className="label-xs text-[var(--text-muted)]">Maintenance (TDEE)</span>
                <p className="text-xl font-black text-[var(--text-heading)]">{nutritionResults.tdee} <span className="text-xs font-normal text-[var(--text-muted)]">kcal</span></p>
                <p className="text-[10px] text-[var(--text-muted)]">Activity Multiplied</p>
              </div>

              <div className="surface p-4 border-sky-400/40 space-y-1">
                <span className="label-xs text-sky-400">Daily Target</span>
                <p className="text-xl font-black text-sky-400">{nutritionResults.dailyCalories} <span className="text-xs font-normal text-[var(--text-muted)]">kcal</span></p>
                <p className="text-[10px] text-sky-400 font-bold">{primaryGoal.replace('_', ' ')}</p>
              </div>

              <div className="surface p-4 border-[var(--border-subtle)] space-y-1">
                <span className="label-xs text-[var(--text-muted)]">BMI Index</span>
                <p className="text-xl font-black text-cyan-400">{nutritionResults.bmi}</p>
                <p className="text-[10px] text-[var(--text-muted)]">Body Mass Ratio</p>
              </div>
            </div>

            {/* Macronutrient Allocation */}
            <div className="surface p-5 border-[var(--border-subtle)] space-y-4">
              <h3 className="section-title text-sm flex items-center gap-2">
                <Utensils size={15} className="text-sky-400" /> Daily Macronutrient Target Allocation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-950/40 rounded-xl border border-sky-400/30">
                  <span className="label-xs text-sky-400">PROTEIN</span>
                  <p className="text-xl font-black text-[var(--text-heading)] mt-0.5">{nutritionResults.targetProteinG}g</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">2.2g per kg bodyweight</p>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-xl border border-cyan-400/30">
                  <span className="label-xs text-cyan-400">CARBS</span>
                  <p className="text-xl font-black text-[var(--text-heading)] mt-0.5">{nutritionResults.targetCarbsG}g</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Energy & Glycogen</p>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-xl border border-amber-500/30">
                  <span className="label-xs text-amber-400">FATS</span>
                  <p className="text-xl font-black text-[var(--text-heading)] mt-0.5">{nutritionResults.targetFatG}g</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">25% Daily Energy</p>
                </div>
              </div>
            </div>

            {/* 14-Day Free Trial Notice */}
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-[var(--text-secondary)] space-y-1">
              <p className="text-sky-400 font-bold flex items-center gap-1.5">
                <ShieldCheck size={16} /> 14-Day Free Fitness Police Trial Included
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                You get full immediate access to custom workout routines, set loggers, and Food Police. No immediate charge.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-5 border-t border-[var(--border-subtle)]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-secondary text-xs"
            >
              <ArrowLeft size={14} /> Previous
            </button>
          ) : (
            <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)] font-semibold">
              Cancel
            </Link>
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-brand text-xs font-bold px-6 py-2.5"
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              disabled={loading}
              className="btn-brand text-xs font-black px-8 py-3 shadow-xl shadow-sky-500/25"
            >
              {loading ? 'Activating 14-Day Trial...' : 'Enter Personal Command Centre'} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-[var(--text-muted)] py-3">
        Fitness Police Human-in-the-Loop Coaching Engine
      </div>
    </div>
  );
}
