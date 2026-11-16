'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Composer, type ComposerMode } from '@/components/ui/Composer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, TextArea } from '@/components/ui/Field';
import { HeroStat, Stat, StatRow } from '@/components/ui/Stat';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Pill } from '@/components/ui/Pill';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Section } from '@/components/ui/Section';
import { Segmented } from '@/components/ui/Segmented';
import { Sheet } from '@/components/ui/Sheet';
import { Tab, TabPanel, Tabs, TabsList } from '@/components/ui/Tabs';
import { toast } from '@/components/ui/Toast';
import { MealPlanView } from '@/components/nutrition/MealPlanView';
import type { MealPlanLike } from '@/components/nutrition/MealPlanTable';
import type { Meal } from '@/lib/client/data';
import { FOOD_LIBRARY, type FoodItem } from '@/lib/foodLibrary';
import { downscaleImage } from '@/lib/image';
import { sendOrQueue } from '@/lib/offlineQueue';
import { BRAND } from '@/lib/brand';
import { cn } from '@/lib/cn';

type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
const MEAL_LABEL: Record<string, string> = { BREAKFAST: 'Breakfast', LUNCH: 'Lunch', DINNER: 'Dinner', SNACK: 'Snack' };

function defaultMealType(): MealType {
  const h = new Date().getHours();
  if (h < 11) return 'BREAKFAST';
  if (h < 16) return 'LUNCH';
  if (h < 21) return 'DINNER';
  return 'SNACK';
}

function statusPill(m: Meal) {
  if (m.status === 'REJECTED') return <Pill tone="rejected">Needs a redo</Pill>;
  if (m.status === 'MODIFIED') return <Pill tone="modified">Adjusted</Pill>;
  if (m.reviewed || m.status === 'APPROVED') return <Pill tone="approved">Checked</Pill>;
  return <Pill tone="pending">With coach</Pill>;
}

function Thumb({ m }: { m: Meal }) {
  if (m.imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={m.imageUrl} alt="" className="h-16 w-16 rounded-[var(--radius-md)] object-cover" />;
  }
  return (
    <span aria-hidden className="h-16 w-16 rounded-[var(--radius-md)] surface-inset flex items-center justify-center t-h3 text-brand">
      {(m.text.trim()[0] || MEAL_LABEL[m.mealType]?.[0] || '·').toUpperCase()}
    </span>
  );
}

