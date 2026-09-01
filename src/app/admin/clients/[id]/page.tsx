'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import {
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';

export default function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;

  const [client, setClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'NUTRITION' | 'WORKOUTS' | 'CHECKINS'>('OVERVIEW');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientFile();
  }, [clientId]);

  const fetchClientFile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients?search=`);
      const data = await res.json();
      const match = (data.clients || []).find((c: any) => c.id === clientId);
      setClient(match);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!client && !loading) {
    return (
      <AdminAppShell title="Client Not Found">
        <div className="surface p-8 text-center space-y-4">
          <p className="text-sm text-[var(--text-muted)]">Client profile could not be loaded.</p>
          <Link href="/admin/clients" className="btn-brand text-xs inline-flex">
            <ArrowLeft size={14} /> Back to Roster
          </Link>
        </div>
      </AdminAppShell>
    );
  }

  const p = client?.profile || {};
  const sub = client?.subscriptions?.[0] || { planTier: 'FREE', status: 'ACTIVE' };
  const checkIns = client?.weeklyCheckIns || [];
  const meals = client?.foodSubmissions || [];
  const workoutPlans = client?.workoutPlansReceived || [];

  return (
    <AdminAppShell
      title={`Client 360° File: ${client?.firstName || ''} ${client?.lastName || ''}`}
      subtitle="Complete chronological dossier, prescribed nutrition targets, workout assignments, and check-ins."
    >
      {/* Top Breadcrumb & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/admin/clients" className="text-xs text-purple-400 hover:underline flex items-center gap-1.5 font-bold">
          <ArrowLeft size={14} /> Back to Clients Roster
        </Link>

        <a
          href={`https://wa.me/2348012345678?text=${encodeURIComponent(
            `Hello ${client?.firstName}, Coach Lekan here reviewing your Fitness Police file.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand text-xs py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black self-start sm:self-auto"
        >
          <MessageCircle size={15} /> Message on WhatsApp
        </a>
      </div>

      {/* Hero Bio Dossier Surface */}
      <div className="surface p-6 sm:p-7 space-y-6 border border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg">
              {client?.firstName?.charAt(0)}{client?.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-heading)]">{client?.firstName} {client?.lastName}</h2>
              <p className="text-xs text-[var(--text-muted)]">{client?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge text-[9px] ${
                  sub.isTrial ? 'badge-trial' :
                  sub.planTier === 'GOLD' ? 'badge-tier-gold' :
                  sub.planTier === 'DIAMOND' ? 'badge-tier-diamond' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {sub.isTrial ? '14-Day Free Trial' : `${sub.planTier} Tier`}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">{p.sex} • Age {p.age}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-[var(--text-muted)]">Current Weight:</span>
              <p className="text-base font-black text-sky-400">{p.weightKg} kg</p>
            </div>
            <div className="text-right">
              <span className="text-[var(--text-muted)]">Waistline:</span>
              <p className="text-base font-black text-cyan-400">{p.waistCm} cm</p>
            </div>
          </div>
        </div>

        {/* 4 Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('NUTRITION')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'NUTRITION'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
            }`}
          >
            Food Police Logs ({meals.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WORKOUTS')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'WORKOUTS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
            }`}
          >
            Workouts & Plans ({workoutPlans.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CHECKINS')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'CHECKINS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
            }`}
          >
            Check-In History ({checkIns.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-950/40 rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">BMR</span>
                <p className="text-lg font-black text-[var(--text-heading)]">{p.bmr || 1800} kcal</p>
              </div>
              <div className="p-4 bg-slate-950/40 rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">TDEE</span>
                <p className="text-lg font-black text-[var(--text-heading)]">{p.tdee || 2700} kcal</p>
              </div>
              <div className="p-4 bg-slate-950/40 rounded-xl border border-sky-500/40 space-y-0.5">
                <span className="label-xs text-sky-400">Prescribed Target</span>
                <p className="text-lg font-black text-sky-400">{p.dailyCalories || 2200} kcal</p>
              </div>
              <div className="p-4 bg-slate-950/40 rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">Protein Target</span>
                <p className="text-lg font-black text-cyan-400">{p.targetProteinG || 180}g</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)]">
              <div className="p-4 bg-slate-950/40 rounded-xl border border-[var(--border-subtle)] space-y-2">
                <p className="font-bold text-[var(--text-heading)] uppercase text-[11px]">Training Specs</p>
                <p>Environment: <strong className="text-[var(--text-heading)]">{p.trainingEnvironment || 'Both'}</strong></p>
                <p>Experience: <strong className="text-[var(--text-heading)]">{p.trainingExperience || '1-2 years'}</strong></p>
                <p>Frequency: <strong className="text-[var(--text-heading)]">{p.preferredWorkoutDays || 4} days / week</strong></p>
                <p>Equipment: <strong className="text-[var(--text-heading)]">{p.availableEquipment || 'Dumbbells, Barbells'}</strong></p>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-xl border border-[var(--border-subtle)] space-y-2">
                <p className="font-bold text-[var(--text-heading)] uppercase text-[11px]">Dietary Specs</p>
                <p>Preference: <strong className="text-[var(--text-heading)]">{p.dietaryPreference || 'Omnivore'}</strong></p>
                <p>Allergies: <strong className="text-[var(--text-heading)]">{p.allergies || 'None'}</strong></p>
                <p>Restrictions: <strong className="text-[var(--text-heading)]">{p.foodRestrictions || 'None'}</strong></p>
                <p>Meal Frequency: <strong className="text-[var(--text-heading)]">{p.typicalMealFrequency || 3} meals / day</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NUTRITION LOGS */}
        {activeTab === 'NUTRITION' && (
          <div className="space-y-3 animate-fade-in">
            {meals.map((m: any) => (
              <div key={m.id} className="p-4 surface rounded-xl border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge text-[9px] bg-slate-900/80 text-slate-300">{m.mealType}</span>
                    <span className="font-bold text-[var(--text-heading)]">{m.rawInput}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    ~{m.foodAnalysis?.estimatedCalories || 500} kcal • {m.foodAnalysis?.estimatedProtein || 30}g Protein
                  </p>
                </div>
                <span className={`badge text-[9px] ${m.status === 'APPROVED' ? 'badge-approved' : 'badge-pending'}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: WORKOUTS */}
        {activeTab === 'WORKOUTS' && (
          <div className="space-y-4 animate-fade-in">
            {workoutPlans.map((wp: any) => (
              <div key={wp.id} className="p-5 surface rounded-xl border border-[var(--border-subtle)] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[var(--text-heading)] text-sm">{wp.title}</h4>
                  <span className="badge badge-trial text-[10px]">{wp.durationWeeks} Weeks</span>
                </div>
                <p className="text-[var(--text-muted)]">Goal: {wp.goal}</p>
                <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                  {(wp.workouts || []).map((w: any) => (
                    <div key={w.id} className="p-2.5 bg-slate-950/40 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--text-heading)]">{w.dayName}: {w.title}</span>
                      <span className="text-sky-400 font-bold">{w.exercises?.length || 0} Exercises</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CHECK-INS */}
        {activeTab === 'CHECKINS' && (
          <div className="space-y-3 animate-fade-in">
            {checkIns.map((ci: any) => (
              <div key={ci.id} className="p-5 surface rounded-xl border border-[var(--border-subtle)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-heading)] text-sm">Weight: {ci.currentWeightKg}kg • Waist: {ci.waistCm}cm</span>
                  <span className={`badge text-[9px] ${ci.status === 'REVIEWED' ? 'badge-approved' : 'badge-pending'}`}>
                    {ci.status}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] italic">&quot;{ci.challenges || 'No challenges reported'}&quot;</p>
                {ci.coachFeedback && (
                  <p className="text-sky-400 pt-1 border-t border-[var(--border-subtle)] font-medium">
                    Coach Lekan: &quot;{ci.coachFeedback}&quot;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminAppShell>
  );
}
