'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Field, TextArea } from '@/components/ui/Field';
import { Scale } from '@/components/ui/Scale';
import { Slider } from '@/components/ui/Slider';
import { Sparkline } from '@/components/ui/Sparkline';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { useIsDesktop } from '@/lib/useMediaQuery';
import { BRAND } from '@/lib/brand';
import { whatsappLink } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

export interface PastCheckIn {
  id: string;
  date: string;
  weightKg: number;
  waistCm: number;
  steps: number | null;
  status: string;
}

const WORDS = {
  hunger: ['Never hungry', 'Rarely', 'Manageable', 'Often hungry', 'Hungry all day'],
  energy: ['Exhausted', 'Low', 'Moderate', 'Good', 'Excellent'],
  sleep: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'],
  stress: ['Very low', 'Low', 'Moderate', 'High', 'Very high'],
};

const STEPS = ['Measurements', 'Consistency', 'How it felt', 'Notes'] as const;
const draftKey = (userId: string) => `ericonet.checkin.${userId}`;

interface Draft {
  weightKg: string;
  waistCm: string;
  steps: string;
  sessionsCompleted: string;
  sessionsPlanned: string;
  nutrition: number;
  hunger: number | null;
  energy: number | null;
  sleep: number | null;
  stress: number | null;
  challenges: string;
  wins: string;
  helpNeeded: string;
}

