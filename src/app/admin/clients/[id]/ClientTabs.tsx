'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import {
  Button,
  EmptyState,
  Field,
  LineChart,
  ListRow,
  ListRows,
  Menu,
  Panel,
  Pill,
  Section,
  SelectField,
  Stat,
  StatRow,
  Tab,
  TabPanel,
  Tabs,
  TabsList,
  toast,
} from '@/components/ui';

export interface ClientFile {
  id: string;
  firstName: string;
  profile: {
    bmr: number;
    tdee: number;
    dailyCalories: number;
    targetProteinG: number;
    targetCarbsG: number;
    targetFatG: number;
    weightKg: number;
    startingWeightKg: number | null;
    targetWeightKg: number | null;
    programmeDurationWeeks: number | null;
    programmeStartDate: string | null;
    facts: string[][];
  } | null;
  checkIns: { id: string; date: string; weightKg: number; waistCm: number; nutrition: number; sessions: string | null; status: string; feedback: string | null }[];
  meals: { id: string; text: string; mealType: string; date: string; kcal: number; status: string; imageUrl: string | null }[];
  programme: { id: string; title: string; weeks: number; days: { id: string; dayName: string; title: string; exercises: string[] }[] } | null;
  mealPlan: { id: string; title: string; kcal: number; protein: number; days: number; items: number } | null;
  reports: { id: string; start: string; end: string; published: boolean; weight: number }[];
}

const short = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

function mealPill(status: string) {
  if (status === 'APPROVED') return <Pill tone="approved">Checked</Pill>;
  if (status === 'MODIFIED') return <Pill tone="modified">Adjusted</Pill>;
  if (status === 'REJECTED') return <Pill tone="rejected">Rejected</Pill>;
  return <Pill tone="pending">To check</Pill>;
}

