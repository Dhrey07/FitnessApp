'use client';

import React, { useState, useEffect } from 'react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import {
  CheckCircle2,
  Utensils,
} from 'lucide-react';

export default function AdminFoodPoliceQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [adjCalories, setAdjCalories] = useState('500');
  const [adjProtein, setAdjProtein] = useState('35');
  const [adjCarbs, setAdjCarbs] = useState('50');
  const [adjFat, setAdjFat] = useState('15');
  const [coachFeedback, setCoachFeedback] = useState('Portions look well balanced. Keep plantain to 4 slices post workout.');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/food-police/queue');
      const data = await res.json();
      setQueue(data.queue || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMeal = (meal: any) => {
    setSelectedMeal(meal);
    const ai = meal.foodAnalysis;
    setAdjCalories(String(ai?.estimatedCalories || 500));
    setAdjProtein(String(ai?.estimatedProtein || 35));
    setAdjCarbs(String(ai?.estimatedCarbs || 50));
    setAdjFat(String(ai?.estimatedFat || 15));
  };

  const handleReviewMeal = async (action: 'APPROVE' | 'MODIFY') => {
    if (!selectedMeal) return;
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/food-police/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedMeal.id,
          action,
          coachFeedback,
          finalCalories: action === 'MODIFY' ? parseFloat(adjCalories) : undefined,
          finalProtein: action === 'MODIFY' ? parseFloat(adjProtein) : undefined,
          finalCarbs: action === 'MODIFY' ? parseFloat(adjCarbs) : undefined,
          finalFat: action === 'MODIFY' ? parseFloat(adjFat) : undefined,
        }),
      });

      if (res.ok) {
        setSuccessMsg(`Meal successfully marked as ${action === 'APPROVE' ? 'Approved' : 'Modified'} by Coach!`);
        setSelectedMeal(null);
        fetchQueue();
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
      title="Food Police Review & Decision Queue"
      subtitle="Verify client meals, calibrate portion yields, and deliver personalized cultural nutrition feedback."
    >
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Submissions Queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title text-sm">Meals Awaiting Coach Verification</h3>
            <span className="text-xs text-[var(--text-muted)]">{queue.length} Submissions</span>
          </div>

          <div className="space-y-3">
            {queue.map((sub) => {
              const isSelected = selectedMeal?.id === sub.id;
              const ai = sub.foodAnalysis;
              const isApproved = sub.status === 'APPROVED';

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectMeal(sub)}
                  className={`surface p-5 space-y-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 shadow-md'
                      : 'hover:border-[var(--border-active)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="badge text-[9px] bg-slate-900/80 text-slate-300">{sub.mealType}</span>
                      <span className="font-bold text-[var(--text-heading)] text-xs">{sub.user?.firstName || 'Client'}</span>
                    </div>
                    <span className={`badge text-[9px] ${isApproved ? 'badge-approved' : 'badge-pending'}`}>
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-primary)] font-medium">
                    &quot;{sub.rawInput}&quot;
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-center text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                    <span>{ai?.estimatedCalories || 500} kcal</span>
                    <span>{ai?.estimatedProtein || 35}g Pro</span>
                    <span>{ai?.estimatedCarbs || 50}g Carb</span>
                    <span>{ai?.estimatedFat || 15}g Fat</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Coach Review & Adjustment Console */}
        <div className="lg:col-span-6 space-y-4">
          <div className="surface p-6 sm:p-7 space-y-5 border border-purple-500/30 sticky top-20">
            <div>
              <span className="label-xs text-purple-400">Coach Decision Console</span>
              <h3 className="text-base font-bold text-[var(--text-heading)] mt-1">
                {selectedMeal ? `Reviewing ${selectedMeal.user?.firstName || 'Client'}'s ${selectedMeal.mealType}` : 'Select a Meal from the Queue'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Inspect AI portion yields and submit your authoritative review.
              </p>
            </div>

            {selectedMeal ? (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] italic">
                  &quot;{selectedMeal.rawInput}&quot;
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="field-label">Calories</label>
                    <input
                      type="number"
                      value={adjCalories}
                      onChange={(e) => setAdjCalories(e.target.value)}
                      className="field-input text-center text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="field-label">Protein (g)</label>
                    <input
                      type="number"
                      value={adjProtein}
                      onChange={(e) => setAdjProtein(e.target.value)}
                      className="field-input text-center text-xs font-bold text-sky-400"
                    />
                  </div>
                  <div>
                    <label className="field-label">Carbs (g)</label>
                    <input
                      type="number"
                      value={adjCarbs}
                      onChange={(e) => setAdjCarbs(e.target.value)}
                      className="field-input text-center text-xs font-bold text-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="field-label">Fats (g)</label>
                    <input
                      type="number"
                      value={adjFat}
                      onChange={(e) => setAdjFat(e.target.value)}
                      className="field-input text-center text-xs font-bold text-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Coach Written Feedback & Swaps</label>
                  <textarea
                    rows={3}
                    value={coachFeedback}
                    onChange={(e) => setCoachFeedback(e.target.value)}
                    className="field-input resize-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleReviewMeal('APPROVE')}
                    className="btn-brand text-xs justify-center py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                  >
                    <CheckCircle2 size={14} /> Approve AI Output
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleReviewMeal('MODIFY')}
                    className="btn-secondary text-xs justify-center py-3 font-bold border-purple-500/40 text-purple-400 hover:bg-purple-950/40"
                  >
                    Submit Adjustments
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] text-xs space-y-2">
                <Utensils size={24} className="mx-auto text-slate-600" />
                <p>Click any meal on the left to verify calories, edit macros, and send feedback.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminAppShell>
  );
}
