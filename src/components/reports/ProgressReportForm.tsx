'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { toast } from '@/components/ui/Toast';
import { BRAND } from '@/lib/brand';
import { cn } from '@/lib/cn';

import { type ReportValues } from '@/lib/reportValues';
export { emptyReport, toValues, type ReportValues } from '@/lib/reportValues';

/* Inline document fields. Defined at module level so inputs keep focus while typing. */

const inline = 'w-full bg-transparent border-0 border-b border-dashed border-[#D9D6CE] rounded-none px-0 py-1 text-sm text-[#161A18] tnum outline-none focus:border-solid focus:border-[#0B3D2E] placeholder:text-[#9AA19D]';

function Row({ label, children, hint }: { label: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 items-baseline py-2.5 border-b border-[#EFEDE7] last:border-b-0">
      <span className="text-xs text-[#6B7370]">{label}</span>
      <span className="min-w-0">
        {children}
        {hint && <span className="block text-xs text-[#6B7370] mt-0.5">{hint}</span>}
      </span>
    </div>
  );
}

function NumInput({ value, onChange, unit, label, step = 'any' }: { value: string; onChange: (v: string) => void; unit?: string; label: string; step?: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <input aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal" step={step} className={cn(inline, 'max-w-[120px]')} />
      {unit && <span className="text-xs text-[#6B7370]">{unit}</span>}
    </span>
  );
}

function Prose({ label, value, onChange, placeholder, rows = 4, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; required?: boolean }) {
  return (
    <div className="py-3 border-b border-[#EFEDE7] last:border-b-0">
      <label className="text-xs text-[#6B7370] flex items-center gap-2">
        {label}
        {required && !value.trim() && <span className="text-[#8F5E14]">needed to publish</span>}
      </label>
      <textarea aria-label={label} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(inline, 'mt-1 resize-y leading-relaxed border-b-0 border border-dashed rounded-[6px] px-3 py-2')} />
    </div>
  );
}

interface Props {
  initial: ReportValues;
  clientName: string;
  publishedAt?: string | null;
  onSave: (values: ReportValues, publish: boolean) => Promise<void>;
  onUnpublish?: () => Promise<void>;
}

/**
 * The progress report as the client will see it: a paper document whose
 * fields are edited in place, in the brief's order.
 */
