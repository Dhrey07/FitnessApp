'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText, User } from 'lucide-react';
import { Avatar, Button, EmptyState, Field, IconButton, LargeTitle, ListRow, ListRows, Menu, Pill, Segmented, Stat, StatRow, TextArea, toast } from '@/components/ui';
import { useIsDesktop } from '@/lib/useMediaQuery';
import { cn } from '@/lib/cn';

export interface ReviewItem {
  id: string;
  userId: string;
  name: string;
  firstName: string;
  date: string;
  status: string;
  weightKg: number;
  waistCm: number;
  prevWeightKg: number | null;
  prevWaistCm: number | null;
  steps: number | null;
  sessions: string;
  nutrition: number;
  hunger: number | null;
  energy: number;
  sleep: number;
  stress: number | null;
  wins: string | null;
  challenges: string | null;
  helpNeeded: string | null;
  summary: string | null;
  feedback: string | null;
  calories: number;
}

const WORDS: Record<string, string[]> = {
  hunger: ['Never hungry', 'Rarely', 'Manageable', 'Often hungry', 'Hungry all day'],
  energy: ['Exhausted', 'Low', 'Moderate', 'Good', 'Excellent'],
  sleep: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'],
  stress: ['Very low', 'Low', 'Moderate', 'High', 'Very high'],
};

const when = (d: string) => new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

function deltaLabel(now: number, prev: number | null, unit: string) {
  if (prev == null) return 'first one';
  const d = Math.round((now - prev) * 10) / 10;
  return d === 0 ? 'same' : `${d > 0 ? 'up' : 'down'} ${Math.abs(d)}${unit ? ` ${unit}` : ''}`;
}

function Review({ item, onSent, onBack }: { item: ReviewItem; onSent: (id: string) => void; onBack?: () => void }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState(item.feedback ?? '');
  const [calories, setCalories] = useState(String(item.calories || ''));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFeedback(item.feedback ?? '');
    setCalories(String(item.calories || ''));
    setError('');
  }, [item.id, item.feedback, item.calories]);

  const send = async () => {
    if (!feedback.trim()) {
      setError(`Write a few lines for ${item.firstName} first.`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkInId: item.id, coachFeedback: feedback.trim(), adjustedCalorieTarget: calories && Number(calories) !== item.calories ? calories : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send feedback.');
      toast(`Sent to ${item.firstName}`, Number(calories) !== item.calories ? `Calories now ${Number(calories).toLocaleString()} kcal.` : undefined);
      onSent(item.id);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send feedback.');
    } finally {
      setBusy(false);
    }
  };

  const notes = ([['Wins', item.wins], ['What was hard', item.challenges], ['Needs help with', item.helpNeeded]] as const).filter(([, v]) => v);
  const scales = (['hunger', 'energy', 'sleep', 'stress'] as const).filter((k) => item[k]);

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
          <p className="t-caption">{when(item.date)} · {item.status === 'REVIEWED' ? 'reviewed' : 'waiting for you'}</p>
        </div>
        <Menu
          label="Check-in options"
          items={[
            { label: 'Create progress report', icon: <FileText size={16} />, href: `/admin/clients/${item.userId}/reports/new?checkInId=${item.id}` },
            { label: 'Open client', icon: <User size={16} />, href: `/admin/clients/${item.userId}` },
          ]}
        />
      </header>

      <StatRow>
        <Stat label={`weight, ${deltaLabel(item.weightKg, item.prevWeightKg, '')}`} value={item.weightKg} unit="kg" />
        <Stat label={`waist, ${deltaLabel(item.waistCm, item.prevWaistCm, '')}`} value={item.waistCm} unit="cm" />
        <Stat label="sessions" value={item.sessions} />
        <Stat label="meals on plan" value={item.nutrition} unit="%" />
      </StatRow>

      {(scales.length > 0 || item.steps != null) && (
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 hairline pt-4">
          {item.steps != null && (
            <div>
              <dt className="t-caption">Steps a day</dt>
              <dd className="t-ui mt-0.5 tnum">{item.steps.toLocaleString()}</dd>
            </div>
          )}
          {scales.map((k) => (
            <div key={k}>
              <dt className="t-caption">{k === 'sleep' ? 'Sleep' : k[0].toUpperCase() + k.slice(1)}</dt>
              <dd className="t-ui mt-0.5">{WORDS[k][(item[k] as number) - 1]} <span className="text-ink-muted tnum">· {item[k]}/5</span></dd>
            </div>
          ))}
        </dl>
      )}

      {notes.length > 0 && (
        <div className="space-y-3">
          {notes.map(([k, v]) => (
            <figure key={k} className="surface-inset px-4 py-3">
              <figcaption className="t-caption">{k}</figcaption>
              <blockquote className="t-body text-ink mt-1">{v}</blockquote>
            </figure>
          ))}
        </div>
      )}
      {item.summary && <p className="t-body-sm">{item.summary}</p>}

      <div className="hairline pt-6 space-y-4">
        <TextArea label={`Feedback to ${item.firstName}`} placeholder="What the numbers say, what to keep doing, and the one change for next week." value={feedback} onChange={(e) => setFeedback(e.target.value)} error={error || undefined} />
        <Field label="Daily calories" unit="kcal" help="Change only if the trend calls for it.">
          <input value={calories} onChange={(e) => setCalories(e.target.value)} inputMode="numeric" />
        </Field>
      </div>

      <div className="sticky bottom-0 -mx-4 md:mx-0 px-4 md:px-0 py-3 md:py-0 bg-[var(--bg-header)] md:bg-transparent backdrop-blur-md md:backdrop-blur-none safe-pb md:static">
        <Button full size="lg" className="md:w-auto" loading={busy} onClick={send}>
          {item.status === 'REVIEWED' ? `Update feedback for ${item.firstName}` : `Send to ${item.firstName}`}
        </Button>
      </div>
    </article>
  );
}

