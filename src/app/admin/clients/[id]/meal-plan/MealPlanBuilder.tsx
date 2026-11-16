'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Download, Plus, Trash2 } from 'lucide-react';
import { Button, Field, IconButton, ListRow, ListRows, Menu, ProgressBar, Section, Segmented, SelectField, Sheet, toast } from '@/components/ui';
import { useIsDesktop } from '@/lib/useMediaQuery';
import { cn } from '@/lib/cn';

export interface BuilderRow {
  mealLabel: string;
  foodName: string;
  quantity: string;
  calories: string;
  proteinG: string;
  carbsG: string;
  fatG: string;
  culturalAlternative: string;
}

const LABELS = ['Meal 1', 'Snack', 'Meal 2', 'Meal 3'];
const LABEL_TO_TYPE: Record<string, string> = { 'Meal 1': 'BREAKFAST', Snack: 'SNACK', 'Meal 2': 'LUNCH', 'Meal 3': 'DINNER' };
const emptyRow = (label = 'Meal 1'): BuilderRow => ({ mealLabel: label, foodName: '', quantity: '', calories: '', proteinG: '', carbsG: '', fatG: '', culturalAlternative: '' });
const starterDay = () => LABELS.map((l) => emptyRow(l));

const COLS: { key: keyof BuilderRow; label: string; w: string; num?: boolean }[] = [
  { key: 'foodName', label: 'Food', w: 'minmax(160px,1.6fr)' },
  { key: 'quantity', label: 'Quantity', w: 'minmax(120px,1fr)' },
  { key: 'calories', label: 'kcal', w: '64px', num: true },
  { key: 'proteinG', label: 'P g', w: '56px', num: true },
  { key: 'carbsG', label: 'C g', w: '56px', num: true },
  { key: 'fatG', label: 'F g', w: '56px', num: true },
];
const GRID = `96px ${COLS.map((c) => c.w).join(' ')} 44px`;
const cell = 'w-full h-10 px-2 rounded-[var(--radius-sm)] border border-transparent bg-transparent text-sm text-ink tnum outline-none hover:border-[var(--border-input)] focus:border-line-active focus:bg-[var(--bg-input)] transition-colors';

