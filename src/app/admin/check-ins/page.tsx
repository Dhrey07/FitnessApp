'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function AdminCheckInsPage() {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<any>(null);
  const [coachFeedback, setCoachFeedback] = useState('');
  const [adjustedCalories, setAdjustedCalories] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/check-ins');
      const data = await res.json();
      setCheckIns(data.checkIns || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCheckIn = (ci: any) => {
    setSelectedCheckIn(ci);
    setAdjustedCalories(String(ci.user?.profile?.dailyCalories || 2200));
    setCoachFeedback(
      ci.coachFeedback ||
        `Good week, ${ci.user?.firstName}. Weight and waist are moving in the right direction and training was consistent. No change to targets this week.`
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCheckIn) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkInId: selectedCheckIn.id,
          coachFeedback,
          adjustedCalorieTarget: adjustedCalories,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Review sent to the client.');
        setSelectedCheckIn(null);
        fetchCheckIns();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAppShell
      title="Check-in reviews"
      subtitle="Read each week's numbers and notes, write feedback, and adjust calories only when the trend calls for it."
    >
      {successMsg && (
        <div className="p-4 rounded-xl bg-status-approved/15 border border-status-approved/40 text-status-approved text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Check-Ins Queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title text-sm">Check-ins ({checkIns.length})</h3>
            <span className="text-xs text-[var(--text-muted)]">Newest first</span>
          </div>

          <div className="space-y-3">
            {checkIns.map((ci) => {
              const isSelected = selectedCheckIn?.id === ci.id;
              const isReviewed = ci.status === 'REVIEWED';

              return (
                <div
                  key={ci.id}
                  onClick={() => handleSelectCheckIn(ci)}
                  className={`surface p-5 space-y-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-line-active shadow-md'
                      : 'hover:border-[var(--border-active)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-brand-soft text-brand font-bold text-xs flex items-center justify-center">
                        {ci.user?.firstName?.charAt(0)}
                      </div>
                      <span className="font-bold text-[var(--text-heading)] text-xs">{ci.user?.firstName} {ci.user?.lastName}</span>
                    </div>
                    <span className={`badge text-xs${isReviewed ? 'badge-approved' : 'badge-pending'}`}>
                      {ci.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-paper rounded-lg">
                      <span className="text-xs text-[var(--text-muted)] block">Weight</span>
                      <strong className="text-brand">{ci.currentWeightKg} kg</strong>
                    </div>
                    <div className="p-2 bg-paper rounded-lg">
                      <span className="text-xs text-[var(--text-muted)] block">Waist</span>
                      <strong className="text-brand">{ci.waistCm} cm</strong>
                    </div>
                    <div className="p-2 bg-paper rounded-lg">
                      <span className="text-xs text-[var(--text-muted)] block">Training</span>
                      <strong className="text-status-approved">
                        {ci.trainingSessionsCompleted != null && ci.trainingSessionsPlanned ? `${ci.trainingSessionsCompleted}/${ci.trainingSessionsPlanned}` : `${ci.workoutAdherence}%`}
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] italic truncate">
                    &quot;{ci.challenges || 'No challenges reported'}&quot;
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Review panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="surface p-6 sm:p-7 space-y-5 border border-line-active sticky top-20">
            <div>
              <span className="label-xs text-brand">Coach feedback</span>
              <h3 className="text-base font-bold text-[var(--text-heading)] mt-1">
                {selectedCheckIn
                  ? `Reviewing ${selectedCheckIn.user?.firstName}'s Check-In`
                  : 'Select an Assessment from the Queue'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Write the week's feedback. Change the calorie target only if the trend needs it.
              </p>
            </div>

            {selectedCheckIn ? (
              <form onSubmit={handleSubmitReview} className="space-y-4 animate-fade-in">
                {/* The full brief check-in: measurements, consistency, how it felt, notes */}
                <dl className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    ['Weight', `${selectedCheckIn.currentWeightKg} kg`],
                    ['Waist', `${selectedCheckIn.waistCm} cm`],
                    ['Avg steps', selectedCheckIn.averageDailySteps ? selectedCheckIn.averageDailySteps.toLocaleString() : '—'],
                    ['Training', selectedCheckIn.trainingSessionsCompleted != null && selectedCheckIn.trainingSessionsPlanned ? `${selectedCheckIn.trainingSessionsCompleted} of ${selectedCheckIn.trainingSessionsPlanned}` : `${selectedCheckIn.workoutAdherence}%`],
                    ['Nutrition', `${selectedCheckIn.nutritionAdherence}%`],
                    ['Hunger', selectedCheckIn.hungerLevel ? `${selectedCheckIn.hungerLevel}/5` : '—'],
                    ['Energy', `${selectedCheckIn.energyLevel}/5`],
                    ['Sleep', `${selectedCheckIn.sleepQuality}/5`],
                    ['Stress', selectedCheckIn.stressLevel ? `${selectedCheckIn.stressLevel}/5` : '—'],
                    ['Difficulty', selectedCheckIn.difficultyLevel],
                  ].map(([k, v]) => (
                    <div key={k as string} className="p-2.5 rounded-lg bg-paper border border-line">
                      <dt className="text-ink-muted">{k}</dt>
                      <dd className="font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="space-y-2 text-xs">
                  {[
                    ['Challenges', selectedCheckIn.challenges],
                    ['Wins', selectedCheckIn.wins],
                    ['Needs help with', selectedCheckIn.helpNeeded || selectedCheckIn.generalFeedback],
                    ['Trend summary', selectedCheckIn.aiTrendsSummary],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k as string} className="p-3 rounded-xl bg-paper border border-line">
                      <p className="label-xs text-ink-muted mb-0.5">{k}</p>
                      <p className="text-ink-secondary leading-relaxed">{v}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="field-label">Daily calorie target (kcal)</label>
                  <input
                    type="number"
                    value={adjustedCalories}
                    onChange={(e) => setAdjustedCalories(e.target.value)}
                    className="field-input font-bold text-brand"
                  />
                </div>

                <div>
                  <label className="field-label">Written feedback to the client</label>
                  <textarea
                    rows={4}
                    required
                    value={coachFeedback}
                    onChange={(e) => setCoachFeedback(e.target.value)}
                    className="field-input resize-none text-xs"
                  />
                </div>

                <Link
                  href={`/admin/clients/${selectedCheckIn.userId}/reports/new?checkInId=${selectedCheckIn.id}`}
                  className="btn-secondary text-xs w-full justify-center py-2.5"
                >
                  Create progress report from this check-in
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-md"
                >
                  {submitting ? 'Sending…' : 'Send review'} <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <div className="p-8 text-center bg-paper rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs space-y-2">
                <Calendar size={24} className="mx-auto text-ink-muted" />
                <p>Click any check-in on the left to write review feedback and adjust calorie targets.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminAppShell>
  );
}
