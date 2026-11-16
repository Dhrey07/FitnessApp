'use client';

import * as React from 'react';
import { Home, Utensils, Activity, TrendingUp, Calendar, BookOpen, Settings, Bell, Download, Trash2 } from 'lucide-react';
import {
  AppShell,
  LargeTitle,
  Section,
  Panel,
  Button,
  IconButton,
  ListRow,
  ListRows,
  Pill,
  Avatar,
  HeroStat,
  Stat,
  StatRow,
  Sparkline,
  Skeleton,
  SkeletonRow,
  EmptyState,
  Field,
  TextArea,
  Segmented,
  Scale,
  Slider,
  Stepper,
  Sheet,
  toast,
  Banner,
  Quote,
  Document,
  DocumentRow,
  Table,
  LineChart,
  BarsChart,
  ProgressBar,
  Tabs,
  TabsList,
  Tab,
  TabPanel,
  Menu,
  RestTimer,
  Composer,
  type ComposerMode,
  type NavItem,
} from '@/components/ui';

const NAV: NavItem[] = [
  { href: '/dev/ui', label: 'Today', icon: Home, exact: true },
  { href: '/dev/ui#food', label: 'Food', icon: Utensils },
  { href: '/dev/ui#train', label: 'Train', icon: Activity },
  { href: '/dev/ui#progress', label: 'Progress', icon: TrendingUp },
  { href: '/dev/ui#checkin', label: 'Weekly check-in', icon: Calendar },
  { href: '/dev/ui#guides', label: 'Guides', icon: BookOpen },
  { href: '/dev/ui#settings', label: 'Profile and billing', icon: Settings },
];

const WEIGHTS = [87.2, 86.9, 86.4, 86.1, 85.8, 85.6, 85.3, 85.0];
const SERIES = WEIGHTS.map((v, i) => ({ label: `W${i + 1}`, value: v }));
const STEPS = [7200, 8100, 9400, 6800, 8900, 10200, 8400].map((v, i) => ({ label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], value: v }));

type Client = { id: string; name: string; plan: string; last: string; trend: number[] };
const CLIENTS: Client[] = [
  { id: '1', name: 'Chidi Okonkwo', plan: 'Signature', last: 'Sunday', trend: WEIGHTS },
  { id: '2', name: 'Aminat Bello', plan: 'Private Coaching', last: 'Sunday', trend: [62, 62.2, 62.1, 62.4, 62.3, 62.6] },
  { id: '3', name: 'Tunde Johnson', plan: 'Essential', last: '9 days ago', trend: [96, 96, 95.5, 95.8] },
];

