'use client';

import React, { useState, useEffect } from 'react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

export default function CheckInClientPage() {
  const [user, setUser] = useState<any>(null);
  const [weightKg, setWeightKg] = useState('84.2');
  const [waistCm, setWaistCm] = useState('87.0');
  const [energyLevel, setEnergyLevel] = useState('4');
  const [sleepQuality, setSleepQuality] = useState('4');
  const [workoutAdherence, setWorkoutAdherence] = useState('90');
  const [nutritionAdherence, setNutritionAdherence] = useState('85');
  const [difficultyLevel, setDifficultyLevel] = useState('Moderate');
  const [challenges, setChallenges] = useState('');
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=300&q=80');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);

      if (data.user?.id) {
        setWeightKg(String(data.user.profile?.weightKg || '84.2'));
        setWaistCm(String(data.user.profile?.waistCm || '87.0'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/fitness-police/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentWeightKg: weightKg,
          waistCm,
          energyLevel,
          sleepQuality,
          workoutAdherence,
          nutritionAdherence,
          difficultyLevel,
          challenges: challenges || 'None reported this week',
          generalFeedback,
          photoUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit check-in');

      setSuccessMsg('Weekly check-in submitted successfully! Oga Eric has been notified.');
      setAiResult(json.aiResult);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const samplePastReview = {
    date: 'Last Sunday',
    weight: '85.0 kg',
    waist: '88.0 cm',
    adherence: '90%',
    status: 'REVIEWED',
    coachFeedback:
      'Superb discipline on staying consistent through the work week! Down -0.8kg with zero strength loss. Keep pushing on your 8,500 daily steps target.',
  };

  const whatsappUrl = `https://wa.me/2348012345678?text=${encodeURIComponent(
    `Hello Oga Eric, I just submitted my weekly check-in from the Fitness Police app!`
  )}`;

  return (
    <ClientAppShell
      title="Weekly Coaching Check-In"
      subtitle="Submit your weekly body metrics, adherence ratings, challenges, and photos for direct coach review."
    >
      {/* WhatsApp Coach Hotline Surface */}
      <div className="surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-emerald-500/30 bg-emerald-950/20 w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
            <MessageCircle size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-heading)]">Direct WhatsApp Coach Accountability</p>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Gold & Diamond members can message Oga Eric directly for quick meal and form questions.
            </p>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand text-xs py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black self-start sm:self-auto"
        >
          Message Coach on WhatsApp <ArrowRight size={13} />
        </a>
      </div>

      {successMsg && (
        <div className="surface p-6 border-sky-400/50 space-y-4 animate-fade-in w-full">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <CheckCircle2 size={18} /> {successMsg}
          </div>

          {aiResult && (
            <div className="p-4 bg-slate-900/60 rounded-xl border border-[var(--border-subtle)] space-y-1 text-xs">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> AI Trend Trajectory
              </span>
              <p className="font-bold text-[var(--text-heading)] text-sm">{aiResult.trendsSummary}</p>
              <p className="text-[var(--text-muted)] mt-1">
                Suggested Coach Adjustment: <strong className="text-sky-400">{aiResult.suggestedPlanAdjustments}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-fade-in w-full">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Left Column: Weekly Check-In Submission Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmitCheckIn} className="surface p-6 sm:p-7 space-y-6 border border-[var(--border-subtle)]">
            <div>
              <span className="label-xs text-sky-400">Sunday Check-In Engine</span>
              <h3 className="section-title text-base mt-0.5">Submit Your Weekly Assessment</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Answer honestly so your coach can calibrate your targets.</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="field-input font-bold"
                />
              </div>
              <div>
                <label className="field-label">Waistline (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  className="field-input font-bold"
                />
              </div>
            </div>

            {/* Ratings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Energy Level (1 - 5)</label>
                <select
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(e.target.value)}
                  className="field-input"
                >
                  <option value="5">5 - Extremely High Energy</option>
                  <option value="4">4 - Good / Consistent Energy</option>
                  <option value="3">3 - Moderate Energy</option>
                  <option value="2">2 - Low Energy / Sluggish</option>
                  <option value="1">1 - Fatigued / Exhausted</option>
                </select>
              </div>

              <div>
                <label className="field-label">Sleep Quality (1 - 5)</label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value)}
                  className="field-input"
                >
                  <option value="5">5 - 8+ hrs Restful Deep Sleep</option>
                  <option value="4">4 - 7-8 hrs Solid Sleep</option>
                  <option value="3">3 - 6 hrs Interrupted Sleep</option>
                  <option value="2">2 - Under 5 hrs Poor Sleep</option>
                  <option value="1">1 - Severe Insomnia / Stress</option>
                </select>
              </div>
            </div>

            {/* Adherence Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="field-label mb-0">Workout Consistency</label>
                  <span className="text-xs font-bold text-sky-400">{workoutAdherence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={workoutAdherence}
                  onChange={(e) => setWorkoutAdherence(e.target.value)}
                  className="w-full accent-sky-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="field-label mb-0">Nutrition Consistency</label>
                  <span className="text-xs font-bold text-cyan-400">{nutritionAdherence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={nutritionAdherence}
                  onChange={(e) => setNutritionAdherence(e.target.value)}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Overall Program Difficulty</label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="field-input"
              >
                <option value="Easy">Easy — Ready for more volume</option>
                <option value="Moderate">Moderate — Optimal sweet spot</option>
                <option value="Challenging">Challenging — Pushing hard</option>
                <option value="Overwhelming">Overwhelming — Need volume reduction</option>
              </select>
            </div>

            <div>
              <label className="field-label">What challenges did you face this week?</label>
              <textarea
                rows={2}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="e.g. Late night food cravings on Wednesday, struggled with squat depth..."
                className="field-input resize-none"
              />
            </div>

            <div>
              <label className="field-label">What do you need help with from Oga Eric?</label>
              <textarea
                rows={2}
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
                placeholder="e.g. Can you suggest a high-protein breakfast swap for boiled eggs?"
                className="field-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-md shadow-sky-500/20"
            >
              {submitting ? 'Delivering Check-In to Coach...' : 'Submit Weekly Check-In for Review'} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Right Column: Coach Review Timeline & History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title text-sm">Past Check-In Reviews</h3>
            <span className="text-xs text-[var(--text-muted)]">Weekly History</span>
          </div>

          <div className="surface p-6 space-y-4 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <span className="label-xs text-sky-400">{samplePastReview.date}</span>
                <p className="font-extrabold text-[var(--text-heading)] text-sm mt-0.5">
                  Weight: {samplePastReview.weight} • Waist: {samplePastReview.waist}
                </p>
              </div>
              <span className="badge badge-approved text-[9px]">Coach Reviewed</span>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-sky-400/30 space-y-2">
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={13} /> Oga Eric Written Review:
              </p>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed italic">
                &quot;{samplePastReview.coachFeedback}&quot;
              </p>
            </div>

            <div className="pt-2 text-[11px] text-[var(--text-muted)] flex items-center justify-between">
              <span>Adherence Rating: <strong className="text-[var(--text-heading)]">{samplePastReview.adherence}</strong></span>
              <span className="text-sky-400 font-semibold">Targets Maintained</span>
            </div>
          </div>
        </div>

      </div>
    </ClientAppShell>
  );
}