export function MealPlanBuilder({
  clientId,
  firstName,
  existingPlanId,
  initial,
}: {
  clientId: string;
  firstName: string;
  existingPlanId: string | null;
  initial: { title: string; kcal: string; protein: string; carbs: string; fat: string; guidelines: boolean; notes: string; days: BuilderRow[][] };
}) {
  const router = useRouter();
  const desktop = useIsDesktop();
  const [title, setTitle] = useState(initial.title);
  const [t, setT] = useState({ kcal: initial.kcal, protein: initial.protein, carbs: initial.carbs, fat: initial.fat });
  const [guidelines, setGuidelines] = useState(initial.guidelines);
  const [notes, setNotes] = useState(initial.notes);
  const [days, setDays] = useState<BuilderRow[][]>(initial.days.map((d) => (d.length ? d : starterDay())));
  const [day, setDay] = useState(0);
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [planId, setPlanId] = useState(existingPlanId);

  const rows = days[day] ?? [];
  const totals = useMemo(() => rows.reduce((s, r) => ({ kcal: s.kcal + (+r.calories || 0), p: s.p + (+r.proteinG || 0), c: s.c + (+r.carbsG || 0), f: s.f + (+r.fatG || 0) }), { kcal: 0, p: 0, c: 0, f: 0 }), [rows]);
  const target = Number(t.kcal) || 0;

  const setCell = (ri: number, k: keyof BuilderRow, v: string) => setDays((ds) => ds.map((d, di) => (di !== day ? d : d.map((r, i) => (i !== ri ? r : { ...r, [k]: v })))));
  const addRow = () => {
    setDays((ds) => ds.map((d, di) => (di !== day ? d : [...d, emptyRow('Snack')])));
    if (!desktop) setEditing(rows.length);
  };
  const removeRow = (ri: number) => setDays((ds) => ds.map((d, di) => (di !== day ? d : d.filter((_, i) => i !== ri))));
  const resize = (n: number) => {
    setDays((ds) => (ds.length >= n ? ds.slice(0, n) : [...ds, ...Array.from({ length: n - ds.length }, starterDay)]));
    setDay((d) => Math.min(d, n - 1));
  };
  const copyToAll = () => {
    setDays((ds) => ds.map((d, di) => (di === day ? d : ds[day].map((r) => ({ ...r })))));
    toast(`Day ${day + 1} copied to all ${days.length} days`);
  };

  const onCellKey = (e: React.KeyboardEvent<HTMLInputElement>, ri: number, k: keyof BuilderRow) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const next = document.querySelector<HTMLInputElement>(`[data-mcell="${ri + (e.shiftKey ? -1 : 1)}-${k}"]`);
    next?.focus();
    next?.select();
  };

  const publish = async () => {
    if (!title.trim()) {
      toast.error('Give the plan a title');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: clientId,
          title,
          dailyCalorieTarget: t.kcal,
          proteinTargetG: t.protein,
          carbsTargetG: t.carbs,
          fatTargetG: t.fat,
          durationDays: days.length,
          guidelinesIncluded: guidelines,
          notes,
          days: days.map((rs, i) => ({ dayNumber: i + 1, items: rs.filter((r) => r.foodName.trim()).map((r) => ({ ...r, mealType: LABEL_TO_TYPE[r.mealLabel] })) })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not publish.');
      setPlanId(data.mealPlan?.id ?? planId);
      toast(`Published to ${firstName}`, `${days.length} days. ${firstName} has been notified.`);
      router.refresh();
    } catch (e) {
      toast.error('Not published', e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  const ed = editing != null ? rows[editing] : null;

  return (
    <div className="space-y-8">
      <Section first>
        <div className="grid gap-4 md:grid-cols-[2fr_repeat(4,1fr)]">
          <Field label="Plan title"><input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Calories" unit="kcal"><input value={t.kcal} onChange={(e) => setT({ ...t, kcal: e.target.value })} inputMode="numeric" /></Field>
          <Field label="Protein" unit="g"><input value={t.protein} onChange={(e) => setT({ ...t, protein: e.target.value })} inputMode="numeric" /></Field>
          <Field label="Carbs" unit="g"><input value={t.carbs} onChange={(e) => setT({ ...t, carbs: e.target.value })} inputMode="numeric" /></Field>
          <Field label="Fat" unit="g"><input value={t.fat} onChange={(e) => setT({ ...t, fat: e.target.value })} inputMode="numeric" /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_2fr] items-end">
          <SelectField label="Plan length" value={String(days.length)} onChange={(e) => resize(Number(e.target.value))}>
            {[1, 3, 5, 7, 14].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'day' : 'days'}</option>)}
          </SelectField>
          <Field label="Note on the plan" help="Optional. Printed on the cover.">
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Weigh carbohydrates cooked and proteins raw." />
          </Field>
        </div>
        <label className="flex items-center gap-3 t-body-sm cursor-pointer w-fit">
          <input type="checkbox" checked={guidelines} onChange={(e) => setGuidelines(e.target.checked)} className="h-5 w-5 accent-[var(--brand)]" />
          Add the nutrition guidelines to the PDF
        </label>
      </Section>

      <Section
        title={`Day ${day + 1}`}
        action={
          <Menu
            label="Day options"
            items={[
              { label: `Copy day ${day + 1} to all days`, icon: <Copy size={16} />, onSelect: copyToAll },
              ...(planId ? [{ label: 'Download published PDF', icon: <Download size={16} />, href: `/print/meal-plan/${planId}?autoprint=1` }] : []),
            ]}
          />
        }
      >
        {days.length > 1 && (
          <div className="overflow-x-auto scrollbar-hidden -mx-4 px-4 md:mx-0 md:px-0">
            <Segmented label="Day" size="sm" value={String(day)} onChange={(v) => setDay(Number(v))} options={days.map((_, i) => ({ value: String(i), label: `Day ${i + 1}` }))} className="w-max md:w-max" />
          </div>
        )}

        {desktop ? (
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid gap-1 items-center t-caption pb-1 hairline-b" style={{ gridTemplateColumns: GRID }}>
                <span className="px-2">Meal</span>
                {COLS.map((c) => <span key={c.key} className={cn('px-2', c.num && 'text-right')}>{c.label}</span>)}
                <span />
              </div>
              {rows.map((r, ri) => (
                <div key={ri} className="hairline-b py-1.5">
                  <div className="grid gap-1 items-center" style={{ gridTemplateColumns: GRID }}>
                    <select aria-label={`Meal, row ${ri + 1}`} value={r.mealLabel} onChange={(e) => setCell(ri, 'mealLabel', e.target.value)} className={cn(cell, 'appearance-none font-medium')}>
                      {LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {COLS.map((c) => (
                      <input
                        key={c.key}
                        data-mcell={`${ri}-${c.key}`}
                        aria-label={`${c.label}, row ${ri + 1}`}
                        value={r[c.key]}
                        onChange={(e) => setCell(ri, c.key, e.target.value)}
                        onKeyDown={(e) => onCellKey(e, ri, c.key)}
                        inputMode={c.num ? 'numeric' : undefined}
                        placeholder={c.key === 'foodName' ? 'Food' : c.key === 'quantity' ? '180 g cooked' : ''}
                        className={cn(cell, c.num && 'text-right')}
                      />
                    ))}
                    <IconButton label="Remove row" size="sm" onClick={() => removeRow(ri)}><Trash2 size={14} /></IconButton>
                  </div>
                  <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: '96px 1fr 44px' }}>
                    <span />
                    <input data-mcell={`${ri}-culturalAlternative`} aria-label={`Swap, row ${ri + 1}`} value={r.culturalAlternative} onChange={(e) => setCell(ri, 'culturalAlternative', e.target.value)} onKeyDown={(e) => onCellKey(e, ri, 'culturalAlternative')} placeholder="Swap, e.g. boiled yam instead of rice" className={cn(cell, 'text-ink-secondary')} />
                    <span />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ListRows className="hairline">
            {rows.map((r, ri) => (
              <ListRow key={ri} onClick={() => setEditing(ri)} title={r.foodName || <span className="text-ink-muted">Add food for {r.mealLabel.toLowerCase()}</span>} subtitle={`${r.mealLabel}${r.quantity ? ` · ${r.quantity}` : ''}`} trailing={r.calories ? `${r.calories} kcal` : undefined} />
            ))}
          </ListRows>
        )}
        <Button size="sm" variant="ghost" leading={<Plus size={14} />} onClick={addRow}>Add a row</Button>

        <div className="space-y-2">
          <ProgressBar label={`Day ${day + 1} total`} value={Math.round(totals.kcal)} max={target || 1} unit="kcal" />
          <p className={cn('t-caption tnum', target && (totals.kcal / target > 1.05 || totals.kcal / target < 0.9) ? 'text-status-pending' : '')}>
            P {Math.round(totals.p)} of {t.protein} g · C {Math.round(totals.c)} of {t.carbs} g · F {Math.round(totals.f)} of {t.fat} g
            {target ? ` · ${Math.round((totals.kcal / target) * 100)}% of target` : ''}
          </p>
        </div>
      </Section>

      <div className="sticky z-20 -mx-4 md:-mx-10 px-4 md:px-10 py-3 bg-[var(--bg-header)] backdrop-blur-md hairline flex items-center gap-4 bottom-[calc(var(--tabbar-height)+env(safe-area-inset-bottom,0px))] md:bottom-0">
        <p className="hidden md:block t-body-sm flex-1">{planId ? 'Publishing replaces the current plan.' : `${firstName} has no meal plan yet.`}</p>
        <Button size="lg" full className="md:w-auto" loading={busy} onClick={publish}>Publish to {firstName}</Button>
      </div>

      <Sheet
        open={ed != null}
        onOpenChange={(o) => !o && setEditing(null)}
        title={ed?.foodName || 'Add food'}
        footer={
          editing != null && (
            <div className="flex gap-3">
              <Button variant="ghost" className="text-status-rejected" onClick={() => { removeRow(editing); setEditing(null); }}>Remove</Button>
              <Button full onClick={() => setEditing(null)}>Done</Button>
            </div>
          )
        }
      >
        {ed && editing != null && (
          <div className="space-y-4">
            <SelectField label="Meal" value={ed.mealLabel} onChange={(e) => setCell(editing, 'mealLabel', e.target.value)}>
              {LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </SelectField>
            <Field label="Food"><input value={ed.foodName} onChange={(e) => setCell(editing, 'foodName', e.target.value)} autoFocus /></Field>
            <Field label="Quantity"><input value={ed.quantity} onChange={(e) => setCell(editing, 'quantity', e.target.value)} placeholder="180 g cooked" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Calories" unit="kcal"><input value={ed.calories} onChange={(e) => setCell(editing, 'calories', e.target.value)} inputMode="numeric" /></Field>
              <Field label="Protein" unit="g"><input value={ed.proteinG} onChange={(e) => setCell(editing, 'proteinG', e.target.value)} inputMode="numeric" /></Field>
              <Field label="Carbs" unit="g"><input value={ed.carbsG} onChange={(e) => setCell(editing, 'carbsG', e.target.value)} inputMode="numeric" /></Field>
              <Field label="Fat" unit="g"><input value={ed.fatG} onChange={(e) => setCell(editing, 'fatG', e.target.value)} inputMode="numeric" /></Field>
            </div>
            <Field label="Swap" help="Optional alternative."><input value={ed.culturalAlternative} onChange={(e) => setCell(editing, 'culturalAlternative', e.target.value)} /></Field>
          </div>
        )}
      </Sheet>
    </div>
  );
}
