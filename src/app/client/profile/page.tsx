'use client';

import React, { useState, useEffect } from 'react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { PLAN_DETAILS, PlanTier } from '@/lib/services/entitlements';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function ClientProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'MEMBERSHIP' | 'APPEARANCE'>('PROFILE');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeTier = async (planTier: PlanTier) => {
    if (!user) return;
    setUpgrading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planTier }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upgrade');

      setSuccessMsg(`You are now on ${PLAN_DETAILS[data.subscription?.planTier as PlanTier]?.name ?? data.subscription?.planTier}. All features are active.`);
      fetchProfile();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setUpgrading(false);
    }
  };

  const p = user?.profile || {
    age: 29,
    sex: 'male',
    heightCm: 180,
    weightKg: 84.2,
    waistCm: 87,
    primaryGoal: 'FAT_LOSS',
    activityLevel: 'MODERATELY_ACTIVE',
    bmr: 1845,
    tdee: 2860,
    dailyCalories: 2288,
    targetProteinG: 187,
    targetCarbsG: 229,
    targetFatG: 64,
  };

  const sub = user?.subscription;
  const trialInfo = user?.trialInfo;

  return (
    <ClientAppShell
      title="Personal Profile & Account Settings"
      subtitle="Manage your biological assessment metrics, transparent nutrition calculations, subscription tier, and visual theme."
    >
      {/* Settings Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('PROFILE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PROFILE'
              ? 'bg-brand-strong text-brand-on-strong shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
          }`}
        >
          Bio & Formula
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('MEMBERSHIP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'MEMBERSHIP'
              ? 'bg-brand-strong text-brand-on-strong shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
          }`}
        >
          Membership & Tiers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('APPEARANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'APPEARANCE'
              ? 'bg-brand-strong text-brand-on-strong shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
          }`}
        >
          Appearance & Theme
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-status-approved/15 border border-status-approved/40 text-status-approved text-xs flex items-center gap-2 animate-fade-in w-full">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-status-rejected/15 border border-status-rejected/40 text-status-rejected text-xs flex items-center gap-2 animate-fade-in w-full">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: BIO & FORMULA */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full animate-fade-in">
          
          {/* Personal Assessment Bio */}
          <div className="lg:col-span-6 surface p-6 sm:p-7 space-y-6 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-brand-on-strong font-black text-xl shadow-md bg-brand-strong">
                {user?.firstName?.charAt(0) || 'C'}{user?.lastName?.charAt(0) || 'O'}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[var(--text-heading)]">{user?.firstName} {user?.lastName}</h2>
                <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-trial text-xs">{sub?.planTier || 'FREE'} TIER</span>
                  <span className="text-xs text-[var(--text-muted)] capitalize">{p.sex} • Age {p.age}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="p-3 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">Height</span>
                <p className="text-base font-bold text-[var(--text-heading)]">{p.heightCm} cm</p>
              </div>
              <div className="p-3 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">Weight</span>
                <p className="text-base font-bold text-brand">{p.weightKg} kg</p>
              </div>
              <div className="p-3 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-0.5">
                <span className="label-xs text-[var(--text-muted)]">Waist</span>
                <p className="text-base font-bold text-brand">{p.waistCm} cm</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Primary Goal</span>
                <strong className="text-brand uppercase">{p.primaryGoal?.replace('_', ' ')}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Activity Level</span>
                <strong className="text-[var(--text-heading)]">{p.activityLevel?.replace('_', ' ')}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Training Experience</span>
                <strong className="text-[var(--text-heading)]">{p.trainingExperience || '1-2 years'}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--text-muted)]">Dietary Style</span>
                <strong className="text-[var(--text-heading)]">{p.dietaryPreference || 'Omnivore'}</strong>
              </div>
            </div>
          </div>

          {/* Formula Transparency Card */}
          <div className="lg:col-span-6 surface p-6 sm:p-7 space-y-5 border border-[var(--border-subtle)]">
            <div>
              <span className="label-xs text-brand">Formula Breakdown</span>
              <h3 className="text-base font-bold text-[var(--text-heading)] mt-1">Mifflin-St Jeor Calculation Breakdown</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Transparent math behind your prescribed daily nutrition targets.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-1">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Basal Metabolic Rate</span>
                <p className="text-lg font-black text-[var(--text-heading)]">{p.bmr} kcal</p>
                <p className="text-xs text-[var(--text-muted)]">Energy burned at absolute rest</p>
              </div>
              <div className="p-3.5 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-1">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Maintenance (TDEE)</span>
                <p className="text-lg font-black text-[var(--text-heading)]">{p.tdee} kcal</p>
                <p className="text-xs text-[var(--text-muted)]">Energy burned with daily movement</p>
              </div>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-line-active space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-heading)]">Prescribed Calorie Target:</span>
                <span className="text-base font-black text-brand">{p.dailyCalories} kcal / day</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-1.5 bg-paper rounded-lg">
                  <span className="font-bold text-brand block text-xs">{p.targetProteinG}g</span> Protein
                </div>
                <div className="p-1.5 bg-paper rounded-lg">
                  <span className="font-bold text-brand block text-xs">{p.targetCarbsG}g</span> Carbs
                </div>
                <div className="p-1.5 bg-paper rounded-lg">
                  <span className="font-bold text-status-pending block text-xs">{p.targetFatG}g</span> Fats
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MEMBERSHIP & TIERS */}
      {(activeTab === 'MEMBERSHIP' || activeTab === 'PROFILE') && (
        <div id="membership" className="space-y-4 pt-4 w-full animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="section-title text-base">Membership & Coaching Tier Management</h3>
              <p className="text-xs text-[var(--text-muted)]">Upgrade or manage your active coaching plan.</p>
            </div>
            {trialInfo?.isTrial && (
              <span className="badge badge-trial text-xs">
                <Clock size={12} /> Trial: Day {trialInfo.currentDay} of 14
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
            {[PLAN_DETAILS.SILVER, PLAN_DETAILS.GOLD, PLAN_DETAILS.DIAMOND].map((plan) => {
              const isCurrent = sub?.planTier === plan.tier && !sub?.isTrial;
              const isGold = plan.tier === 'GOLD';

              return (
                <div
                  key={plan.tier}
                  className={`surface p-6 flex flex-col justify-between space-y-6 relative ${
                    isGold ? 'border-2 border-line-active shadow-xl' : 'border-[var(--border-subtle)]'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 right-4 bg-brand-strong text-brand-on-strong text-xs font-black uppercase px-2.5 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="label-xs text-brand">{plan.tier}</span>
                      <h4 className="text-lg font-extrabold text-[var(--text-heading)] mt-0.5">{plan.name}</h4>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-[var(--text-heading)]">₦{plan.priceNgn.toLocaleString()}</span>
                        <span className="text-xs text-[var(--text-muted)]">/ mo</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{plan.tagline}</p>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                      {plan.bulletPoints.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-brand shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)]">
                    {isCurrent ? (
                      <span className="badge badge-approved text-xs w-full justify-center py-2.5">
                        <CheckCircle2 size={14} /> Current Active Tier
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={upgrading}
                        onClick={() => handleUpgradeTier(plan.tier)}
                        className={`text-xs w-full justify-center py-3 font-extrabold ${
                          isGold ? 'btn-brand shadow-md' : 'btn-secondary'
                        }`}
                      >
                        {upgrading ? 'Processing...' : `Upgrade to ${plan.tier}`} <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: APPEARANCE & THEME */}
      {activeTab === 'APPEARANCE' && (
        <div className="surface p-6 sm:p-7 space-y-5 border border-[var(--border-subtle)] max-w-xl animate-fade-in">
          <div>
            <span className="label-xs text-brand">Visual Experience</span>
            <h3 className="text-base font-bold text-[var(--text-heading)] mt-1">Theme Preferences</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Select your preferred color theme. System mode respects your operating system preference automatically.
            </p>
          </div>

          <div className="pt-2">
            <ThemeToggle variant="buttons" className="w-full justify-center py-2" />
          </div>
        </div>
      )}

    </ClientAppShell>
  );
}
