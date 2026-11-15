'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export type ReportValues = {
  periodStart: string; periodEnd: string;
  startingWeightKg: string; currentWeightKg: string; waistCm: string; averageSteps: string;
  trainingConsistency: string; nutritionAdherence: string;
  hunger: string; energy: string; sleep: string;
  strengthPerformance: string; challenges: string; wins: string;
  coachAssessment: string; nextAdjustments: string;
};

export const emptyReport: ReportValues = {
  periodStart: '', periodEnd: '', startingWeightKg: '', currentWeightKg: '', waistCm: '', averageSteps: '',
  trainingConsistency: '', nutritionAdherence: '', hunger: '', energy: '', sleep: '',
  strengthPerformance: '', challenges: '', wins: '', coachAssessment: '', nextAdjustments: '',
};

export function toValues(src: any): ReportValues {
  const v = { ...emptyReport };
  (Object.keys(v) as (keyof ReportValues)[]).forEach((k) => {
    const x = src?.[k];
    if (x == null) return;
    v[k] = k === 'periodStart' || k === 'periodEnd' ? String(x).slice(0, 10) : String(x);
  });
  return v;
}

interface Props {
  initial: ReportValues;
  publishedAt?: string | null;
  onSave: (values: ReportValues, publish: boolean) => Promise<void>;
  onUnpublish?: () => Promise<void>;
}

/** The brief's progress report fields (section 14) in order, shared by "new" and "edit". */
export function ProgressReportForm({ initial, publishedAt, onSave, onUnpublish }: Props) {
  const [v, setV] = useState<ReportValues>(initial);
  const [busy, setBusy] = useState<'' | 'draft' | 'publish' | 'unpublish'>('');
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const set = (k: keyof ReportValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });

  const run = async (kind: 'draft' | 'publish' | 'unpublish') => {
    setBusy(kind); setMsg(null);
    try {
      if (kind === 'unpublish') await onUnpublish?.();
      else await onSave(v, kind === 'publish');
      setMsg({ kind: 'ok', text: kind === 'publish' ? 'Published. The client has been notified.' : kind === 'unpublish' ? 'Report returned to draft.' : 'Draft saved.' });
    } catch (e: any) {
      setMsg({ kind: 'err', text: e.message || 'Could not save' });
    } finally {
      setBusy('');
    }
  };

  const delta = v.startingWeightKg && v.currentWeightKg ? Math.round((Number(v.currentWeightKg) - Number(v.startingWeightKg)) * 10) / 10 : null;

  const Num = ({ k, label, step = '0.1', hint }: { k: keyof ReportValues; label: string; step?: string; hint?: string }) => (
    <label className="block">
      <span className="field-label">{label}</span>
      <input type="number" step={step} className="field-input" value={v[k]} onChange={set(k)} />
      {hint && <span className="text-xs text-ink-muted mt-1 block">{hint}</span>}
    </label>
  );
  const Text = ({ k, label, rows = 3, placeholder }: { k: keyof ReportValues; label: string; rows?: number; placeholder?: string }) => (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea rows={rows} className="field-input" value={v[k]} onChange={set(k)} placeholder={placeholder} />
    </label>
  );

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${msg.kind === 'ok' ? 'bg-status-approved/15 border-status-approved/40 text-status-approved' : 'bg-status-rejected/15 border-status-rejected/40 text-status-rejected'}`}>
          {msg.kind === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {msg.text}
        </div>
      )}

      <section className="surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="section-title text-sm">Period and measurements</h3>
          <span className={`badge ${publishedAt ? 'badge-approved' : 'badge-pending'}`}>{publishedAt ? 'Published' : 'Draft'}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block"><span className="field-label">Period start</span><input type="date" className="field-input" value={v.periodStart} onChange={set('periodStart')} /></label>
          <label className="block"><span className="field-label">Period end</span><input type="date" className="field-input" value={v.periodEnd} onChange={set('periodEnd')} /></label>
          <Num k="startingWeightKg" label="Starting weight (kg)" />
          <Num k="currentWeightKg" label="Current weight (kg)" hint={delta != null ? `${delta > 0 ? '+' : ''}${delta} kg over the period` : undefined} />
          <Num k="waistCm" label="Waist (cm)" step="0.5" />
          <Num k="averageSteps" label="Average daily steps" step="100" />
          <Num k="trainingConsistency" label="Training consistency (%)" step="1" />
          <Num k="nutritionAdherence" label="Nutrition adherence (%)" step="1" />
        </div>
      </section>

      <section className="surface p-6 space-y-4">
        <h3 className="section-title text-sm">How the period felt</h3>
        <div className="grid grid-cols-3 gap-3">
          <Num k="hunger" label="Hunger (1-5)" step="0.5" />
          <Num k="energy" label="Energy (1-5)" step="0.5" />
          <Num k="sleep" label="Sleep (1-5)" step="0.5" />
        </div>
        <Text k="strengthPerformance" label="Strength / performance" rows={2} placeholder="Main lifts, reps, how training felt." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Text k="challenges" label="Challenges" />
          <Text k="wins" label="Wins" />
        </div>
      </section>

      <section className="surface p-6 space-y-4">
        <h3 className="section-title text-sm">Coach assessment and next adjustments</h3>
        <Text k="coachAssessment" label="Coach assessment" rows={5} placeholder="What the numbers say, in plain words. Required to publish." />
        <Text k="nextAdjustments" label="Next adjustments" rows={5} placeholder="Calories, macros, steps, training changes, and when you will review again. Required to publish." />
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => run('draft')} disabled={!!busy} className="btn-secondary text-sm">{busy === 'draft' ? 'Saving…' : 'Save draft'}</button>
        <button type="button" onClick={() => run('publish')} disabled={!!busy} className="btn-brand text-sm">{busy === 'publish' ? 'Publishing…' : publishedAt ? 'Save and keep published' : 'Publish to client'}</button>
        {publishedAt && onUnpublish && (
          <button type="button" onClick={() => run('unpublish')} disabled={!!busy} className="btn-secondary text-sm text-status-rejected">{busy === 'unpublish' ? '…' : 'Return to draft'}</button>
        )}
      </div>
    </div>
  );
}
