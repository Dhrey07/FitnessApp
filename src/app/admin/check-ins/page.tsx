'use client';

import React, { useState, useEffect } from 'react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function AdminCheckInsPage() {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<any>(null);
  const [coachFeedback, setCoachFeedback] = useState('Great pacing this week! Keep hydration up.');
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
        `Strong consistency, ${ci.user?.firstName}! Your metrics are trending on point with our fat loss model. Let's keep intensity high on your compound lifts.`
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
        setSuccessMsg('Check-In reviewed successfully and sent to athlete!');
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
      title="Weekly Check-In Review Queue"
      subtitle="Analyze athlete Sunday assessments, evaluate adherence scores, and issue targeted coaching directives."
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
            <h3 className="section-title text-sm">Sunday Check-Ins ({checkIns.length})</h3>
            <span className="text-xs text-[var(--text-muted)]">Weekly Trajectory</span>
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
                      <span className="text-xs text-[var(--text-muted)] block">Adherence</span>
                      <strong className="text-status-approved">{ci.workoutAdherence || 85}%</strong>
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
                Issue authoritative coach feedback and optionally calibrate daily calories.
              </p>
            </div>

            {selectedCheckIn ? (
              <form onSubmit={handleSubmitReview} className="space-y-4 animate-fade-in">
                <div className="p-3.5 bg-paper rounded-xl border border-[var(--border-subtle)] space-y-1.5 text-xs">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Athlete Submission Notes:</span>
                  <p className="text-[var(--text-secondary)] italic">&quot;{selectedCheckIn.challenges}&quot;</p>
                </div>

                <div>
                  <label className="field-label">Calibrate Daily Calorie Target (kcal)</label>
                  <input
                    type="number"
                    value={adjustedCalories}
                    onChange={(e) => setAdjustedCalories(e.target.value)}
                    className="field-input font-bold text-brand"
                  />
                </div>

                <div>
                  <label className="field-label">Coach Written Feedback</label>
                  <textarea
                    rows={4}
                    required
                    value={coachFeedback}
                    onChange={(e) => setCoachFeedback(e.target.value)}
                    className="field-input resize-none text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-md"
                >
                  {submitting ? 'Delivering Review...' : 'Deliver Official Coach Review'} <ArrowRight size={14} />
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
