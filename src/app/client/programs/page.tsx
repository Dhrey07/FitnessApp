import type { Metadata } from 'next';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { requireClient, shellUserOf } from '@/lib/client/data';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = { title: 'Plans' };
export const dynamic = 'force-dynamic';

const PROGRAMMES = [
  { id: 'recomp-12', title: '12-week lean recomposition', meta: '12 weeks · 4 days · intermediate', equipment: 'Dumbbells, barbell, cables', note: 'Upper and lower split with RPE-based progression and weekly calorie adjustments.', included: false },
  { id: 'conditioning-8', title: '8-week conditioning', meta: '8 weeks · 5 days · advanced', equipment: 'Dumbbells and bands', note: 'Supersets and intervals for fitness and a higher weekly energy burn. Home or gym.', included: false },
  { id: 'foundation-4', title: '4-week bodyweight foundation', meta: '4 weeks · 3 days · new to training', equipment: 'No equipment', note: 'Squats, push-ups, hinges and planks with joint-friendly tempo work.', included: true },
];

/** The programme library. Your own programme lives under Train. */
export default async function PlansPage() {
  const me = await requireClient();
  return (
    <ClientAppShell user={shellUserOf(me)} title="Plans" subtitle={`Programmes ${BRAND.coachName} builds from. Your own programme, adjusted for you, is under Train.`}>
      <Section first>
        <ListRows className="hairline">
          {PROGRAMMES.map((p) => (
            <ListRow
              key={p.id}
              href="/client/training"
              title={p.title}
              subtitle={`${p.meta} · ${p.equipment}`}
              trailing={p.included ? <Pill tone="approved">Included</Pill> : <Pill>Signature</Pill>}
            />
          ))}
        </ListRows>
      </Section>
      <Section title="What each one is for">
        <dl className="space-y-5">
          {PROGRAMMES.map((p) => (
            <div key={p.id}>
              <dt className="t-ui">{p.title}</dt>
              <dd className="t-body-sm mt-1 max-w-[60ch]">{p.note}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </ClientAppShell>
  );
}
