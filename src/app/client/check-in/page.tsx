import type { Metadata } from 'next';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { Button, EmptyState } from '@/components/ui';
import { checkInWindow, entitlementsOf, getCheckIns, requireClient, shellUserOf } from '@/lib/client/data';
import { CheckInFlow, type PastCheckIn } from './CheckInFlow';

export const metadata: Metadata = { title: 'Weekly check-in' };
export const dynamic = 'force-dynamic';

export default async function CheckInPage() {
  const me = await requireClient();
  const access = entitlementsOf(me);
  const checkIns = await getCheckIns(me.id, 8);
  const window = checkInWindow(checkIns[0]);

  const past: PastCheckIn[] = checkIns.map((c) => ({
    id: c.id,
    date: c.checkInDate.toISOString(),
    weightKg: c.currentWeightKg,
    waistCm: c.waistCm,
    steps: c.averageDailySteps,
    status: c.status,
  }));

  return (
    <ClientAppShell
      user={shellUserOf(me)}
      title="Weekly check-in"
      subtitle={window.submitted ? 'This week is in. You can send another if something changed.' : `Due ${window.label}. About five minutes.`}
    >
      {access.checkIn ? (
        <CheckInFlow
          userId={me.id}
          past={past}
          defaults={{
            weightKg: checkIns[0]?.currentWeightKg ?? me.profile?.weightKg ?? null,
            waistCm: checkIns[0]?.waistCm ?? me.profile?.waistCm ?? null,
            steps: me.profile?.averageDailySteps ?? null,
            sessionsPlanned: me.profile?.preferredWorkoutDays ?? 4,
          }}
        />
      ) : (
        <EmptyState
          message="Weekly check-ins reviewed by your coach start on the Essential plan. Your nutrition log and progress history stay free."
          action={<Button href="/client/profile#membership" size="sm">See plans</Button>}
        />
      )}
    </ClientAppShell>
  );
}