export function FoodScreen({
  todayStart,
  meals,
  targets,
  mealPlan,
  mealPlanState,
  clientName,
}: {
  todayStart: string;
  meals: Meal[];
  targets: { kcal: number; protein: number; carbs: number; fat: number };
  mealPlan: MealPlanLike | null;
  mealPlanState: 'ready' | 'none' | 'upgrade';
  clientName: string;
}) {
  const router = useRouter();
  const [day, setDay] = useState<'today' | 'yesterday'>('today');
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Meal | null>(null);

  // Composer state
  const [mode, setMode] = useState<ComposerMode>('describe');
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<FoodItem[]>([]);
  const [query, setQuery] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const start = new Date(todayStart).getTime();
  const shown = useMemo(
    () => meals.filter((m) => {
      const t = new Date(m.createdAt).getTime();
      return day === 'today' ? t >= start : t < start;
    }),
    [meals, day, start]
  );
  const totals = shown.reduce((s, m) => ({ kcal: s.kcal + m.kcal, protein: s.protein + m.protein, carbs: s.carbs + m.carbs, fat: s.fat + m.fat }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
  const left = targets.kcal - totals.kcal;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (q ? FOOD_LIBRARY.filter((f) => f.name.toLowerCase().includes(q)) : FOOD_LIBRARY).slice(0, 8);
  }, [query]);

  const reset = () => {
    setText('');
    setPicked([]);
    setQuery('');
    setPhoto(null);
    setError('');
    setMode('describe');
    setMealType(defaultMealType());
  };

  const compose = () => {
    if (mode === 'search') {
      return picked.map((f) => `${f.name} (${f.portion}) ~${f.kcal} kcal, ${f.protein} g protein`).join('; ');
    }
    if (mode === 'photo') return text.trim() || 'Meal photo';
    return text.trim();
  };

  const submit = async () => {
    const rawInput = compose();
    if (!rawInput || (mode === 'photo' && !photo)) {
      setError(mode === 'photo' ? 'Take or choose a photo first.' : mode === 'search' ? 'Pick at least one food.' : 'Describe what you ate.');
      return;
    }
    setBusy(true);
    setError('');
    const result = await sendOrQueue('meal', '/api/nutrition/submit', {
      submissionType: mode === 'photo' ? 'PHOTO' : mode === 'search' ? 'MANUAL' : 'NATURAL_LANGUAGE',
      rawInput,
      imageUrl: mode === 'photo' ? photo : null,
      mealType,
    });
    setBusy(false);
    if (result.status === 'error') {
      setError(result.message);
      return;
    }
    setOpen(false);
    reset();
    if (result.status === 'queued') {
      toast(`${MEAL_LABEL[mealType]} saved on this phone`, 'It will sync when you are back online.');
    } else {
      toast(`${MEAL_LABEL[mealType]} logged`, `${BRAND.coachName} will check the estimate.`);
      setDay('today');
      router.refresh();
    }
  };

  const onPhoto = async (file: File) => {
    try {
      setPhoto(await downscaleImage(file));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read that photo.');
    }
  };

  const mealLabel = MEAL_LABEL[mealType].toLowerCase();

  return (
    <>
      <Tabs defaultValue="log">
        <TabsList label="Food sections">
          <Tab value="log">Log</Tab>
          <Tab value="plan">Meal plan</Tab>
        </TabsList>

        <TabPanel value="log" className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <Segmented label="Day" size="sm" value={day} onChange={setDay} options={[{ value: 'yesterday', label: 'Yesterday' }, { value: 'today', label: 'Today' }]} className="w-auto" />
            <div className="hidden md:block">
              <Button leading={<Plus size={16} />} onClick={() => setOpen(true)}>Log a meal</Button>
            </div>
          </div>

          {targets.kcal > 0 ? (
            <div className="space-y-4">
              <HeroStat
                label={day === 'today' ? (left >= 0 ? 'Calories left today' : 'Over today') : 'Calories yesterday'}
                value={day === 'today' ? Math.abs(left).toLocaleString() : totals.kcal.toLocaleString()}
                unit="kcal"
                context={`${totals.kcal.toLocaleString()} eaten of ${targets.kcal.toLocaleString()}`}
              />
              <ProgressBar value={totals.kcal} max={targets.kcal} />
            </div>
          ) : (
            <HeroStat label="Calories logged" value={totals.kcal.toLocaleString()} unit="kcal" />
          )}

          <StatRow>
            <Stat label={`of ${targets.protein} g protein`} value={totals.protein} unit="g" />
            <Stat label={`of ${targets.carbs} g carbohydrate`} value={totals.carbs} unit="g" />
            <Stat label={`of ${targets.fat} g fat`} value={totals.fat} unit="g" />
          </StatRow>

          <Section title={day === 'today' ? 'Today' : 'Yesterday'}>
            {shown.length === 0 ? (
              <EmptyState
                message={day === 'today' ? 'Nothing logged yet. Describe or photograph a meal and your coach checks the estimate.' : 'Nothing was logged yesterday.'}
              />
            ) : (
              <ListRows>
                {shown.map((m) => (
                  <ListRow
                    key={m.id}
                    onClick={() => setDetail(m)}
                    leading={<Thumb m={m} />}
                    title={m.text}
                    subtitle={`${MEAL_LABEL[m.mealType] ?? m.mealType} · ${new Date(m.createdAt).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })} · ${m.kcal} kcal`}
                    trailing={statusPill(m)}
                    chevron={false}
                  />
                ))}
              </ListRows>
            )}
          </Section>
        </TabPanel>

        <TabPanel value="plan">
          <MealPlanView plan={mealPlan} state={mealPlanState} clientName={clientName} />
        </TabPanel>
      </Tabs>

      {/* Floating action on phones, above the tab bar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Log a meal"
        className="md:hidden focus-ring fixed right-4 z-30 h-14 px-5 rounded-full bg-brand-strong text-brand-on-strong elev-overlay flex items-center gap-2 text-sm font-semibold"
        style={{ bottom: 'calc(var(--tabbar-height) + env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <Plus size={18} aria-hidden /> Log a meal
      </button>

      <Composer
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setError('');
        }}
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          setError('');
        }}
        onPhoto={onPhoto}
        photo={
          <div className="space-y-4">
            {photo && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Your meal" className="w-full max-h-64 object-cover rounded-[var(--radius-md)]" />
                <button type="button" onClick={() => setPhoto(null)} aria-label="Remove photo" className="focus-ring absolute top-2 right-2 h-9 w-9 rounded-full bg-[rgba(22,26,24,0.6)] text-white flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            )}
            <TextArea label="Anything to add" placeholder="Portion size, how it was cooked" value={text} onChange={(e) => setText(e.target.value)} className="[&_textarea]:min-h-[80px]" />
          </div>
        }
        describe={<TextArea label="What did you eat?" placeholder="2 cups of jollof rice, 1 grilled chicken breast, 4 slices of fried plantain" value={text} onChange={(e) => setText(e.target.value)} />}
        search={
          <div className="space-y-4">
            <Field label="Search foods">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Jollof, egusi, yam" inputMode="search" enterKeyHint="search" autoComplete="off" />
            </Field>
            {picked.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Picked foods">
                {picked.map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <button type="button" onClick={() => setPicked((p) => p.filter((_, j) => j !== i))} className="focus-ring inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full bg-brand-soft text-brand text-sm">
                      {f.name} <X size={14} aria-label="Remove" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <ListRows>
              {results.map((f) => (
                <ListRow key={f.name} onClick={() => setPicked((p) => [...p, f])} title={f.name} subtitle={`${f.portion} · ${f.protein} g protein`} trailing={`${f.kcal} kcal`} chevron={false} />
              ))}
            </ListRows>
          </div>
        }
        footer={
          <div className="space-y-3">
            <Segmented
              label="Meal"
              size="sm"
              value={mealType}
              onChange={setMealType}
              options={(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as MealType[]).map((t) => ({ value: t, label: MEAL_LABEL[t] }))}
              className="w-full md:w-full"
            />
            {error && <p className="t-caption text-status-rejected" role="alert">{error}</p>}
            <Button full size="lg" loading={busy} onClick={submit}>
              Log {mealLabel}
            </Button>
          </div>
        }
      />

      <Sheet open={Boolean(detail)} onOpenChange={(o) => !o && setDetail(null)} title={detail ? MEAL_LABEL[detail.mealType] ?? 'Meal' : ''} description={detail ? new Date(detail.createdAt).toLocaleString('en-GB', { weekday: 'long', hour: 'numeric', minute: '2-digit' }) : undefined}>
        {detail && (
          <div className="space-y-5">
            {detail.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={detail.imageUrl} alt="Meal photo" className="w-full max-h-72 object-cover rounded-[var(--radius-md)]" />
            )}
            <p className="t-body">{detail.text}</p>
            <StatRow>
              <Stat label="kcal" value={detail.kcal} />
              <Stat label="protein" value={detail.protein} unit="g" />
              <Stat label="carbohydrate" value={detail.carbs} unit="g" />
              <Stat label="fat" value={detail.fat} unit="g" />
            </StatRow>
            <div className="flex items-center gap-2">{statusPill(detail)}<span className="t-caption">{detail.reviewed ? `Checked by ${BRAND.coachName}` : 'Estimate, waiting for your coach'}</span></div>
            {detail.coachFeedback && (
              <figure className={cn('surface-inset px-4 py-3')}>
                <blockquote className="t-body-sm text-ink">{detail.coachFeedback}</blockquote>
                <figcaption className="t-caption mt-1">{BRAND.coachName}</figcaption>
              </figure>
            )}
          </div>
        )}
      </Sheet>
    </>
  );
}
