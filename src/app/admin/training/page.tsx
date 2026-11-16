import type { Metadata } from 'next';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { prisma } from '@/lib/db';
import { planLabelFor, requireCoach } from '@/lib/coach/data';
import { ProgrammeBuilder, type BuilderClient, type SavedPlan } from './ProgrammeBuilder';

export const metadata: Metadata = { title: 'Programmes' };
export const dynamic = 'force-dynamic';

export default async function ProgrammesPage({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  await requireCoach();
  const { client } = await searchParams;
  const [users, plans] = await Promise.all([
    prisma.user.findMany({ where: { role: 'CLIENT' }, orderBy: { firstName: 'asc' }, include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } } }),
    prisma.workoutPlan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { user: { select: { id: true, firstName: true, lastName: true } }, workouts: { orderBy: { orderIndex: 'asc' }, include: { exercises: { orderBy: { orderIndex: 'asc' } } } } },
    }),
  ]);

  const clients: BuilderClient[] = users.map((u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, firstName: u.firstName, plan: planLabelFor(u.subscriptions[0]) }));
  const saved: SavedPlan[] = plans.map((p) => ({
    id: p.id,
    userId: p.userId,
    clientName: `${p.user.firstName} ${p.user.lastName}`,
    title: p.title,
    goal: p.goal,
    weeks: p.durationWeeks,
    active: p.active,
    createdAt: p.createdAt.toISOString(),
    days: p.workouts.map((w) => ({
      dayName: w.dayName,
      title: w.title,
      exercises: w.exercises.map((e) => ({
        name: e.name,
        sets: String(e.sets),
        reps: e.reps,
        restSeconds: String(e.restSeconds),
        tempo: e.tempo ?? '',
        rpe: e.rpe != null ? String(e.rpe) : '',
        rir: e.rir != null ? String(e.rir) : '',
        progressionGuidance: e.progressionGuidance ?? '',
        coachNotes: e.coachNotes ?? e.notes ?? '',
      })),
    })),
  }));

  return (
    <AdminAppShell title="Programmes" subtitle="Build a programme day by day, then assign it. The client sees it under Train straight away.">
      <ProgrammeBuilder clients={clients} saved={saved} initialClientId={client ?? null} />
    </AdminAppShell>
  );
}
