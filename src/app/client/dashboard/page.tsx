'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import {
  Dumbbell,
  Utensils,
  Play,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Footprints,
  Flame,
  Award,
  ArrowRight,
} from 'lucide-react';

export default function ClientDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [foodLogs, setFoodLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      setUser(meData.user);

      if (meData.user?.id) {
        const wRes = await fetch(`/api/training/workouts?userId=${meData.user.id}`);
        const wData = await wRes.json();
        setWorkoutPlan(wData.workoutPlan);

        const fRes = await fetch('/api/nutrition/queue');
        const fData = await fRes.json();
        setFoodLogs(fData.queue || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const profile = user?.profile || {
    dailyCalories: 2288,
    targetProteinG: 187,
    targetCarbsG: 229,
    targetFatG: 64,
    weightKg: 84.2,
    waistCm: 87,
    primaryGoal: 'FAT_LOSS',
  };

  const activeWorkout = workoutPlan?.workouts?.[0] || {
    dayName: 'Day 1',
    title: 'Upper Body Hypertrophy & Fat Burn',
    exercises: [
      { name: 'Incline Bench Press', sets: 4, reps: '8-10' },
      { name: 'Shoulder Dumbbell Press', sets: 3, reps: '10-12' },
      { name: 'Cable Chest Flyes', sets: 3, reps: '12-15' },
      { name: 'Triceps Rope Pushdowns', sets: 4, reps: '12-15' },
    ],
  };

  const todayCalories = 1720;
  const todayProtein = 145;
  const todayCarbs = 180;
  const todayFat = 48;

  const proteinPercent = Math.min(100, Math.round((todayProtein / (profile.targetProteinG || 180)) * 100));

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ClientAppShell
      title={`${greetingTime()}, ${user?.firstName || 'Athlete'}`}
      subtitle="Here is your personal fitness focus and daily blueprint for today."
    >
      {/* 3 CORE PILLARS COMMAND CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
        
        {/* PILLAR 1: WHAT SHOULD I DO TODAY? (Fitness) */}
        <div className="surface p-6 sm:p-7 flex flex-col justify-between space-y-6 border-l-4 border-l-sky-400 surface-hover">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="label-xs text-brand">Focus 01 • Training</span>
              <span className="badge badge-trial text-xs">45 MIN</span>
            </div>

            <div>
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">What Should I Do Today?</h2>
              <h3 className="text-xl font-extrabold text-[var(--text-heading)] mt-1">{activeWorkout.title}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{activeWorkout.dayName} • {activeWorkout.exercises?.length || 4} Exercises Assigned</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
              {(activeWorkout.exercises || []).slice(0, 3).map((ex: any, i: number) => (
                <div key={i} className="p-2.5 bg-paper rounded-xl border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--text-heading)] truncate">{ex.name}</span>
                  <span className="text-brand font-bold text-xs shrink-0 ml-2">{ex.sets} sets × {ex.reps}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/client/training"
            className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-md"
          >
            <Play size={14} className="fill-current" /> Start Today&apos;s Workout
          </Link>
        </div>

        {/* PILLAR 2: WHAT SHOULD I EAT? (Nutrition log) */}
        <div className="surface p-6 sm:p-7 flex flex-col justify-between space-y-6 border-l-4 border-l-cyan-400 surface-hover">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="label-xs text-brand">Focus 02 • Nutrition</span>
              <span className="badge badge-approved text-xs">100% FREE TIER</span>
            </div>

            <div>
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">What Should I Eat?</h2>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-[var(--text-heading)]">{todayCalories}</span>
                <span className="text-xs text-[var(--text-muted)]">/ {profile.dailyCalories} kcal</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Goal: {profile.primaryGoal?.replace('_', ' ')}</p>
            </div>

            {/* Macro Progress Bars */}
            <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)] text-xs">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-brand">Protein: {todayProtein}g / {profile.targetProteinG}g</span>
                  <span className="text-[var(--text-muted)]">{proteinPercent}%</span>
                </div>
                <div className="h-1.5 bg-paper rounded-full overflow-hidden">
                  <div className="h-full bg-brand-strong rounded-full" style={{ width: `${proteinPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-brand">Carbs: {todayCarbs}g / {profile.targetCarbsG}g</span>
                  <span className="text-[var(--text-muted)]">78%</span>
                </div>
                <div className="h-1.5 bg-paper rounded-full overflow-hidden">
                  <div className="h-full bg-brand-strong rounded-full" style={{ width: `78%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-status-pending">Fats: {todayFat}g / {profile.targetFatG}g</span>
                  <span className="text-[var(--text-muted)]">75%</span>
                </div>
                <div className="h-1.5 bg-paper rounded-full overflow-hidden">
                  <div className="h-full bg-brand-strong rounded-full" style={{ width: `75%` }} />
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/client/nutrition"
            className="btn-secondary text-xs w-full justify-center py-3 font-bold"
          >
            <Utensils size={14} className="text-brand" /> Log a meal
          </Link>
        </div>

        {/* PILLAR 3: AM I MAKING PROGRESS? (Progress & Coaching) */}
        <div className="surface p-6 sm:p-7 flex flex-col justify-between space-y-6 border-l-4 border-l-blue-400 surface-hover">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="label-xs text-brand">Focus 03 • Progress</span>
              <span className="badge text-xs bg-paper text-ink-secondary">WEEK 4 OF 12</span>
            </div>

            <div>
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Am I Making Progress?</h2>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-[var(--text-heading)]">{profile.weightKg} kg</span>
                <span className="text-xs font-bold text-brand">-2.3kg total loss</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Waist: {profile.waistCm} cm (-2.5cm reduction)</p>
            </div>

            {/* Latest Coach Feedback Note */}
            <div className="p-3.5 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase">
                <span className="text-brand flex items-center gap-1"><ShieldCheck size={12} /> Coach feedback</span>
                <span>2d ago</span>
              </div>
              <p className="text-xs text-[var(--text-primary)] italic leading-relaxed">
                &quot;Great pacing on your push workout! Keep plantain to 4 slices maximum post-workout.&quot;
              </p>
            </div>
          </div>

          <Link
            href="/client/check-in"
            className="btn-secondary text-xs w-full justify-center py-3 font-bold"
          >
            <Calendar size={14} className="text-brand" /> Submit Weekly Check-In
          </Link>
        </div>

      </div>

      {/* QUICK METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
        <div className="surface p-4 space-y-1">
          <span className="label-xs text-[var(--text-muted)]">Daily Water</span>
          <p className="text-xl font-extrabold text-brand">2.5 / 3.0 <span className="text-xs font-normal text-[var(--text-muted)]">L</span></p>
          <p className="text-xs text-[var(--text-muted)]">Hydration baseline</p>
        </div>

        <div className="surface p-4 space-y-1">
          <span className="label-xs text-[var(--text-muted)]">Daily Steps</span>
          <p className="text-xl font-extrabold text-brand">8,420 <span className="text-xs font-normal text-[var(--text-muted)]">steps</span></p>
          <p className="text-xs text-[var(--text-muted)]">Goal: 8,000 / day</p>
        </div>

        <div className="surface p-4 space-y-1">
          <span className="label-xs text-[var(--text-muted)]">Streak</span>
          <p className="text-xl font-extrabold text-status-pending">14 Days</p>
          <p className="text-xs text-[var(--text-muted)]">Nutrition logging</p>
        </div>

        <div className="surface p-4 space-y-1">
          <span className="label-xs text-[var(--text-muted)]">Adherence Score</span>
          <p className="text-xl font-extrabold text-status-approved">92%</p>
          <p className="text-xs text-[var(--text-muted)]">Excellent rating</p>
        </div>
      </div>
    </ClientAppShell>
  );
}
