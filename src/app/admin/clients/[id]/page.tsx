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
  const [targets, setTargets] = useState({ startingWeightKg: '', targetWeightKg: '', programmeDurationWeeks: '12', programmeStartDate: '' });
  const [savingTargets, setSavingTargets] = useState(false);
  const [targetsMsg, setTargetsMsg] = useState('');

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
      if (match?.profile) {
        setTargets({
          startingWeightKg: match.profile.startingWeightKg != null ? String(match.profile.startingWeightKg) : String(match.profile.weightKg ?? ''),
          targetWeightKg: match.profile.targetWeightKg != null ? String(match.profile.targetWeightKg) : '',
          programmeDurationWeeks: String(match.profile.programmeDurationWeeks ?? 12),
          programmeStartDate: match.profile.programmeStartDate ? String(match.profile.programmeStartDate).slice(0, 10) : '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveTargets = async () => {
    setSavingTargets(true);
    setTargetsMsg('');
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targets),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      setTargetsMsg('Saved');
      fetchClientFile();
    } catch (e: any) {
      setTargetsMsg(e.message || 'Could not save');
    } finally {
      setSavingTargets(false);
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
      title={`Client Profile: ${client?.firstName || ''} ${client?.lastName || ''}`}
      subtitle="Nutrition targets, training programme, meal logs and weekly check-ins in one place."
    >
      {/* Top Breadcrumb & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/admin/clients" className="text-xs text-brand hover:underline flex items-center gap-1.5 font-bold">
          <ArrowLeft size={14} /> Back to Clients Roster
        </Link>

        <a
          href={`https://wa.me/2348012345678?text=${encodeURIComponent(
            `Hello ${client?.firstName}, Coach Eric here, reviewing your ERICONET profile.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand text-xs py-2 px-4 bg-status-approved hover:brightness-95 text-brand-on-strong font-black self-start sm:self-auto"
        >
          <MessageCircle size={15} /> Message on WhatsApp
        </a>
      </div>

      {/* Client summary */}
      <div className="surface p-6 sm:p-7 space-y-6 border border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-strong text-brand-on-strong font-black text-xl flex items-center justify-center shadow-lg">
              {client?.firstName?.charAt(0)}{client?.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-heading)]">{client?.firstName} {client?.lastName}</h2>
              <p className="text-xs text-[var(--text-muted)]">{client?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge text-xs${
                  sub.isTrial ? 'badge-trial' :
                  sub.planTier === 'GOLD' ? 'badge-tier-gold' :
                  sub.planTier === 'DIAMOND' ? 'badge-tier-diamond' :
                  'bg-paper text-ink-secondary'
                }`}>
                  {sub.isTrial ? '14-Day Free Trial' : `${sub.planTier} Tier`}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{p.sex} • Age {p.age}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-[var(--text-muted)]">Current Weight:</span>
              <p className="text-base font-black text-brand">{p.weightKg} kg</p>
            </div>
            <div className="text-right">
              <span className="text-[var(--text-muted)]">Waistline:</span>
              <p className="text-base font-black text-brand">{p.waistCm} cm</p>
            </div>
          </div>
        </div>

        {/* Programme targets (feed the meal plan cover and progress reports) */}
        <div className="pb-4 border-b border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <p className="section-title text-sm">Programme targets</p>
            {targetsMsg && <span className="text-xs text-[var(--text-muted)]">{targetsMsg}</span>}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="field-label">Starting weight (kg)</label>
              <input type="number" step="0.1" className="field-input" value={targets.startingWeightKg} onChange={(e) => setTargets({ ...targets, startingWeightKg: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Target weight (kg)</label>
              <input type="number" step="0.1" className="field-input" value={targets.targetWeightKg} onChange={(e) => setTargets({ ...targets, targetWeightKg: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Programme length</label>
              <select className="field-input" value={targets.programmeDurationWeeks} onChange={(e) => setTargets({ ...targets, programmeDurationWeeks: e.target.value })}>
                {[8, 12, 16, 24].map((w) => <option key={w} value={w}>{w} weeks</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Start date</label>
              <input type="date" className="field-input" value={targets.programmeStartDate} onChange={(e) => setTargets({ ...targets, programmeStartDate: e.target.value })} />
            </div>
            <button type="button" onClick={saveTargets} disabled={savingTargets} className="btn-brand text-xs py-2.5 w-full">
              {savingTargets ? 'Saving…' : 'Save targets'}
            </button>
          </div>
        </div>

        {/* 4 Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-brand-strong text-brand-on-strong shadow-sm'
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
                ? 'bg-brand-strong text-brand-on-strong shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
            }`}
          >
            Meal logs ({meals.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WORKOUTS')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'WORKOUTS'
                ? 'bg-brand-strong text-brand-on-strong shadow-sm'
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
                ? 'bg-brand-strong text-brand-on-strong shadow-sm'
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
              <div className="p-4 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">BMR</span>
                <p className="text-lg font-black text-[var(--text-heading)]">{p.bmr || 1800} kcal</p>
              </div>
              <div className="p-4 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">TDEE</span>
                <p className="text-lg font-black text-[var(--text-heading)]">{p.tdee || 2700} kcal</p>
              </div>
              <div className="p-4 bg-paper rounded-xl border border-line-active space-y-0.5">
                <span className="label-xs text-brand">Prescribed Target</span>
                <p className="text-lg font-black text-brand">{p.dailyCalories || 2200} kcal</p>
              </div>
              <div className="p-4 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">Protein Target</span>
                <p className="text-lg font-black text-brand">{p.targetProteinG || 180}g</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)]">
              <div className="p-4 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-2">
                <p className="font-bold text-[var(--text-heading)] uppercase text-xs">Training Specs</p>
                <p>Environment: <strong className="text-[var(--text-heading)]">{p.trainingEnvironment || 'Both'}</strong></p>
                <p>Experience: <strong className="text-[var(--text-heading)]">{p.trainingExperience || '1-2 years'}</strong></p>
                <p>Frequency: <strong className="text-[var(--text-heading)]">{p.preferredWorkoutDays || 4} days / week</strong></p>
                <p>Equipment: <strong className="text-[var(--text-heading)]">{p.availableEquipment || 'Dumbbells, Barbells'}</strong></p>
              </div>

              <div className="p-4 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-2">
                <p className="font-bold text-[var(--text-heading)] uppercase text-xs">Dietary Specs</p>
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
                    <span className="badge text-xs bg-paper text-ink-secondary">{m.mealType}</span>
                    <span className="font-bold text-[var(--text-heading)]">{m.rawInput}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    ~{m.foodAnalysis?.estimatedCalories || 500} kcal • {m.foodAnalysis?.estimatedProtein || 30}g Protein
                  </p>
                </div>
                <span className={`badge text-xs${m.status === 'APPROVED' ? 'badge-approved' : 'badge-pending'}`}>
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
                  <span className="badge badge-trial text-xs">{wp.durationWeeks} Weeks</span>
                </div>
                <p className="text-[var(--text-muted)]">Goal: {wp.goal}</p>
                <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                  {(wp.workouts || []).map((w: any) => (
                    <div key={w.id} className="p-2.5 bg-paper rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--text-heading)]">{w.dayName}: {w.title}</span>
                      <span className="text-brand font-bold">{w.exercises?.length || 0} Exercises</span>
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
                  <span className={`badge text-xs${ci.status === 'REVIEWED' ? 'badge-approved' : 'badge-pending'}`}>
                    {ci.status}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] italic">&quot;{ci.challenges || 'No challenges reported'}&quot;</p>
                {ci.coachFeedback && (
                  <p className="text-brand pt-1 border-t border-[var(--border-subtle)] font-medium">
                    Coach Eric: &quot;{ci.coachFeedback}&quot;
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