export function CheckInReview({ items, initialId, linked, pendingCount }: { items: ReviewItem[]; initialId: string | null; linked: boolean; pendingCount: number }) {
  const desktop = useIsDesktop();
  const [filter, setFilter] = useState<'pending' | 'reviewed'>(() => (initialId && items.find((i) => i.id === initialId)?.status === 'REVIEWED' ? 'reviewed' : 'pending'));
  const [selected, setSelected] = useState<string | null>(linked ? initialId : null);
  const [sent, setSent] = useState<string[]>([]);

  const list = useMemo(
    () => items.filter((i) => (filter === 'pending' ? i.status !== 'REVIEWED' && !sent.includes(i.id) : i.status === 'REVIEWED' || sent.includes(i.id))),
    [items, filter, sent]
  );
  // Phones open a review only when tapped or linked; desktop always shows one beside the list.
  const current = items.find((i) => i.id === (selected ?? (desktop ? initialId : null))) ?? null;
  // Count from the list itself: after a refresh the server count already excludes what was just sent.
  const left = items.filter((i) => i.status !== 'REVIEWED' && !sent.includes(i.id)).length;
  void pendingCount;

  const onSent = (id: string) => {
    setSent((s) => [...s, id]);
    const next = items.find((i) => i.status !== 'REVIEWED' && i.id !== id && !sent.includes(i.id));
    setSelected(next ? next.id : desktop ? id : null);
  };

  const listView = (
    <div className="space-y-4">
      <Segmented label="Show" size="sm" value={filter} onChange={setFilter} options={[{ value: 'pending', label: `To review (${left})` }, { value: 'reviewed', label: 'Reviewed' }]} className="w-full" />
      {list.length === 0 ? (
        <EmptyState message={filter === 'pending' ? 'Every check-in is reviewed. New ones arrive on Sundays.' : 'Reviewed check-ins appear here.'} className="py-10" />
      ) : (
        <ListRows>
          {list.map((i) => (
            <ListRow
              key={i.id}
              onClick={() => setSelected(i.id)}
              leading={<Avatar name={i.name} size="sm" />}
              title={i.name}
              subtitle={`${when(i.date)} · ${i.weightKg} kg · ${deltaLabel(i.weightKg, i.prevWeightKg, 'kg')}`}
              trailing={i.status === 'REVIEWED' || sent.includes(i.id) ? <Pill tone="approved">Sent</Pill> : undefined}
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
        <LargeTitle title="Check-ins" description={left > 0 ? `${left} waiting for your feedback.` : 'All caught up.'} />
        <div className="grid grid-cols-[minmax(240px,2fr)_3fr] gap-10 items-start">
          <div className="sticky top-8">{listView}</div>
          {current ? <Review key={current.id} item={current} onSent={onSent} /> : <EmptyState message="Pick a check-in to review." />}
        </div>
      </div>
    );
  }

  if (current) {
    return (
      <div className="fixed inset-0 z-50 bg-paper overflow-y-auto motion-enter">
        <div className="px-4 pt-3 pb-6">
          <Review key={current.id} item={current} onSent={onSent} onBack={() => setSelected(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LargeTitle title="Check-ins" description={left > 0 ? `${left} waiting for your feedback.` : 'All caught up.'} />
      {listView}
    </div>
  );
}
