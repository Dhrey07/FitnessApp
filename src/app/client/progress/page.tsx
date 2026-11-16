import type { Metadata } from 'next';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { Stat, StatRow } from '@/components/ui/Stat';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ProgressReportsList, type ClientReport } from '@/components/reports/ProgressReportsList';
import { prisma } from '@/lib/db';
import { entitlementsOf, getCheckIns, programmeWeek, requireClient, shellUserOf } from '@/lib/client/data';
import { WeightTrend, type TrendPoint } from './WeightTrend';

export const metadata: Metadata = { title: 'Progress' };
export const dynamic = 'force-dynamic';

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);

export default async function ProgressPage() {
  const me = await requireClient();
  const access = entitlementsOf(me);
  const [checkIns, reports] = await Promise.all([
    getCheckIns(me.id, 24),
    access.reports
      ? prisma.progressReport.findMany({ where: { userId: me.id, publishedAt: { not: null } }, orderBy: { periodEnd: 'desc' } })
      : Promise.resolve([]),
  ]);

  const profile = me.profile;
  const { start } = programmeWeek(me);

  // Trend: starting weight at programme start, then every check-in.
  const points: TrendPoint[] = [...checkIns].reverse().map((c) => ({ date: c.checkInDate.toISOString(), weightKg: c.currentWeightKg }));
  if (profile?.startingWeightKg && (!points.length || new Date(points[0].date) > start)) {
    points.unshift({ date: start.toISOString(), weightKg: profile.startingWeightKg });
  }

  const latest = checkIns[0];
  const first = checkIns[checkIns.length - 1];
  const recent = checkIns.slice(0, 4);
  const consistency = avg(recent.filter((c) => c.trainingSessionsPlanned).map((c) => ((c.trainingSessionsCompleted ?? 0) / (c.trainingSessionsPlanned || 1)) * 100));
  const nutrition = avg(recent.map((c) => c.nutritionAdherence));
  const waistChange = latest && first && latest.id !== first.id ? Math.round((latest.waistCm - first.waistCm) * 10) / 10 : null;

  const clientReports: ClientReport[] = reports.map((r) => ({
    id: r.id,
    periodStart: r.periodStart.toISOString(),
    periodEnd: r.periodEnd.toISOString(),
    startingWeightKg: r.startingWeightKg,
    currentWeightKg: r.currentWeightKg,
    waistCm: r.waistCm,
    trainingConsistency: r.trainingConsistency,
    nutritionAdherence: r.nutritionAdherence,
    coachAssessment: r.coachAssessment,
    nextAdjustments: r.nextAdjustments,
  }));

  return (
    <ClientAppShell user={shellUserOf(me)} title="Progress">
      <WeightTrend points={points} target={profile?.targetWeightKg ?? null} />

      {latest ? (
        <StatRow>
          <Stat label={waistChange ? `waist, ${waistChange > 0 ? 'up' : 'down'} ${Math.abs(waistChange)}` : 'waist'} value={latest.waistCm} unit="cm" series={[...checkIns].reverse().map((c) => c.waistCm)} />
          <Stat label="average daily steps" value={latest.averageDailySteps ? latest.averageDailySteps.toLocaleString() : '–'} />
          <Stat label="training, last 4 weeks" value={Number.isFinite(consistency) ? Math.round(consistency) : '–'} unit={Number.isFinite(consistency) ? '%' : undefined} />
          <Stat label="meals on plan" value={Number.isFinite(nutrition) ? Math.round(nutrition) : '–'} unit={Number.isFinite(nutrition) ? '%' : undefined} />
        </StatRow>
      ) : (
        <EmptyState message="Waist, steps and consistency appear after your first weekly check-in." action={<Button href="/client/check-in" size="sm" variant="secondary">Open check-in</Button>} />
      )}

      {checkIns.length > 0 && (
        <Section title="Check-ins">
          <ListRows>
            {checkIns.slice(0, 8).map((c) => (
              <ListRow
                key={c.id}
                title={c.checkInDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                subtitle={`${c.currentWeightKg} kg · waist ${c.waistCm} cm${c.coachFeedback ? ` · “${c.coachFeedback}”` : ''}`}
                trailing={c.status === 'REVIEWED' ? <Pill tone="approved">Reviewed</Pill> : <Pill tone="pending">With coach</Pill>}
              />
            ))}
          </ListRows>
        </Section>
      )}

      <Section title="Reports">
        <ProgressReportsList reports={clientReports} entitled={access.reports} clientName={`${me.firstName} ${me.lastName}`} />
      </Section>
    </ClientAppShell>
  );
}
