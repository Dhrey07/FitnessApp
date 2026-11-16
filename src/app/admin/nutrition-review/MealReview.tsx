'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Avatar, Button, EmptyState, Field, IconButton, LargeTitle, ListRow, ListRows, Pill, Segmented, Stat, StatRow, TextArea, toast } from '@/components/ui';
import { useIsDesktop } from '@/lib/useMediaQuery';
import { cn } from '@/lib/cn';

interface Macros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealItem {
  id: string;
  name: string;
  firstName: string;
  text: string;
  imageUrl: string | null;
  mealType: string;
  date: string;
  pending: boolean;
  status: string;
  dailyCalories: number;
  estimate: Macros;
  notes: string[];
  review: (Macros & { feedback: string }) | null;
}

const label = (t: string) => t.charAt(0) + t.slice(1).toLowerCase();
const when = (d: string) => new Date(d).toLocaleString('en-GB', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true });

function statusPill(m: MealItem) {
  if (m.pending) return <Pill tone="pending">To check</Pill>;
  if (m.status === 'MODIFIED') return <Pill tone="modified">Adjusted</Pill>;
  if (m.status === 'REJECTED') return <Pill tone="rejected">Redo asked</Pill>;
  return <Pill tone="approved">Checked</Pill>;
}

function Review({ item, onDone, onBack }: { item: MealItem; onDone: (id: string) => void; onBack?: () => void }) {
  const router = useRouter();
  const start = item.review ?? item.estimate;
  const [m, setM] = useState({ kcal: String(start.kcal), protein: String(start.protein), carbs: String(start.carbs), fat: String(start.fat) });
  const [feedback, setFeedback] = useState(item.review?.feedback ?? '');
  const [busy, setBusy] = useState<'' | 'save' | 'redo'>('');
  const [error, setError] = useState('');

  useEffect(() => {
    const s = item.review ?? item.estimate;
    setM({ kcal: String(s.kcal), protein: String(s.protein), carbs: String(s.carbs), fat: String(s.fat) });
    setFeedback(item.review?.feedback ?? '');
    setError('');
  }, [item]);

  const changed = Number(m.kcal) !== item.estimate.kcal || Number(m.protein) !== item.estimate.protein || Number(m.carbs) !== item.estimate.carbs || Number(m.fat) !== item.estimate.fat;

  const submit = async (kind: 'save' | 'redo') => {
    if (kind === 'redo' && !feedback.trim()) {
      setError(`Tell ${item.firstName} what to change when they log it again.`);
      return;
    }
    setBusy(kind);
    setError('');
    try {
      const res = await fetch(`/api/nutrition/${item.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved: kind !== 'redo',
          actionTaken: kind === 'redo' ? 'REJECTED' : changed ? 'MODIFIED' : 'APPROVED',
          finalCalories: Number(m.kcal),
          finalProtein: Number(m.protein),
          finalCarbs: Number(m.carbs),
          finalFat: Number(m.fat),
          coachFeedback: feedback.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save the review.');
      toast(kind === 'redo' ? `Asked ${item.firstName} to log it again` : changed ? 'Adjusted and sent' : 'Estimate approved');
      onDone(item.id);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the review.');
    } finally {
      setBusy('');
    }
  };

  const share = item.dailyCalories ? Math.round((Number(m.kcal) / item.dailyCalories) * 100) : null;

  return (
    <article className="space-y-6">
      <header className="flex items-center gap-3">
        {onBack && (
          <IconButton label="Back to list" onClick={onBack} className="-ml-2">
            <ChevronLeft size={22} />
          </IconButton>
        )}
        <Avatar name={item.name} />
        <div className="min-w-0 flex-1">
          <h2 className="t-h3 truncate">{item.name}</h2>
          <p className="t-caption">{label(item.mealType)} · {when(item.date)}</p>
        </div>
        {statusPill(item)}
      </header>

      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageUrl} alt={`${item.firstName}'s ${label(item.mealType).toLowerCase()}`} className="w-full max-h-80 object-cover rounded-[var(--radius-md)]" />
      )}
      <p className="t-body text-ink">{item.text}</p>

      <div className="space-y-2">
        <p className="t-caption">Estimate</p>
        <StatRow>
          <Stat label="kcal" value={item.estimate.kcal} />
          <Stat label="protein" value={item.estimate.protein} unit="g" />
          <Stat label="carbohydrate" value={item.estimate.carbs} unit="g" />
          <Stat label="fat" value={item.estimate.fat} unit="g" />
        </StatRow>
        {item.notes.length > 0 && <p className="t-body-sm">{item.notes.join(' ')}</p>}
      </div>

      <div className="hairline pt-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Calories" unit="kcal"><input value={m.kcal} onChange={(e) => setM({ ...m, kcal: e.target.value })} inputMode="numeric" /></Field>
          <Field label="Protein" unit="g"><input value={m.protein} onChange={(e) => setM({ ...m, protein: e.target.value })} inputMode="numeric" /></Field>
          <Field label="Carbs" unit="g"><input value={m.carbs} onChange={(e) => setM({ ...m, carbs: e.target.value })} inputMode="numeric" /></Field>
          <Field label="Fat" unit="g"><input value={m.fat} onChange={(e) => setM({ ...m, fat: e.target.value })} inputMode="numeric" /></Field>
        </div>
        {share != null && <p className="t-caption tnum">{share}% of {item.firstName}&apos;s {item.dailyCalories.toLocaleString()} kcal day</p>}
        <TextArea label={`Note to ${item.firstName}`} placeholder="Optional. A swap or a portion tip." value={feedback} onChange={(e) => setFeedback(e.target.value)} error={error || undefined} className="[&_textarea]:min-h-[88px]" />
      </div>

      <div className="sticky bottom-0 -mx-4 md:mx-0 px-4 md:px-0 py-3 md:py-0 bg-[var(--bg-header)] md:bg-transparent backdrop-blur-md md:backdrop-blur-none safe-pb md:static flex gap-3">
        <Button variant="secondary" loading={busy === 'redo'} disabled={Boolean(busy)} onClick={() => submit('redo')}>Ask to redo</Button>
        <Button full className="md:w-auto" loading={busy === 'save'} disabled={Boolean(busy)} onClick={() => submit('save')}>
          {changed ? 'Save adjusted numbers' : 'Approve estimate'}
        </Button>
      </div>
    </article>
  );
}