const num = (v: string) => {
  const n = parseFloat(v.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
};

function fmtDelta(v: number, unit: string) {
  if (!Number.isFinite(v) || v === 0) return `no change`;
  return `${v > 0 ? 'up' : 'down'} ${Math.abs(Math.round(v * 10) / 10)} ${unit}`;
}

export function CheckInFlow({
  userId,
  past,
  defaults,
}: {
  userId: string;
  past: PastCheckIn[];
  defaults: { weightKg: number | null; waistCm: number | null; steps: number | null; sessionsPlanned: number };
}) {
  const router = useRouter();
  const desktop = useIsDesktop();
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>({
    weightKg: defaults.weightKg != null ? String(defaults.weightKg) : '',
    waistCm: defaults.waistCm != null ? String(defaults.waistCm) : '',
    steps: defaults.steps != null ? String(defaults.steps) : '',
    sessionsCompleted: '',
    sessionsPlanned: String(defaults.sessionsPlanned),
    nutrition: 80,
    hunger: null,
    energy: null,
    sleep: null,
    stress: null,
    challenges: '',
    wins: '',
    helpNeeded: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sent, setSent] = useState<{ weightKg: number; waistCm: number; steps: number | null } | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey(userId));
      if (raw) setD((x) => ({ ...x, ...(JSON.parse(raw) as Partial<Draft>) }));
    } catch {
      /* ignore */
    }
    setRestored(true);
  }, [userId]);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(draftKey(userId), JSON.stringify(d));
    } catch {
      /* ignore */
    }
  }, [d, restored, userId]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (only?: number) => {
    const e: Partial<Record<keyof Draft, string>> = {};
    const check = (s: number) => only === undefined || only === s;
    if (check(0)) {
      const w = num(d.weightKg), waist = num(d.waistCm);
      if (!(w >= 35 && w <= 300)) e.weightKg = 'Enter your weight in kg.';
      if (!(waist >= 45 && waist <= 200)) e.waistCm = 'Enter your waist in cm.';
      if (d.steps && !(num(d.steps) >= 0 && num(d.steps) <= 60000)) e.steps = 'Enter average daily steps, or leave it blank.';
    }
    if (check(1)) {
      const done = num(d.sessionsCompleted), planned = num(d.sessionsPlanned);
      if (!(done >= 0 && done <= 14)) e.sessionsCompleted = 'How many sessions did you do?';
      if (!(planned >= 1 && planned <= 14)) e.sessionsPlanned = 'Planned sessions, 1 to 14.';
    }
    if (check(2)) {
      if (!d.hunger) e.hunger = 'Pick one.';
      if (!d.energy) e.energy = 'Pick one.';
      if (!d.sleep) e.sleep = 'Pick one.';
      if (!d.stress) e.stress = 'Pick one.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0 });
  };

  const submit = async () => {
    if (!validate()) {
      if (!desktop) {
        // Jump to the first step with a problem.
        const firstBad = [0, 1, 2].find((s) => !validateStepSilently(s));
        if (firstBad !== undefined) setStep(firstBad);
      }
      return;
    }
    setBusy(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/training/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          currentWeightKg: d.weightKg,
          waistCm: d.waistCm,
          averageDailySteps: d.steps || null,
          trainingSessionsCompleted: d.sessionsCompleted,
          trainingSessionsPlanned: d.sessionsPlanned,
          nutritionAdherence: d.nutrition,
          hungerLevel: d.hunger,
          energyLevel: d.energy,
          sleepQuality: d.sleep,
          stressLevel: d.stress,
          difficultyLevel: (d.stress ?? 0) >= 4 ? 'Challenging' : 'Moderate',
          challenges: d.challenges,
          wins: d.wins,
          helpNeeded: d.helpNeeded,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not send your check-in.');
      localStorage.removeItem(draftKey(userId));
      setSent({ weightKg: num(d.weightKg), waistCm: num(d.waistCm), steps: d.steps ? num(d.steps) : null });
      window.scrollTo({ top: 0 });
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not send your check-in.');
    } finally {
      setBusy(false);
    }
  };

  // Used to find the first failing step without overwriting the shown errors.
  function validateStepSilently(s: number) {
    if (s === 0) return num(d.weightKg) >= 35 && num(d.waistCm) >= 45;
    if (s === 1) return num(d.sessionsCompleted) >= 0 && num(d.sessionsPlanned) >= 1;
    if (s === 2) return Boolean(d.hunger && d.energy && d.sleep && d.stress);
    return true;
  }

  if (sent) return <Confirmation sent={sent} past={past} />;

  const sections = [
    <div key="m" className="space-y-5">
      <SectionTitle title="Measurements" text="Weigh in the morning, after the toilet, before eating. Waist at the navel, relaxed." />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Weight" unit="kg" error={errors.weightKg}>
          <input value={d.weightKg} onChange={(e) => set('weightKg', e.target.value)} inputMode="decimal" autoComplete="off" enterKeyHint="next" />
        </Field>
        <Field label="Waist" unit="cm" error={errors.waistCm}>
          <input value={d.waistCm} onChange={(e) => set('waistCm', e.target.value)} inputMode="decimal" autoComplete="off" enterKeyHint="next" />
        </Field>
      </div>
      <Field label="Average daily steps" help="From your phone or watch. Optional." error={errors.steps}>
        <input value={d.steps} onChange={(e) => set('steps', e.target.value)} inputMode="numeric" autoComplete="off" enterKeyHint="done" />
      </Field>
    </div>,
    <div key="c" className="space-y-5">
      <SectionTitle title="Consistency" text="Honest numbers help your coach more than good ones." />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sessions done" error={errors.sessionsCompleted}>
          <input value={d.sessionsCompleted} onChange={(e) => set('sessionsCompleted', e.target.value)} inputMode="numeric" autoComplete="off" />
        </Field>
        <Field label="Planned" error={errors.sessionsPlanned}>
          <input value={d.sessionsPlanned} onChange={(e) => set('sessionsPlanned', e.target.value)} inputMode="numeric" autoComplete="off" />
        </Field>
      </div>
      <Slider label="Meals that matched your plan" value={d.nutrition} onChange={(v) => set('nutrition', v)} help="Roughly, across the week." />
    </div>,
    <div key="f" className="space-y-6">
      <SectionTitle title="How it felt" text="Pick the word that fits the week as a whole." />
      {(['hunger', 'energy', 'sleep', 'stress'] as const).map((k) => (
        <div key={k}>
          <Scale label={k === 'sleep' ? 'Sleep quality' : k[0].toUpperCase() + k.slice(1)} value={d[k]} onChange={(v) => set(k, v)} words={WORDS[k]} />
          {errors[k] && <p className="t-caption text-status-rejected mt-1">{errors[k]}</p>}
        </div>
      ))}
    </div>,
    <div key="n" className="space-y-5">
      <SectionTitle title="Notes" text={`${BRAND.coachName} reads every word. Short is fine.`} />
      <TextArea label="Wins this week" placeholder="Hit protein five days, new best on squats" value={d.wins} onChange={(e) => set('wins', e.target.value)} />
      <TextArea label="What was hard" placeholder="Two late dinners at work events" value={d.challenges} onChange={(e) => set('challenges', e.target.value)} />
      <TextArea label="What you need help with" placeholder="Ideas for quick lunches" value={d.helpNeeded} onChange={(e) => set('helpNeeded', e.target.value)} />
    </div>,
  ];

  if (desktop) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-x-12 gap-y-10">{sections}</div>
        {submitError && <p className="t-body-sm text-status-rejected" role="alert">{submitError}</p>}
        <div className="hairline pt-6 flex items-center justify-between gap-4">
          <a href="/print/check-in-form?autoprint=1" target="_blank" rel="noopener noreferrer" className="t-body-sm hover:text-ink">Prefer paper? Print the blank form</a>
          <Button size="lg" loading={busy} onClick={submit}>Send check-in</Button>
        </div>
        <History past={past} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <span key={s} className={cn('h-0.5 flex-1 rounded-full', i <= step ? 'bg-brand' : 'bg-[var(--border-subtle)]')} />
        ))}
      </div>
      <p className="t-caption tnum">Step {step + 1} of {STEPS.length}</p>
      <div key={step} className="motion-enter">{sections[step]}</div>
      {submitError && <p className="t-body-sm text-status-rejected" role="alert">{submitError}</p>}
      <div className="sticky z-20 -mx-4 px-4 py-3 bg-[var(--bg-header)] backdrop-blur-md flex gap-3" style={{ bottom: 'calc(var(--tabbar-height) + env(safe-area-inset-bottom, 0px))' }}>
        {step > 0 && <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>Back</Button>}
        {step < STEPS.length - 1 ? (
          <Button full size="lg" onClick={next}>Continue</Button>
        ) : (
          <Button full size="lg" loading={busy} onClick={submit}>Send check-in</Button>
        )}
      </div>
      {step === 0 && <History past={past} />}
    </div>
  );
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="t-h3">{title}</h2>
      <p className="t-body-sm mt-1">{text}</p>
    </div>
  );
}