export function ProgressReportForm({ initial, clientName, publishedAt, onSave, onUnpublish }: Props) {
  const [v, setV] = useState<ReportValues>(initial);
  const [busy, setBusy] = useState<'' | 'draft' | 'publish' | 'unpublish'>('');
  const set = (k: keyof ReportValues) => (val: string) => setV((x) => ({ ...x, [k]: val }));

  const run = async (kind: 'draft' | 'publish' | 'unpublish') => {
    setBusy(kind);
    try {
      if (kind === 'unpublish') await onUnpublish?.();
      else await onSave(v, kind === 'publish');
      toast(kind === 'publish' ? `Published. ${clientName.split(' ')[0]} has been notified.` : kind === 'unpublish' ? 'Back to draft' : 'Draft saved');
    } catch (e) {
      toast.error('Not saved', e instanceof Error ? e.message : undefined);
    } finally {
      setBusy('');
    }
  };

  const delta = v.startingWeightKg && v.currentWeightKg ? Math.round((Number(v.currentWeightKg) - Number(v.startingWeightKg)) * 10) / 10 : null;
  const canPublish = v.coachAssessment.trim() && v.nextAdjustments.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {publishedAt ? <Pill tone="approved">Published</Pill> : <Pill tone="pending">Draft</Pill>}
        <span className="t-caption">{publishedAt ? `Visible to ${clientName.split(' ')[0]} since ${new Date(publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : 'Only you can see this until it is published.'}</span>
      </div>

      <article className="bg-white text-[#161A18] rounded-[var(--radius-md)] elev-raised overflow-hidden">
        <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div className="min-w-0">
            <Logo variant="horizontal" tone="green" size={24} />
            <h2 className="mt-4 font-display font-semibold text-xl leading-tight tracking-[-0.01em] text-[#161A18]">Progress report</h2>
            <p className="text-sm text-[#474D4A] mt-1">{clientName}</p>
          </div>
          <div className="text-right text-xs text-[#6B7370] space-y-1 shrink-0">
            <label className="flex items-center gap-2 justify-end">From <input type="date" aria-label="Period start" value={v.periodStart} onChange={(e) => set('periodStart')(e.target.value)} className={cn(inline, 'w-[140px] text-right')} /></label>
            <label className="flex items-center gap-2 justify-end">To <input type="date" aria-label="Period end" value={v.periodEnd} onChange={(e) => set('periodEnd')(e.target.value)} className={cn(inline, 'w-[140px] text-right')} /></label>
          </div>
        </header>
        <span className="accent-rule ml-6" aria-hidden />

        <div className="px-6 py-4 grid gap-x-10 md:grid-cols-2">
          <div>
            <Row label="Starting weight"><NumInput label="Starting weight" value={v.startingWeightKg} onChange={set('startingWeightKg')} unit="kg" /></Row>
            <Row label="Current weight" hint={delta != null ? `${delta > 0 ? 'up' : 'down'} ${Math.abs(delta)} kg over the period` : undefined}><NumInput label="Current weight" value={v.currentWeightKg} onChange={set('currentWeightKg')} unit="kg" /></Row>
            <Row label="Waist"><NumInput label="Waist" value={v.waistCm} onChange={set('waistCm')} unit="cm" /></Row>
            <Row label="Average daily steps"><NumInput label="Average daily steps" value={v.averageSteps} onChange={set('averageSteps')} /></Row>
          </div>
          <div>
            <Row label="Training consistency"><NumInput label="Training consistency" value={v.trainingConsistency} onChange={set('trainingConsistency')} unit="%" /></Row>
            <Row label="Nutrition adherence"><NumInput label="Nutrition adherence" value={v.nutritionAdherence} onChange={set('nutritionAdherence')} unit="%" /></Row>
            <Row label="Hunger, energy, sleep">
              <span className="flex items-baseline gap-3">
                <NumInput label="Hunger, 1 to 5" value={v.hunger} onChange={set('hunger')} />
                <NumInput label="Energy, 1 to 5" value={v.energy} onChange={set('energy')} />
                <NumInput label="Sleep, 1 to 5" value={v.sleep} onChange={set('sleep')} />
              </span>
            </Row>
          </div>
        </div>

        <div className="px-6 pb-4">
          <Prose label="Strength and performance" value={v.strengthPerformance} onChange={set('strengthPerformance')} placeholder="Main lifts, reps, how training felt." rows={2} />
          <div className="grid md:grid-cols-2 gap-x-10">
            <Prose label="Wins" value={v.wins} onChange={set('wins')} rows={3} />
            <Prose label="Challenges" value={v.challenges} onChange={set('challenges')} rows={3} />
          </div>
          <Prose label="Coach assessment" value={v.coachAssessment} onChange={set('coachAssessment')} placeholder="What the numbers say, in plain words." rows={5} required />
          <Prose label="Next adjustments" value={v.nextAdjustments} onChange={set('nextAdjustments')} placeholder="Calories, macros, steps and training changes, and when you will review again." rows={5} required />
        </div>

        <footer className="px-6 py-3 border-t border-[#E6E4DE] text-xs text-[#6B7370]">Prepared by {BRAND.coachName} · {BRAND.legalName}</footer>
      </article>

      <div className="sticky z-20 -mx-4 md:-mx-10 px-4 md:px-10 py-3 bg-[var(--bg-header)] backdrop-blur-md hairline flex flex-wrap items-center gap-3 bottom-[calc(var(--tabbar-height)+env(safe-area-inset-bottom,0px))] md:bottom-0">
        <Button variant="secondary" loading={busy === 'draft'} disabled={Boolean(busy)} onClick={() => run('draft')}>Save draft</Button>
        {publishedAt && onUnpublish && <Button variant="ghost" loading={busy === 'unpublish'} disabled={Boolean(busy)} onClick={() => run('unpublish')}>Back to draft</Button>}
        <span className="flex-1" />
        <Button loading={busy === 'publish'} disabled={Boolean(busy) || !canPublish} onClick={() => run('publish')}>
          {publishedAt ? 'Save changes' : `Publish to ${clientName.split(' ')[0]}`}
        </Button>
      </div>
    </div>
  );
}
