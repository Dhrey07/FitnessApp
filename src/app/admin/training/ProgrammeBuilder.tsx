'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Copy, Download, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { Button, EmptyState, Field, IconButton, ListRow, ListRows, Menu, Pill, Section, SelectField, Sheet, TextArea, toast } from '@/components/ui';
import { useIsDesktop } from '@/lib/useMediaQuery';
import { cn } from '@/lib/cn';

export interface BuilderClient {
  id: string;
  name: string;
  firstName: string;
  plan: string;
}

interface Ex {
  name: string;
  sets: string;
  reps: string;
  restSeconds: string;
  tempo: string;
  rpe: string;
  rir: string;
  progressionGuidance: string;
  coachNotes: string;
}

interface Day {
  dayName: string;
  title: string;
  exercises: Ex[];
}

export interface SavedPlan {
  id: string;
  userId: string;
  clientName: string;
  title: string;
  goal: string;
  weeks: number;
  active: boolean;
  createdAt: string;
  days: Day[];
}

const PROGRESSION = 'Add 2.5 kg once every set reaches the top of the range at RPE 8.';
const ex = (name: string, sets: number, reps: string, rest: number, notes = ''): Ex => ({ name, sets: String(sets), reps, restSeconds: String(rest), tempo: '2-0-1', rpe: '8', rir: '2', progressionGuidance: PROGRESSION, coachNotes: notes });
const TEMPLATE: Day[] = [
  { dayName: 'Day 1', title: 'Upper body push', exercises: [ex('Incline dumbbell press', 4, '8-10', 75, 'Control the lowering'), ex('Seated dumbbell shoulder press', 3, '10-12', 60), ex('Push-ups', 3, '12-15', 45)] },
  { dayName: 'Day 2', title: 'Lower body', exercises: [ex('Barbell back squat', 4, '6-8', 150, 'Below parallel'), ex('Romanian deadlift', 3, '8-10', 120), ex('Walking lunge', 3, '10 per leg', 90)] },
  { dayName: 'Day 3', title: 'Upper body pull', exercises: [ex('Lat pulldown', 4, '8-10', 75), ex('Seated cable row', 3, '10-12', 60), ex('Dumbbell curl', 3, '12-15', 45)] },
];
const blankEx = (): Ex => ({ name: '', sets: '3', reps: '10-12', restSeconds: '60', tempo: '2-0-1', rpe: '8', rir: '2', progressionGuidance: '', coachNotes: '' });
const clone = (d: Day[]) => d.map((x) => ({ ...x, exercises: x.exercises.map((e) => ({ ...e })) }));

const COLS: { key: keyof Ex; label: string; w: string; mode?: 'numeric' | 'decimal' | 'text' }[] = [
  { key: 'name', label: 'Exercise', w: 'minmax(180px,1fr)' },
  { key: 'sets', label: 'Sets', w: '56px', mode: 'numeric' },
  { key: 'reps', label: 'Reps', w: '84px' },
  { key: 'restSeconds', label: 'Rest s', w: '64px', mode: 'numeric' },
  { key: 'tempo', label: 'Tempo', w: '72px' },
  { key: 'rpe', label: 'RPE', w: '52px', mode: 'decimal' },
  { key: 'rir', label: 'RIR', w: '52px', mode: 'numeric' },
];
const GRID = `24px ${COLS.map((c) => c.w).join(' ')} 124px`;

const cell = 'w-full h-10 px-2 rounded-[var(--radius-sm)] border border-transparent bg-transparent text-sm text-ink tnum outline-none hover:border-[var(--border-input)] focus:border-line-active focus:bg-[var(--bg-input)] transition-colors';