function History({ past }: { past: PastCheckIn[] }) {
  if (past.length === 0) return null;
  return (
    <Section title="Previous check-ins">
      <ListRows>
        {past.slice(0, 6).map((c) => (
          <ListRow
            key={c.id}
            title={new Date(c.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            subtitle={`${c.weightKg} kg · waist ${c.waistCm} cm${c.steps ? ` · ${c.steps.toLocaleString()} steps` : ''}`}
            trailing={c.status === 'REVIEWED' ? <Pill tone="approved">Reviewed</Pill> : <Pill tone="pending">With coach</Pill>}
          />
        ))}
      </ListRows>
    </Section>
  );
}

/** Signature moment: this week against last, with the eight-week line. */
function Confirmation({ sent, past }: { sent: { weightKg: number; waistCm: number; steps: number | null }; past: PastCheckIn[] }) {
  const prev = past[0];
  const series = [...past].reverse().map((p) => p.weightKg).concat(sent.weightKg).slice(-8);
  const wa = whatsappLink(BRAND.contact.whatsapp, `Hello ${BRAND.coachName}, I have just sent my weekly check-in.`);
  return (
    <div className="space-y-8 motion-enter">
      <div>
        <p className="t-overline normal-case tracking-normal text-sm font-medium text-status-approved">Check-in sent</p>
        <h2 className="t-display mt-2">Thank you. {BRAND.coachName} has it.</h2>
        <p className="t-body text-ink-secondary mt-3 max-w-[48ch]">Feedback arrives by Sunday evening. You will get a notification when it is ready.</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="t-body-sm">Weight</p>
          <p className="flex items-baseline gap-1.5 mt-1"><span className="t-stat-hero text-[44px] md:text-[64px]">{sent.weightKg}</span><span className="text-ink-muted font-medium">kg</span></p>
          {prev && <p className="t-body-sm tnum mt-1">{fmtDelta(sent.weightKg - prev.weightKg, 'kg')} on last week</p>}
        </div>
        <div>
          <p className="t-body-sm">Waist</p>
          <p className="flex items-baseline gap-1.5 mt-1"><span className="t-stat-hero text-[44px] md:text-[64px]">{sent.waistCm}</span><span className="text-ink-muted font-medium">cm</span></p>
          {prev && <p className="t-body-sm tnum mt-1">{fmtDelta(sent.waistCm - prev.waistCm, 'cm')} on last week</p>}
        </div>
      </div>
      {series.length > 1 && (
        <div className="hairline pt-6">
          <p className="t-body-sm mb-3">Weight over the last {series.length} check-ins</p>
          <Sparkline data={series} width={320} height={64} className="w-full max-w-[480px] h-16" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button href="/client/dashboard" size="lg">Back to today</Button>
        {wa && <Button href={wa} variant="secondary" size="lg" target="_blank" rel="noopener noreferrer">Message on WhatsApp</Button>}
      </div>
    </div>
  );
}
