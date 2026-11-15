'use client';

import React, { useState, useEffect } from 'react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { CheckCircle2, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const SCALE_LABELS: Record<string, string[]> = {
  hunger: ['Never hungry', 'Rarely', 'Manageable', 'Often hungry', 'Hungry all day'],
  energy: ['Exhausted', 'Low', 'Moderate', 'Good', 'Excellent'],
  sleep: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'],
  stress: ['Very low', 'Low', 'Moderate', 'High', 'Very high'],
};

function ScaleInput({ id, label, value, onChange }: { id: keyof typeof SCALE_LABELS; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <fieldset>
      <legend className="field-label">{label} (1 to 5)</legend>
      <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={`py-2 rounded-lg border text-sm font-semibold transition-colors ${
              value === n ? 'bg-brand-strong text-brand-on-strong border-transparent' : 'bg-surface text-ink-secondary border-line hover:border-line-active'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-muted mt-1">{SCALE_LABELS[id][value - 1]}</p>
    </fieldset>
  );
}

export default function CheckInClientPage() {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Brief order: weight, waist, steps, sessions, nutrition, hunger, energy, sleep, stress, challenges, wins, help
  const [weightKg, setWeightKg] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [steps, setSteps] = useState('');
  const [sessionsCompleted, setSessionsCompleted] = useState('');
  const [sessionsPlanned, setSessionsPlanned] = useState('4');
  const [nutritionAdherence, setNutritionAdherence] = useState('85');
  const [hunger, setHunger] = useState(3);
  const [energy, setEnergy] = useState(4);
  const [sleep, setSleep] = useState(4);
  const [stress, setStress] = useState(2);
  const [challenges, setChallenges] = useState('');
  const [wins, setWins] = useState('');
  const [helpNeeded, setHelpNeeded] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

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
      const p = data.user?.profile;
      if (p) {
        setWeightKg(p.weightKg ? String(p.weightKg) : '');
        setWaistCm(p.waistCm ? String(p.waistCm) : '');
        setSteps(p.averageDailySteps ? String(p.averageDailySteps) : '');
        setSessionsPlanned(String(p.preferredWorkoutDays || 4));
      }
      if (data.user?.id) fetchHistory(data.user.id);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async (userId: string) => {
    try {
      const res = await fetch(`/api/training/check-in?userId=${userId}`);
      const data = await res.json();
      setHistory(data.checkIns || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/training/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentWeightKg: weightKg,
          waistCm,
          averageDailySteps: steps,
          trainingSessionsCompleted: sessionsCompleted,
          trainingSessionsPlanned: sessionsPlanned,
          nutritionAdherence,
          hungerLevel: hunger,
          energyLevel: energy,
          sleepQuality: sleep,
          stressLevel: stress,
          difficultyLevel: stress >= 4 ? 'Challenging' : 'Moderate',
          challenges,
          wins,
          helpNeeded,
          photoUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not submit the check-in');
      setSuccessMsg(`Check-in submitted. ${BRAND.coachName} has been notified.`);
      setAiResult(json.aiResult);
      setChallenges(''); setWins(''); setHelpNeeded(''); setPhotoUrl('');
      fetchHistory(user.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsapp = BRAND.contact.whatsapp.replace(/\D/g, '');
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <ClientAppShell
      title="Weekly check-in"
      subtitle="Twelve quick questions. Honest answers help your coach adjust your plan correctly."
    >
      {whatsapp && (
        <div className="surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <MessageCircle size={18} />
            </div>
            <p className="text-xs text-ink-secondary">
              Signature and Private Coaching members can message {BRAND.coachName} on WhatsApp for quick questions between check-ins.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello ${BRAND.coachName}, I just submitted my weekly check-in on ${BRAND.shortName}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs py-2 px-4 self-start sm:self-auto"
          >
            Message on WhatsApp <ArrowRight size={13} />
          </a>
        </div>
      )}

      {successMsg && (
        <div className="surface p-5 border-line-active space-y-3 animate-fade-in w-full">
          <p className="flex items-center gap-2 text-brand font-semibold text-sm"><CheckCircle2 size={18} /> {successMsg}</p>
          {aiResult && (
            <div className="p-4 bg-paper rounded-xl border border-line text-xs space-y-1">
              <p className="label-xs text-ink-muted">Trend summary</p>
              <p className="text-ink">{aiResult.trendsSummary}</p>
              <p className="text-ink-muted">Your coach will confirm any change to your targets in the review.</p>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-status-rejected/15 border border-status-rejected/40 text-status-rejected text-xs flex items-center gap-2 w-full">
          <AlertCircle size={16} className="shrink-0" /> <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <form onSubmit={handleSubmit} className="lg:col-span-7 surface p-6 sm:p-7 space-y-6">
          <div>
            <p className="label-xs text-brand">This week</p>
            <h3 className="section-title text-base mt-0.5">Measurements and training</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="field-label" htmlFor="ci-weight">Current weight (kg)</label>
              <input id="ci-weight" type="number" step="0.1" min="30" max="300" required value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="field-input font-semibold" />
            </div>
            <div>
              <label className="field-label" htmlFor="ci-waist">Waist (cm)</label>
              <input id="ci-waist" type="number" step="0.5" min="40" max="200" required value={waistCm} onChange={(e) => setWaistCm(e.target.value)} className="field-input font-semibold" />
              <p className="text-xs text-ink-muted mt-1">At the navel, relaxed.</p>
            </div>
            <div>
              <label className="field-label" htmlFor="ci-steps">Average daily steps</label>
              <input id="ci-steps" type="number" step="100" min="0" max="60000" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="8000" className="field-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="ci-sessions">Training sessions completed</label>
              <div className="flex items-center gap-2">
                <input id="ci-sessions" type="number" min="0" max="14" required value={sessionsCompleted} onChange={(e) => setSessionsCompleted(e.target.value)} className="field-input w-24" />
                <span className="text-sm text-ink-muted">of</span>
                <input aria-label="Sessions planned" type="number" min="1" max="14" value={sessionsPlanned} onChange={(e) => setSessionsPlanned(e.target.value)} className="field-input w-24" />
                <span className="text-sm text-ink-muted">planned</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="field-label mb-0" htmlFor="ci-nutrition">Nutrition adherence</label>
                <span className="text-sm font-semibold text-brand">{nutritionAdherence}%</span>
              </div>
              <input id="ci-nutrition" type="range" min="0" max="100" step="5" value={nutritionAdherence} onChange={(e) => setNutritionAdherence(e.target.value)} className="w-full accent-[var(--brand)]" />
              <p className="text-xs text-ink-muted mt-1">Roughly how many meals matched the plan.</p>
            </div>
          </div>

          <div>
            <p className="label-xs text-brand">How it felt</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              <ScaleInput id="hunger" label="Hunger" value={hunger} onChange={setHunger} />
              <ScaleInput id="energy" label="Energy" value={energy} onChange={setEnergy} />
              <ScaleInput id="sleep" label="Sleep" value={sleep} onChange={setSleep} />
              <ScaleInput id="stress" label="Stress" value={stress} onChange={setStress} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="field-label" htmlFor="ci-challenges">Challenges this week</label>
              <textarea id="ci-challenges" rows={2} value={challenges} onChange={(e) => setChallenges(e.target.value)} placeholder="e.g. Late nights at work on Tuesday and Thursday, skipped lunch twice." className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="ci-wins">Wins this week</label>
              <textarea id="ci-wins" rows={2} value={wins} onChange={(e) => setWins(e.target.value)} placeholder="e.g. Hit every session, said no to the office cake." className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="ci-help">What do you need help with?</label>
              <textarea id="ci-help" rows={2} value={helpNeeded} onChange={(e) => setHelpNeeded(e.target.value)} placeholder="e.g. A breakfast option that is not eggs, or how to handle a wedding on Saturday." className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="ci-photo">Progress photo link (optional)</label>
              <input id="ci-photo" type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Private to you and your coach" className="field-input" />
            </div>
          </div>

          <button type="submit" disabled={submitting || !user} className="btn-brand text-sm w-full justify-center py-3">
            {submitting ? 'Sending…' : 'Submit weekly check-in'} <ArrowRight size={14} />
          </button>
        </form>

        <aside className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title text-sm">Previous check-ins</h3>
            <span className="text-xs text-ink-muted">{history.length ? `Last ${history.length}` : ''}</span>
          </div>
          {history.length === 0 && (
            <div className="surface p-6 text-sm text-ink-muted">Your first check-in will appear here with your coach&apos;s review.</div>
          )}
          {history.map((ci) => (
            <article key={ci.id} className="surface p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-xs text-brand">{fmtDate(ci.checkInDate)}</p>
                  <p className="font-semibold text-ink text-sm mt-0.5">{ci.currentWeightKg} kg · waist {ci.waistCm} cm</p>
                </div>
                <span className={`badge ${ci.status === 'REVIEWED' ? 'badge-approved' : 'badge-pending'}`}>
                  {ci.status === 'REVIEWED' ? 'Reviewed' : 'Awaiting review'}
                </span>
              </div>
              <dl className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  ['Steps', ci.averageDailySteps ? ci.averageDailySteps.toLocaleString() : '—'],
                  ['Training', ci.trainingSessionsCompleted != null && ci.trainingSessionsPlanned ? `${ci.trainingSessionsCompleted}/${ci.trainingSessionsPlanned}` : `${ci.workoutAdherence}%`],
                  ['Nutrition', `${ci.nutritionAdherence}%`],
                  ['Sleep', ci.sleepQuality ? `${ci.sleepQuality}/5` : '—'],
                ].map(([k, v]) => (
                  <div key={k as string} className="p-2 rounded-lg bg-paper border border-line">
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              {ci.coachFeedback && (
                <div className="p-3.5 rounded-xl bg-paper border-l-2 border-[var(--accent)] text-xs text-ink-secondary leading-relaxed">
                  <p className="label-xs text-ink-muted mb-1">Coach review</p>
                  {ci.coachFeedback}
                </div>
              )}
            </article>
          ))}
        </aside>
      </div>
    </ClientAppShell>
  );
}