export function ProgrammeBuilder({ clients, saved, initialClientId }: { clients: BuilderClient[]; saved: SavedPlan[]; initialClientId: string | null }) {
  const router = useRouter();
  const desktop = useIsDesktop();
  const [clientId, setClientId] = useState(initialClientId && clients.some((c) => c.id === initialClientId) ? initialClientId : clients[0]?.id ?? '');
  const current = useMemo(() => saved.find((p) => p.userId === clientId && p.active), [saved, clientId]);
  const [title, setTitle] = useState(current?.title ?? '12-week strength and fat loss');
  const [goal, setGoal] = useState(current?.goal ?? 'FAT_LOSS');
  const [weeks, setWeeks] = useState(String(current?.weeks ?? 12));
  const [days, setDays] = useState<Day[]>(clone(current?.days ?? TEMPLATE));
  const [editing, setEditing] = useState<{ d: number; e: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const client = clients.find((c) => c.id === clientId);

  const load = (p: SavedPlan | null, label: string) => {
    if (p) {
      setTitle(p.title);
      setGoal(p.goal);
      setWeeks(String(p.weeks));
      setDays(clone(p.days));
    } else {
      setDays(clone(TEMPLATE));
    }
    toast(label);
  };

  const setEx = (d: number, e: number, k: keyof Ex, v: string) => setDays((ds) => ds.map((day, i) => (i !== d ? day : { ...day, exercises: day.exercises.map((x, j) => (j !== e ? x : { ...x, [k]: v })) })));
  const setDay = (d: number, k: 'dayName' | 'title', v: string) => setDays((ds) => ds.map((day, i) => (i !== d ? day : { ...day, [k]: v })));
  const move = <T,>(arr: T[], from: number, to: number) => {
    if (to < 0 || to >= arr.length) return arr;
    const a = [...arr];
    const [x] = a.splice(from, 1);
    a.splice(to, 0, x);
    return a;
  };
  const moveEx = (d: number, e: number, dir: -1 | 1) => setDays((ds) => ds.map((day, i) => (i !== d ? day : { ...day, exercises: move(day.exercises, e, e + dir) })));
  const removeEx = (d: number, e: number) => setDays((ds) => ds.map((day, i) => (i !== d ? day : { ...day, exercises: day.exercises.filter((_, j) => j !== e) })));
  const addEx = (d: number) => {
    setDays((ds) => ds.map((day, i) => (i !== d ? day : { ...day, exercises: [...day.exercises, blankEx()] })));
    if (!desktop) setEditing({ d, e: days[d].exercises.length });
    else window.setTimeout(() => document.querySelector<HTMLInputElement>(`[data-cell="${d}-${days[d].exercises.length}-name"]`)?.focus(), 0);
  };
  const duplicateDay = (d: number) => setDays((ds) => [...ds.slice(0, d + 1), { ...clone([ds[d]])[0], dayName: `Day ${ds.length + 1}`, title: `${ds[d].title} (copy)` }, ...ds.slice(d + 1)]);
  const removeDay = (d: number) => setDays((ds) => ds.filter((_, i) => i !== d));
  const addDay = () => setDays((ds) => [...ds, { dayName: `Day ${ds.length + 1}`, title: '', exercises: [blankEx()] }]);

  /** Enter moves down the same column, like a spreadsheet. */
  const onCellKey = (e: React.KeyboardEvent<HTMLInputElement>, d: number, i: number, k: keyof Ex) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const next = document.querySelector<HTMLInputElement>(`[data-cell="${d}-${i + (e.shiftKey ? -1 : 1)}-${k}"]`) ?? document.querySelector<HTMLInputElement>(`[data-cell="${d + 1}-0-${k}"]`);
    next?.focus();
    next?.select();
  };

  const totalEx = days.reduce((s, d) => s + d.exercises.length, 0);
  const invalid = days.some((d) => d.exercises.some((x) => !x.name.trim()));

  const assign = async () => {
    if (!client) return;
    if (invalid) {
      toast.error('Every exercise needs a name');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin/workout-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: client.id,
          title,
          goal,
          durationWeeks: weeks,
          workouts: days.map((d, i) => ({ dayName: d.dayName || `Day ${i + 1}`, title: d.title || `Session ${i + 1}`, exercises: d.exercises })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not assign the programme.');
      toast(`Assigned to ${client.firstName}`, `${days.length} sessions, ${totalEx} exercises.`);
      router.refresh();
    } catch (e) {
      toast.error('Not assigned', e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  const ed = editing ? days[editing.d]?.exercises[editing.e] : null;

  return (
    <div className="space-y-8">
      <Section first>
        <div className="grid gap-4 md:grid-cols-[1.2fr_1.6fr_1fr_0.8fr]">
          <SelectField label="Client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.plan}</option>)}
          </SelectField>
          <Field label="Programme title"><input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <SelectField label="Goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="FAT_LOSS">Fat loss</option>
            <option value="BODY_RECOMPOSITION">Recomposition</option>
            <option value="MUSCLE_GAIN">Muscle gain</option>
            <option value="STRENGTH_PERFORMANCE">Strength</option>
            <option value="GENERAL_HEALTH">General health</option>
          </SelectField>
          <SelectField label="Length" value={weeks} onChange={(e) => setWeeks(e.target.value)}>
            {[4, 6, 8, 12, 16].map((n) => <option key={n} value={n}>{n} weeks</option>)}
          </SelectField>
        </div>
        <div className="flex flex-wrap gap-2">
          {current && <Button size="sm" variant="secondary" leading={<FolderOpen size={14} />} onClick={() => load(current, `Loaded ${client?.firstName}'s current programme`)}>Load {client?.firstName}&apos;s current programme</Button>}
          <Button size="sm" variant="ghost" onClick={() => load(null, 'Template loaded')}>Start from template</Button>
        </div>
      </Section>

      {days.map((day, d) => (
        <Section key={d}>
          <div className="flex items-end gap-3">
            <div className="w-28 shrink-0"><Field label="Day"><input value={day.dayName} onChange={(e) => setDay(d, 'dayName', e.target.value)} /></Field></div>
            <div className="flex-1 min-w-0"><Field label="Session"><input value={day.title} onChange={(e) => setDay(d, 'title', e.target.value)} placeholder="Upper body push" /></Field></div>
            <Menu
              label={`${day.dayName} options`}
              items={[
                { label: 'Duplicate day', icon: <Copy size={16} />, onSelect: () => duplicateDay(d) },
                { label: 'Move up', icon: <ArrowUp size={16} />, onSelect: () => setDays((ds) => move(ds, d, d - 1)) },
                { label: 'Move down', icon: <ArrowDown size={16} />, onSelect: () => setDays((ds) => move(ds, d, d + 1)) },
                { label: 'Remove day', icon: <Trash2 size={16} />, destructive: true, onSelect: () => removeDay(d) },
              ]}
            />
          </div>

          {desktop ? (
            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid gap-1 items-center t-caption pb-1 hairline-b" style={{ gridTemplateColumns: GRID }}>
                  <span />
                  {COLS.map((c) => <span key={c.key} className="px-2">{c.label}</span>)}
                  <span />
                </div>
                {day.exercises.map((x, i) => (
                  <div key={i} className="hairline-b py-1.5">
                    <div className="grid gap-1 items-center" style={{ gridTemplateColumns: GRID }}>
                      <span className="t-caption tnum text-center">{i + 1}</span>
                      {COLS.map((c) => (
                        <input
                          key={c.key}
                          data-cell={`${d}-${i}-${c.key}`}
                          aria-label={`${c.label}, exercise ${i + 1}`}
                          value={x[c.key]}
                          onChange={(e) => setEx(d, i, c.key, e.target.value)}
                          onKeyDown={(e) => onCellKey(e, d, i, c.key)}
                          inputMode={c.mode === 'numeric' ? 'numeric' : c.mode === 'decimal' ? 'decimal' : undefined}
                          placeholder={c.key === 'name' ? 'Exercise name' : ''}
                          className={cn(cell, c.key === 'name' && 'font-medium', c.key === 'name' && !x.name.trim() && 'border-[var(--status-rejected)]')}
                        />
                      ))}
                      <span className="flex items-center justify-end">
                        <IconButton label="Move up" size="sm" disabled={i === 0} onClick={() => moveEx(d, i, -1)}><ArrowUp size={14} /></IconButton>
                        <IconButton label="Move down" size="sm" disabled={i === day.exercises.length - 1} onClick={() => moveEx(d, i, 1)}><ArrowDown size={14} /></IconButton>
                        <IconButton label="Remove exercise" size="sm" onClick={() => removeEx(d, i)}><Trash2 size={14} /></IconButton>
                      </span>
                    </div>
                    <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: '24px 1fr 1fr 104px' }}>
                      <span />
                      <input data-cell={`${d}-${i}-progressionGuidance`} aria-label={`Progression, exercise ${i + 1}`} value={x.progressionGuidance} onChange={(e) => setEx(d, i, 'progressionGuidance', e.target.value)} onKeyDown={(e) => onCellKey(e, d, i, 'progressionGuidance')} placeholder="Progression: when to add load" className={cn(cell, 'text-ink-secondary')} />
                      <input data-cell={`${d}-${i}-coachNotes`} aria-label={`Coach notes, exercise ${i + 1}`} value={x.coachNotes} onChange={(e) => setEx(d, i, 'coachNotes', e.target.value)} onKeyDown={(e) => onCellKey(e, d, i, 'coachNotes')} placeholder="Coach note" className={cn(cell, 'text-ink-secondary')} />
                      <span />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ListRows className="hairline">
              {day.exercises.map((x, i) => (
                <ListRow
                  key={i}
                  onClick={() => setEditing({ d, e: i })}
                  title={x.name || <span className="text-status-rejected">Name this exercise</span>}
                  subtitle={`${x.sets} × ${x.reps} · rest ${x.restSeconds}s${x.rpe ? ` · RPE ${x.rpe}` : ''}`}
                />
              ))}
            </ListRows>
          )}
          <Button size="sm" variant="ghost" leading={<Plus size={14} />} onClick={() => addEx(d)}>Add exercise</Button>
        </Section>
      ))}

      <Button variant="secondary" leading={<Plus size={16} />} onClick={addDay}>Add a day</Button>

      <div className="sticky z-20 -mx-4 md:-mx-10 px-4 md:px-10 py-3 bg-[var(--bg-header)] backdrop-blur-md hairline flex items-center gap-4 bottom-[calc(var(--tabbar-height)+env(safe-area-inset-bottom,0px))] md:bottom-0">
        <p className="hidden md:block t-body-sm flex-1 tnum">{days.length} sessions · {totalEx} exercises{client ? ` · for ${client.name}` : ''}</p>
        <Button size="lg" full className="md:w-auto" loading={busy} disabled={!client || days.length === 0} onClick={assign}>
          Assign to {client?.firstName ?? 'client'}
        </Button>
      </div>

      <Section title="Assigned programmes">
        {saved.length === 0 ? (
          <EmptyState message="Programmes you assign appear here." />
        ) : (
          <ListRows>
            {saved.map((p) => (
              <ListRow
                key={p.id}
                title={p.title}
                subtitle={`${p.clientName} · ${p.weeks} weeks · ${p.days.length} sessions · ${new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                trailing={
                  <span className="flex items-center gap-1">
                    {p.active && <Pill tone="approved">Active</Pill>}
                    <Menu
                      label="Programme options"
                      items={[
                        { label: 'Load into builder', icon: <FolderOpen size={16} />, onSelect: () => { setClientId(p.userId); load(p, `Loaded ${p.title}`); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                        { label: 'Download PDF', icon: <Download size={16} />, href: `/print/workout-programme/${p.id}?autoprint=1` },
                      ]}
                    />
                  </span>
                }
              />
            ))}
          </ListRows>
        )}
      </Section>

      <Sheet
        open={Boolean(ed)}
        onOpenChange={(o) => !o && setEditing(null)}
        title={ed?.name || 'New exercise'}
        footer={
          editing && (
            <div className="flex gap-3">
              <Button variant="ghost" className="text-status-rejected" onClick={() => { removeEx(editing.d, editing.e); setEditing(null); }}>Remove</Button>
              <Button full onClick={() => setEditing(null)}>Done</Button>
            </div>
          )
        }
      >
        {ed && editing && (
          <div className="space-y-4">
            <Field label="Exercise"><input value={ed.name} onChange={(e) => setEx(editing.d, editing.e, 'name', e.target.value)} autoFocus /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Sets"><input value={ed.sets} onChange={(e) => setEx(editing.d, editing.e, 'sets', e.target.value)} inputMode="numeric" /></Field>
              <Field label="Reps"><input value={ed.reps} onChange={(e) => setEx(editing.d, editing.e, 'reps', e.target.value)} /></Field>
              <Field label="Rest" unit="s"><input value={ed.restSeconds} onChange={(e) => setEx(editing.d, editing.e, 'restSeconds', e.target.value)} inputMode="numeric" /></Field>
              <Field label="Tempo"><input value={ed.tempo} onChange={(e) => setEx(editing.d, editing.e, 'tempo', e.target.value)} /></Field>
              <Field label="RPE"><input value={ed.rpe} onChange={(e) => setEx(editing.d, editing.e, 'rpe', e.target.value)} inputMode="decimal" /></Field>
              <Field label="RIR"><input value={ed.rir} onChange={(e) => setEx(editing.d, editing.e, 'rir', e.target.value)} inputMode="numeric" /></Field>
            </div>
            <TextArea label="Progression" value={ed.progressionGuidance} onChange={(e) => setEx(editing.d, editing.e, 'progressionGuidance', e.target.value)} className="[&_textarea]:min-h-[72px]" />
            <TextArea label="Coach note" value={ed.coachNotes} onChange={(e) => setEx(editing.d, editing.e, 'coachNotes', e.target.value)} className="[&_textarea]:min-h-[72px]" />
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" leading={<ArrowUp size={14} />} disabled={editing.e === 0} onClick={() => { moveEx(editing.d, editing.e, -1); setEditing({ ...editing, e: editing.e - 1 }); }}>Move up</Button>
              <Button size="sm" variant="secondary" leading={<ArrowDown size={14} />} disabled={editing.e === days[editing.d].exercises.length - 1} onClick={() => { moveEx(editing.d, editing.e, 1); setEditing({ ...editing, e: editing.e + 1 }); }}>Move down</Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