function TargetsEditor({ file }: { file: ClientFile }) {
  const router = useRouter();
  const p = file.profile!;
  const [v, setV] = useState({
    startingWeightKg: String(p.startingWeightKg ?? p.weightKg ?? ''),
    targetWeightKg: p.targetWeightKg != null ? String(p.targetWeightKg) : '',
    programmeDurationWeeks: String(p.programmeDurationWeeks ?? 12),
    programmeStartDate: p.programmeStartDate ? p.programmeStartDate.slice(0, 10) : '',
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/clients/${file.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      toast('Programme targets saved');
      router.refresh();
    } catch (e) {
      toast.error('Not saved', e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel tone="inset" className="space-y-4">
      <div>
        <p className="t-ui">Programme targets</p>
        <p className="t-caption mt-0.5">These appear on the meal plan cover and in progress reports.</p>
      </div>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Field label="Starting weight" unit="kg">
          <input value={v.startingWeightKg} onChange={(e) => setV({ ...v, startingWeightKg: e.target.value })} inputMode="decimal" />
        </Field>
        <Field label="Target weight" unit="kg">
          <input value={v.targetWeightKg} onChange={(e) => setV({ ...v, targetWeightKg: e.target.value })} inputMode="decimal" />
        </Field>
        <SelectField label="Length" value={v.programmeDurationWeeks} onChange={(e) => setV({ ...v, programmeDurationWeeks: e.target.value })}>
          {[8, 12, 16, 24].map((n) => <option key={n} value={n}>{n} weeks</option>)}
        </SelectField>
        <Field label="Start date">
          <input type="date" value={v.programmeStartDate} onChange={(e) => setV({ ...v, programmeStartDate: e.target.value })} />
        </Field>
      </div>
      <Button size="sm" loading={busy} onClick={save}>Save targets</Button>
    </Panel>
  );
}

export function ClientTabs({ file }: { file: ClientFile }) {
  const p = file.profile;
  const trend = [...file.checkIns].reverse().map((c) => ({ label: short(c.date), value: c.weightKg }));

  return (
    <Tabs defaultValue="overview">
      <TabsList label="Client sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="checkins">Check-ins</Tab>
        <Tab value="food">Food</Tab>
        <Tab value="programme">Programme</Tab>
        <Tab value="mealplan">Meal plan</Tab>
        <Tab value="reports">Reports</Tab>
      </TabsList>

      <TabPanel value="overview" className="space-y-8">
        {trend.length > 1 ? (
          <section className="space-y-3">
            <h2 className="t-h3">Weight</h2>
            <LineChart data={trend} unit="kg" target={p?.targetWeightKg ?? undefined} height={220} />
          </section>
        ) : (
          <EmptyState message={`${file.firstName}'s weight trend appears after two check-ins.`} className="py-8" />
        )}
        {p && (
          <>
            <StatRow>
              <Stat label="daily target" value={Math.round(p.dailyCalories)} unit="kcal" />
              <Stat label="protein" value={Math.round(p.targetProteinG)} unit="g" />
              <Stat label="maintenance" value={Math.round(p.tdee)} unit="kcal" />
              <Stat label="resting (BMR)" value={Math.round(p.bmr)} unit="kcal" />
            </StatRow>
            <TargetsEditor file={file} />
            <Section title="From the assessment">
              <ListRows>
                {p.facts.map(([k, v]) => <ListRow key={k} title={k} trailing={<span className="text-right max-w-[60%] truncate">{v}</span>} />)}
              </ListRows>
            </Section>
          </>
        )}
      </TabPanel>

      <TabPanel value="checkins">
        {file.checkIns.length === 0 ? (
          <EmptyState message={`${file.firstName} has not sent a check-in yet.`} />
        ) : (
          <ListRows>
            {file.checkIns.map((c) => (
              <ListRow
                key={c.id}
                href={`/admin/check-ins?id=${c.id}`}
                title={`${short(c.date)} · ${c.weightKg} kg · waist ${c.waistCm} cm`}
                subtitle={[c.sessions && `sessions ${c.sessions}`, `meals on plan ${c.nutrition}%`, c.feedback && `“${c.feedback}”`].filter(Boolean).join(' · ')}
                trailing={c.status === 'REVIEWED' ? <Pill tone="approved">Reviewed</Pill> : <Pill tone="pending">To review</Pill>}
              />
            ))}
          </ListRows>
        )}
      </TabPanel>

      <TabPanel value="food">
        {file.meals.length === 0 ? (
          <EmptyState message={`${file.firstName} has not logged a meal yet.`} />
        ) : (
          <ListRows>
            {file.meals.map((m) => (
              <ListRow
                key={m.id}
                href={`/admin/nutrition-review?id=${m.id}`}
                leading={
                  m.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.imageUrl} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" />
                  ) : undefined
                }
                title={m.text}
                subtitle={`${m.mealType.charAt(0)}${m.mealType.slice(1).toLowerCase()} · ${short(m.date)} · ${m.kcal} kcal`}
                trailing={mealPill(m.status)}
              />
            ))}
          </ListRows>
        )}
      </TabPanel>

      <TabPanel value="programme" className="space-y-6">
        {file.programme ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-h3">{file.programme.title}</p>
                <p className="t-body-sm mt-1">{file.programme.weeks} weeks · {file.programme.days.length} sessions a week</p>
              </div>
              <Menu items={[{ label: 'Download PDF', icon: <Download size={16} />, href: `/print/workout-programme/${file.programme.id}?autoprint=1` }]} label="Programme options" />
            </div>
            <ListRows className="hairline">
              {file.programme.days.map((d) => (
                <ListRow key={d.id} title={`${d.dayName} · ${d.title}`} subtitle={d.exercises.join(' · ')} />
              ))}
            </ListRows>
            <Button href={`/admin/training?client=${file.id}`} variant="secondary">Edit in the programme builder</Button>
          </>
        ) : (
          <EmptyState message={`${file.firstName} has no programme yet.`} action={<Button href={`/admin/training?client=${file.id}`} size="sm">Build a programme</Button>} />
        )}
      </TabPanel>

      <TabPanel value="mealplan" className="space-y-6">
        {file.mealPlan ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-h3">{file.mealPlan.title}</p>
                <p className="t-body-sm mt-1 tnum">{file.mealPlan.days} days · {file.mealPlan.kcal.toLocaleString()} kcal · {file.mealPlan.protein} g protein · {file.mealPlan.items} items</p>
              </div>
              <Menu items={[{ label: 'Download PDF', icon: <Download size={16} />, href: `/print/meal-plan/${file.mealPlan.id}?autoprint=1` }]} label="Meal plan options" />
            </div>
            <Button href={`/admin/clients/${file.id}/meal-plan`} variant="secondary">Open the meal plan builder</Button>
          </>
        ) : (
          <EmptyState message={`${file.firstName} has no meal plan yet.`} action={<Button href={`/admin/clients/${file.id}/meal-plan`} size="sm">Build a meal plan</Button>} />
        )}
      </TabPanel>

      <TabPanel value="reports" className="space-y-6">
        {file.reports.length === 0 ? (
          <EmptyState message="No progress reports yet." action={<Button href={`/admin/clients/${file.id}/reports/new`} size="sm">Create the first report</Button>} />
        ) : (
          <>
            <ListRows>
              {file.reports.map((r) => (
                <ListRow
                  key={r.id}
                  href={`/admin/clients/${file.id}/reports/${r.id}`}
                  title={`${short(r.start)} to ${short(r.end)}`}
                  subtitle={`${r.weight} kg at the end of the period`}
                  trailing={r.published ? <Pill tone="approved">Published</Pill> : <Pill tone="pending">Draft</Pill>}
                />
              ))}
            </ListRows>
            <Button href={`/admin/clients/${file.id}/reports/new`} variant="secondary">New report</Button>
          </>
        )}
      </TabPanel>
    </Tabs>
  );
}