export function UiDemo() {
  const [seg, setSeg] = React.useState<'log' | 'plan'>('log');
  const [energy, setEnergy] = React.useState<number | null>(4);
  const [adherence, setAdherence] = React.useState(85);
  const [kg, setKg] = React.useState(42.5);
  const [reps, setReps] = React.useState(9);
  const [sheet, setSheet] = React.useState(false);
  const [rest, setRest] = React.useState(false);
  const [composer, setComposer] = React.useState(false);
  const [mode, setMode] = React.useState<ComposerMode>('describe');

  return (
    <AppShell nav={NAV} homeHref="/dev/ui" user={{ name: 'Chidi Okonkwo', detail: 'Signature' }} onSignOut={() => toast('Signed out (demo)')} rail={<RailDemo />}>
      <LargeTitle meta="Sunday 16 November" title="Component gallery" description="Every primitive in src/components/ui, in light and dark." action={<IconButton label="Notifications"><Bell size={20} /></IconButton>} />

      <Section title="Hero stat and stat row" first>
        <HeroStat label="Current weight" value="85.0" unit="kg" delta={-0.6} context="since last Sunday" series={WEIGHTS} />
        <StatRow>
          <Stat label="Waist" value={88} unit="cm" series={[92, 91, 90, 89, 88]} />
          <Stat label="Average steps" value={8420} series={STEPS.map((s) => s.value)} />
          <Stat label="Sessions" value="4/4" />
          <Stat label="Adherence" value={85} unit="%" />
        </StatRow>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3 items-center">
          <Button>Save check-in</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="destructive" leading={<Trash2 size={16} />}>Delete</Button>
          <Button loading>Saving</Button>
          <Button size="sm" variant="secondary" leading={<Download size={14} />}>PDF</Button>
          <Button size="lg">Start session</Button>
          <IconButton label="More"><Bell size={20} /></IconButton>
          <Menu items={[{ label: 'Download PDF', icon: <Download size={16} /> }, { label: 'Delete', destructive: true, icon: <Trash2 size={16} /> }]} />
        </div>
      </Section>

      <Section title="List rows" action={<Button size="sm" variant="ghost">See all</Button>}>
        <ListRows>
          <ListRow leading={<Avatar name="Upper body push" />} title="Upper body push" subtitle="4 exercises · 45 min" href="#" trailing={<Pill tone="brand">Today</Pill>} />
          <ListRow leading={<Avatar name="Jollof rice" />} title="Jollof rice, grilled chicken" subtitle="Lunch · 1:10 pm" trailing="640 kcal" onClick={() => toast('Opened meal')} />
          <ListRow title="Check-in due Sunday" subtitle="Takes about five minutes" trailing={<Pill tone="pending">Due</Pill>} href="#" />
          <ListRow title="Plain row" subtitle="No interaction" trailing="12" />
        </ListRows>
      </Section>

      <Section title="Pills and avatars">
        <div className="flex flex-wrap gap-2 items-center">
          <Pill>Neutral</Pill>
          <Pill tone="brand">Brand</Pill>
          <Pill tone="pending">With coach</Pill>
          <Pill tone="approved">Approved</Pill>
          <Pill tone="modified">Adjusted</Pill>
          <Pill tone="rejected">Rejected</Pill>
          <Avatar name="Chidi Okonkwo" size="sm" />
          <Avatar name="Aminat Bello" />
          <Avatar name="Coach Eric" size="lg" />
        </div>
      </Section>

      <Section title="Panels">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel>
            <p className="t-ui">White panel</p>
            <p className="t-body-sm mt-1">The only card. No border.</p>
          </Panel>
          <Panel tone="inset">
            <p className="t-ui">Inset panel</p>
            <p className="t-body-sm mt-1">Grouped fields and notes.</p>
          </Panel>
          <Panel tone="ink" texture>
            <p className="t-caption text-[#8FCDB0]">Ink panel</p>
            <p className="t-stat mt-2">Week 4 of 12</p>
          </Panel>
        </div>
        <Panel raised>
          <p className="t-ui">Raised panel</p>
          <p className="t-body-sm mt-1">Elevation without a border. Used when floating.</p>
        </Panel>
      </Section>

      <Section title="Banner and quote">
        <Banner title="Trial" action={<Button size="sm">Choose a plan</Button>}>Day 5 of 14. Your training programme stays open until Sunday.</Banner>
        <Quote by="Coach Eric" when="2 days ago">Great pacing on your push session. Keep the plantain to four slices at lunch and we hold calories this week.</Quote>
      </Section>

      <Section title="Form controls" id="checkin">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Current weight" unit="kg" help="Same day, same conditions.">
            <input defaultValue="85.0" inputMode="decimal" autoComplete="off" enterKeyHint="next" />
          </Field>
          <Field label="Waist" unit="cm" error="Enter a number between 50 and 200.">
            <input defaultValue="abc" inputMode="decimal" />
          </Field>
          <Field label="Average daily steps">
            <input defaultValue="8400" inputMode="numeric" />
          </Field>
          <TextArea label="Wins this week" placeholder="Anything that went well" />
        </div>
        <Segmented label="View" value={seg} onChange={setSeg} options={[{ value: 'log', label: 'Log' }, { value: 'plan', label: 'Meal plan' }]} />
        <Scale label="Energy" value={energy} onChange={setEnergy} />
        <Slider label="Nutrition adherence" value={adherence} onChange={setAdherence} help="Roughly how many meals matched the plan." />
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Stepper label="Weight" value={kg} onChange={setKg} step={2.5} unit="kg" precision={1} />
          <Stepper label="Reps" value={reps} onChange={setReps} />
        </div>
      </Section>

      <Section title="Sheets, toasts, timer, composer">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setSheet(true)}>Open sheet</Button>
          <Button variant="secondary" onClick={() => toast('Check-in saved', 'Coach Eric reviews on Sunday.')}>Toast</Button>
          <Button variant="secondary" onClick={() => toast.undo('Meal deleted', () => toast('Restored'))}>Undo toast</Button>
          <Button variant="secondary" onClick={() => setRest(true)}>Rest timer</Button>
          <Button onClick={() => setComposer(true)}>Log a meal</Button>
        </div>
      </Section>

      <Section title="Progress and charts" id="progress">
        <ProgressBar label="Calories today" value={1720} max={2288} unit="kcal" />
        <LineChart data={SERIES} unit="kg" target={78} />
        <BarsChart data={STEPS} unit="steps" target={8000} />
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="overview">
          <TabsList label="Client sections">
            <Tab value="overview">Overview</Tab>
            <Tab value="checkins">Check-ins</Tab>
            <Tab value="food">Food</Tab>
            <Tab value="programme">Programme</Tab>
          </TabsList>
          <TabPanel value="overview"><p className="t-body-sm">Overview content.</p></TabPanel>
          <TabPanel value="checkins"><p className="t-body-sm">Check-in history.</p></TabPanel>
          <TabPanel value="food"><p className="t-body-sm">Meals.</p></TabPanel>
          <TabPanel value="programme"><p className="t-body-sm">Programme.</p></TabPanel>
        </Tabs>
      </Section>

      <Section title="Table (rows below 768px)">
        <Table<Client>
          columns={[
            { key: 'name', header: 'Client', cell: (r) => <span className="flex items-center gap-3"><Avatar name={r.name} size="sm" />{r.name}</span> },
            { key: 'plan', header: 'Plan', cell: (r) => r.plan },
            { key: 'last', header: 'Last check-in', cell: (r) => r.last },
            { key: 'trend', header: 'Trend', cell: (r) => <Sparkline data={r.trend} width={64} height={20} />, align: 'right' },
          ]}
          rows={CLIENTS}
          rowKey={(r) => r.id}
          mobile={(r) => ({ leading: <Avatar name={r.name} size="sm" />, title: r.name, subtitle: `${r.plan} · last check-in ${r.last}`, href: '#' })}
        />
      </Section>

      <Section title="Document">
        <Document title="Meal plan · Day 3 of 7" subtitle="Fat loss, moderate deficit" meta={<>Chidi Okonkwo<br />16 Nov 2026</>} footer={<span>Page 1 of 3</span>}>
          <DocumentRow label="Meal 1" value="520 kcal">Oats 60 g, 2 whole eggs, 1 banana</DocumentRow>
          <DocumentRow label="Snack" value="260 kcal">Greek yoghurt 170 g, groundnuts 20 g</DocumentRow>
          <DocumentRow label="Meal 2" value="640 kcal">Jollof rice 180 g cooked, grilled chicken 150 g, salad</DocumentRow>
          <DocumentRow label="Meal 3" value="600 kcal">Boiled yam 200 g, efo riro 1 bowl, fish 120 g</DocumentRow>
          <DocumentRow value="2,020 kcal"><span className="font-semibold">Daily total</span></DocumentRow>
        </Document>
      </Section>

      <Section title="Empty and loading">
        <EmptyState message="Your coach reviews check-ins on Sundays. Your first report will appear here after that." action={<Button variant="secondary" size="sm">Open check-in</Button>} />
        <div>
          <SkeletonRow />
          <SkeletonRow />
          <Skeleton className="h-40 w-full mt-3" />
        </div>
      </Section>

      <Sheet open={sheet} onOpenChange={setSheet} title="Edit targets" description="Changes apply from next week." footer={<Button full onClick={() => { setSheet(false); toast('Targets saved'); }}>Save targets</Button>}>
        <div className="space-y-4">
          <Field label="Daily calories" unit="kcal"><input defaultValue="2288" inputMode="numeric" /></Field>
          <Field label="Protein" unit="g"><input defaultValue="187" inputMode="numeric" /></Field>
        </div>
      </Sheet>

      {rest && <RestTimer seconds={90} running onDone={() => { setRest(false); toast('Rest over'); }} onSkip={() => setRest(false)} onExtend={() => undefined} />}

      <Composer
        open={composer}
        onOpenChange={setComposer}
        mode={mode}
        onModeChange={setMode}
        onPhoto={(f) => toast('Photo attached', f.name)}
        describe={<TextArea label="Describe your meal" placeholder="e.g. 2 cups of jollof rice, 1 grilled chicken breast" />}
        search={<Field label="Search foods"><input placeholder="Jollof rice" inputMode="search" enterKeyHint="search" /></Field>}
        footer={<Button full onClick={() => { setComposer(false); toast('Lunch logged', 'With coach for review.'); }}>Log lunch</Button>}
      />
    </AppShell>
  );
}

function RailDemo() {
  return (
    <>
      <Quote by="Coach Eric" when="2 days ago">Great pacing on your push session.</Quote>
      <ListRows>
        <ListRow title="Check-in due" subtitle="Sunday" trailing={<Pill tone="pending">Due</Pill>} href="#" />
      </ListRows>
    </>
  );
}
