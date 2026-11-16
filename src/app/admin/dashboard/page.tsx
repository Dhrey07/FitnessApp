import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Section } from '@/components/ui/Section';
import { Stat, StatRow } from '@/components/ui/Stat';
import { whatsappLink } from '@/lib/whatsapp';
import { BRAND } from '@/lib/brand';
import { daysSince, getBusinessStats, getClientsOverview, getPendingCheckIns, getPendingMeals, relDay, requireCoach } from '@/lib/coach/data';

export const metadata: Metadata = { title: 'Today' };
export const dynamic = 'force-dynamic';

function delta(now: number, prev: number | null, unit: string) {
  if (prev == null) return null;
  const d = Math.round((now - prev) * 10) / 10;
  if (d === 0) return `no change`;
  return `${d > 0 ? 'up' : 'down'} ${Math.abs(d)} ${unit}`;
}

/** Signature moment: the queue is the page. */
export default async function CoachTodayPage() {
  await requireCoach();
  const [checkIns, meals, clients, stats] = await Promise.all([getPendingCheckIns(), getPendingMeals(), getClientsOverview(), getBusinessStats()]);
  const quiet = clients.filter((c) => daysSince(c.lastActive ?? c.joined) >= 3).sort((a, b) => daysSince(b.lastActive) - daysSince(a.lastActive));
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const nothing = checkIns.length + meals.length + quiet.length === 0;

  return (
    <AdminAppShell meta={today} title="Today" subtitle={nothing ? 'Nothing waiting. Every check-in and meal is reviewed.' : `${checkIns.length + meals.length} to review, ${quiet.length} to nudge.`}>
      {nothing && <EmptyState message="The queue is clear. New check-ins and meals will appear here as clients send them." />}

      {checkIns.length > 0 && (
        <Section title={`Check-ins to review (${checkIns.length})`} first action={<Button href="/admin/check-ins" size="sm" variant="ghost">All check-ins</Button>}>
          <ListRows>
            {checkIns.map((c) => {
              const name = `${c.user.firstName} ${c.user.lastName}`;
              const w = delta(c.currentWeightKg, c.prevWeightKg, 'kg');
              return (
                <ListRow
                  key={c.id}
                  href={`/admin/check-ins?id=${c.id}`}
                  leading={<Avatar name={name} size="sm" />}
                  title={name}
                  subtitle={`${c.currentWeightKg} kg${w ? ` · ${w}` : ''} · waist ${c.waistCm} cm · meals on plan ${c.nutritionAdherence}% · ${relDay(c.checkInDate)}`}
                  trailing={<span className="text-brand text-sm font-medium">Review</span>}
                />
              );
            })}
          </ListRows>
        </Section>
      )}

      {meals.length > 0 && (
        <Section title={`Meals to check (${meals.length})`} first={checkIns.length === 0} action={<Button href="/admin/nutrition-review" size="sm" variant="ghost">All meals</Button>}>
          <ListRows>
            {meals.slice(0, 6).map((m) => {
              const name = `${m.user.firstName} ${m.user.lastName}`;
              return (
                <ListRow
                  key={m.id}
                  href={`/admin/nutrition-review?id=${m.id}`}
                  leading={
                    m.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.imageUrl} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" />
                    ) : (
                      <Avatar name={name} size="sm" />
                    )
                  }
                  title={`${m.user.firstName} · ${m.rawInput}`}
                  subtitle={`${m.mealType.charAt(0)}${m.mealType.slice(1).toLowerCase()} · estimate ${Math.round(m.foodAnalysis?.estimatedCalories ?? 0)} kcal · ${relDay(m.createdAt)}`}
                  trailing={<span className="text-brand text-sm font-medium">Open</span>}
                />
              );
            })}
          </ListRows>
          {meals.length > 6 && <p className="t-caption">and {meals.length - 6} more</p>}
        </Section>
      )}

      {quiet.length > 0 && (
        <Section title={`Quiet for three days or more (${quiet.length})`} first={checkIns.length + meals.length === 0}>
          <ListRows>
            {quiet.map((c) => {
              const wa = whatsappLink(c.phone, `Hello ${c.firstName}, ${BRAND.coachName} here. Checking in: how is this week going?`);
              return (
                <ListRow
                  key={c.id}
                  leading={<Avatar name={c.name} size="sm" />}
                  title={c.name}
                  subtitle={`${c.plan} · last activity ${relDay(c.lastActive)}`}
                  trailing={
                    <span className="flex items-center gap-4">
                      {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-brand text-sm font-medium hover:underline">Message</a>}
                      <Link href={`/admin/clients/${c.id}`} className="text-ink-secondary text-sm hover:text-ink">Open</Link>
                    </span>
                  }
                />
              );
            })}
          </ListRows>
        </Section>
      )}

      <Section>
        <StatRow>
          <Stat label="clients" value={stats.clients} />
          <Stat label="paying" value={stats.paid} />
          <Stat label="on trial" value={stats.trial} />
          <Stat label="this month" value={`₦${stats.mrr.toLocaleString()}`} />
        </StatRow>
      </Section>
    </AdminAppShell>
  );
}
