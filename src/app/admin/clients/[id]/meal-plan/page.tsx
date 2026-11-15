'use client';

import React, { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { dayTotals, type MealPlanItemLike } from '@/components/nutrition/MealPlanTable';
import { DownloadPdfButton } from '@/components/brand/DownloadPdfButton';

const LABELS = ['Meal 1', 'Snack', 'Meal 2', 'Meal 3'];
const LABEL_TO_TYPE: Record<string, string> = { 'Meal 1': 'BREAKFAST', Snack: 'SNACK', 'Meal 2': 'LUNCH', 'Meal 3': 'DINNER' };

type Row = { mealLabel: string; foodName: string; quantity: string; calories: string; proteinG: string; carbsG: string; fatG: string; culturalAlternative: string };
const emptyRow = (label = 'Meal 1'): Row => ({ mealLabel: label, foodName: '', quantity: '', calories: '', proteinG: '', carbsG: '', fatG: '', culturalAlternative: '' });
const starterDay = (): Row[] => [emptyRow('Meal 1'), emptyRow('Snack'), emptyRow('Meal 2'), emptyRow('Meal 3')];

export default function MealPlanBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: clientId } = use(params);
  const [client, setClient] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [targets, setTargets] = useState({ dailyCalorieTarget: '', proteinTargetG: '', carbsTargetG: '', fatTargetG: '' });
  const [durationDays, setDurationDays] = useState(7);
  const [guidelinesIncluded, setGuidelinesIncluded] = useState(true);
  const [notes, setNotes] = useState('');
  const [days, setDays] = useState<Row[][]>(Array.from({ length: 7 }, starterDay));
  const [day, setDay] = useState(0);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([fetch('/api/admin/clients?search='), fetch(`/api/admin/meal-plans?userId=${clientId}`)]);
        const cData = await cRes.json();
        const match = (cData.clients || []).find((c: any) => c.id === clientId);
        setClient(match);
        const prof = match?.profile;
        const pData = await pRes.json();
        const existing = pData.mealPlan;
        if (existing) {
          setPlanId(existing.id);
          setTitle(existing.title);
          setTargets({
            dailyCalorieTarget: String(existing.dailyCalorieTarget), proteinTargetG: String(existing.proteinTargetG),
            carbsTargetG: String(existing.carbsTargetG), fatTargetG: String(existing.fatTargetG),
          });
          setDurationDays(existing.durationDays || 7);
          setGuidelinesIncluded(existing.guidelinesIncluded !== false);
          setNotes(existing.notes || '');
          const n = Math.max(existing.durationDays || 1, ...existing.items.map((i: MealPlanItemLike) => i.dayNumber));
          const grid: Row[][] = Array.from({ length: n }, () => []);
          existing.items.forEach((i: MealPlanItemLike) => {
            grid[i.dayNumber - 1].push({
              mealLabel: i.mealLabel || 'Meal 1', foodName: i.foodName, quantity: i.quantity || i.portion || '',
              calories: String(i.calories), proteinG: String(i.proteinG), carbsG: String(i.carbsG), fatG: String(i.fatG),
              culturalAlternative: i.culturalAlternative || '',
            });
          });
          setDays(grid.map((d) => (d.length ? d : starterDay())));
        } else if (prof) {
          setTitle(`${match.firstName}'s ${String(prof.primaryGoal || 'nutrition').toLowerCase().replace('_', ' ')} plan`);
          setTargets({
            dailyCalorieTarget: String(Math.round(prof.dailyCalories || 0)), proteinTargetG: String(Math.round(prof.targetProteinG || 0)),
            carbsTargetG: String(Math.round(prof.targetCarbsG || 0)), fatTargetG: String(Math.round(prof.targetFatG || 0)),
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [clientId]);

  const resize = (n: number) => {
    setDurationDays(n);
    setDays((prev) => (prev.length >= n ? prev.slice(0, n) : [...prev, ...Array.from({ length: n - prev.length }, starterDay)]));
    setDay((d) => Math.min(d, n - 1));
  };
  const setCell = (rowIdx: number, field: keyof Row, value: string) =>
    setDays((prev) => prev.map((d, di) => (di !== day ? d : d.map((r, ri) => (ri !== rowIdx ? r : { ...r, [field]: value })))));
  const addRow = () => setDays((prev) => prev.map((d, di) => (di !== day ? d : [...d, emptyRow('Snack')])));
  const removeRow = (rowIdx: number) => setDays((prev) => prev.map((d, di) => (di !== day ? d : d.filter((_, ri) => ri !== rowIdx))));
  const copyDayToAll = () => setDays((prev) => prev.map((d, di) => (di === day ? d : prev[day].map((r) => ({ ...r })))));

  const target = Number(targets.dailyCalorieTarget) || 0;
  const totals = useMemo(() => dayTotals(days[day].map((r) => ({ dayNumber: day + 1, foodName: r.foodName, calories: +r.calories || 0, proteinG: +r.proteinG || 0, carbsG: +r.carbsG || 0, fatG: +r.fatG || 0 }))), [days, day]);
  const pct = target ? Math.round((totals.calories / target) * 100) : 0;

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const res = await fetch('/api/admin/meal-plans', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: clientId, title, ...targets, durationDays, guidelinesIncluded, notes,
          days: days.map((rows, i) => ({ dayNumber: i + 1, items: rows.map((r) => ({ ...r, mealType: LABEL_TO_TYPE[r.mealLabel] })) })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      setPlanId(data.mealPlan?.id || null);
      setMsg({ kind: 'ok', text: 'Meal plan published to the client.' });
    } catch (e: any) {
      setMsg({ kind: 'err', text: e.message || 'Could not save' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminAppShell
      title={client ? `Meal plan: ${client.firstName} ${client.lastName}` : 'Meal plan'}
      subtitle="Day by day, with exact quantities. Totals are checked against the client's targets as you type."
    >
      <div className="flex items-center justify-between gap-3">
        <Link href={`/admin/clients/${clientId}`} className="text-xs text-brand hover:underline inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft size={14} /> Back to client profile
        </Link>
        {planId && <DownloadPdfButton href={`/print/meal-plan/${planId}`} label="Download published PDF" />}
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${msg.kind === 'ok' ? 'bg-status-approved/15 border-status-approved/40 text-status-approved' : 'bg-status-rejected/15 border-status-rejected/40 text-status-rejected'}`}>
          {msg.kind === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {msg.text}
        </div>
      )}

      <div className="surface p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
          <label className="lg:col-span-2 block"><span className="field-label">Plan title</span><input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          {[['dailyCalorieTarget', 'Calories (kcal)'], ['proteinTargetG', 'Protein (g)'], ['carbsTargetG', 'Carbs (g)'], ['fatTargetG', 'Fat (g)']].map(([k, l]) => (
            <label key={k} className="block"><span className="field-label">{l}</span><input type="number" className="field-input" value={(targets as any)[k]} onChange={(e) => setTargets({ ...targets, [k]: e.target.value })} /></label>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <label className="block"><span className="field-label">Programme days</span>
            <select className="field-input" value={durationDays} onChange={(e) => resize(Number(e.target.value))}>
              {[1, 3, 5, 7, 10, 14].map((n) => <option key={n} value={n}>{n} day{n > 1 ? 's' : ''}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-secondary pb-2.5">
            <input type="checkbox" checked={guidelinesIncluded} onChange={(e) => setGuidelinesIncluded(e.target.checked)} className="accent-[var(--brand)]" />
            Append the nutrition guidelines to the PDF
          </label>
          <label className="block"><span className="field-label">Coach notes (optional)</span><input className="field-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Weigh carbohydrates cooked, proteins raw." /></label>
        </div>
      </div>

      <div className="surface p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="tablist">
            {days.map((_, i) => (
              <button key={i} role="tab" aria-selected={day === i} onClick={() => setDay(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${day === i ? 'bg-brand-strong text-brand-on-strong border-transparent' : 'bg-surface text-ink-secondary border-line hover:border-line-active'}`}>
                Day {i + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={copyDayToAll} className="btn-secondary text-xs py-1.5 px-3"><Copy size={13} /> Copy this day to all</button>
            <button type="button" onClick={addRow} className="btn-secondary text-xs py-1.5 px-3"><Plus size={13} /> Add item</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[820px]">
            <thead>
              <tr className="label-xs text-ink-muted text-left">
                <th className="py-2 pr-2 font-bold w-28">Meal</th>
                <th className="py-2 pr-2 font-bold">Food</th>
                <th className="py-2 pr-2 font-bold w-44">Exact quantity</th>
                <th className="py-2 pr-2 font-bold w-20">kcal</th>
                <th className="py-2 pr-2 font-bold w-16">P (g)</th>
                <th className="py-2 pr-2 font-bold w-16">C (g)</th>
                <th className="py-2 pr-2 font-bold w-16">F (g)</th>
                <th className="py-2 pr-2 font-bold w-40">Swap (optional)</th>
                <th className="py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {days[day].map((r, ri) => (
                <tr key={ri} className="border-t border-line">
                  <td className="py-1.5 pr-2">
                    <select className="field-input py-1.5" value={r.mealLabel} onChange={(e) => setCell(ri, 'mealLabel', e.target.value)}>
                      {LABELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </td>
                  <td className="py-1.5 pr-2"><input className="field-input py-1.5" value={r.foodName} onChange={(e) => setCell(ri, 'foodName', e.target.value)} placeholder="Jollof rice, grilled chicken, salad" /></td>
                  <td className="py-1.5 pr-2"><input className="field-input py-1.5" value={r.quantity} onChange={(e) => setCell(ri, 'quantity', e.target.value)} placeholder="180 g cooked, 150 g raw" /></td>
                  {(['calories', 'proteinG', 'carbsG', 'fatG'] as (keyof Row)[]).map((f) => (
                    <td key={f} className="py-1.5 pr-2"><input type="number" className="field-input py-1.5" value={r[f]} onChange={(e) => setCell(ri, f, e.target.value)} /></td>
                  ))}
                  <td className="py-1.5 pr-2"><input className="field-input py-1.5" value={r.culturalAlternative} onChange={(e) => setCell(ri, 'culturalAlternative', e.target.value)} /></td>
                  <td className="py-1.5"><button type="button" onClick={() => removeRow(ri)} className="p-1.5 text-ink-muted hover:text-status-rejected" aria-label="Remove item"><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line text-sm">
          <p className="text-ink-secondary">
            Day {day + 1} total: <strong className="text-ink">{Math.round(totals.calories).toLocaleString()} kcal</strong> · {Math.round(totals.proteinG)} g P · {Math.round(totals.carbsG)} g C · {Math.round(totals.fatG)} g F
          </p>
          <p className={`font-semibold ${pct > 105 || pct < 90 ? 'text-status-pending' : 'text-brand'}`}>{target ? `${pct}% of ${target.toLocaleString()} kcal` : 'Set a calorie target'}</p>
        </div>
        <div className="h-1.5 rounded-full bg-paper border border-line overflow-hidden"><div className={`h-full ${pct > 105 ? 'bg-status-pending' : 'bg-brand'}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>

        <button type="button" onClick={save} disabled={saving || !title} className="btn-brand text-sm w-full justify-center py-3">
          {saving ? 'Publishing…' : 'Publish meal plan to client'}
        </button>
      </div>
    </AdminAppShell>
  );
}