export function MealReview({ items, initialId, linked, pendingCount }: { items: MealItem[]; initialId: string | null; linked: boolean; pendingCount: number }) {
  const desktop = useIsDesktop();
  const [filter, setFilter] = useState<'pending' | 'done'>(() => (initialId && items.find((i) => i.id === initialId)?.pending === false ? 'done' : 'pending'));
  const [selected, setSelected] = useState<string | null>(linked ? initialId : null);
  const [done, setDone] = useState<string[]>([]);

  const list = useMemo(() => items.filter((i) => (filter === 'pending' ? i.pending && !done.includes(i.id) : !i.pending || done.includes(i.id))), [items, filter, done]);
  // Phones open a review only when tapped or linked; desktop always shows one beside the list.
  const current = items.find((i) => i.id === (selected ?? (desktop ? initialId : null))) ?? null;
  // Count from the list itself: after a refresh the server count already excludes what was just checked.
  const left = items.filter((i) => i.pending && !done.includes(i.id)).length;
  void pendingCount;

  const onDone = (id: string) => {
    setDone((d) => [...d, id]);
    const next = items.find((i) => i.pending && i.id !== id && !done.includes(i.id));
    setSelected(next ? next.id : desktop ? id : null);
  };

  const title = <LargeTitle title="Meals" description={left ? `${left} ${left === 1 ? 'meal' : 'meals'} to check.` : 'Every meal is checked.'} />;

  const listView = (
    <div className="space-y-4">
      <Segmented label="Show" size="sm" value={filter} onChange={setFilter} options={[{ value: 'pending', label: `To check (${left})` }, { value: 'done', label: 'Checked' }]} className="w-full" />
      {list.length === 0 ? (
        <EmptyState message={filter === 'pending' ? 'Nothing to check. Meals appear here as clients log them.' : 'Checked meals appear here.'} className="py-10" />
      ) : (
        <ListRows>
          {list.map((i) => (
            <ListRow
              key={i.id}
              onClick={() => setSelected(i.id)}
              leading={
                i.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.imageUrl} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" />
                ) : (
                  <Avatar name={i.name} size="sm" />
                )
              }
              title={`${i.firstName} · ${i.text}`}
              subtitle={`${label(i.mealType)} · ${when(i.date)} · ${i.estimate.kcal} kcal`}
              trailing={!i.pending || done.includes(i.id) ? statusPill({ ...i, pending: false, status: i.status === 'AWAITING_COACH' ? 'APPROVED' : i.status }) : undefined}
              className={cn(desktop && current?.id === i.id && 'bg-[var(--bg-card-hover)]')}
              chevron={!desktop}
            />
          ))}
        </ListRows>
      )}
    </div>
  );

  if (desktop) {
    return (
      <div className="space-y-6">
        {title}
        <div className="grid grid-cols-[minmax(240px,2fr)_3fr] gap-10 items-start">
          <div className="sticky top-8">{listView}</div>
          {current ? <Review key={current.id} item={current} onDone={onDone} /> : <EmptyState message="Pick a meal to check." />}
        </div>
      </div>
    );
  }

  if (current) {
    return (
      <div className="fixed inset-0 z-50 bg-paper overflow-y-auto motion-enter">
        <div className="px-4 pt-3 pb-6">
          <Review key={current.id} item={current} onDone={onDone} onBack={() => setSelected(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title}
      {listView}
    </div>
  );
}
