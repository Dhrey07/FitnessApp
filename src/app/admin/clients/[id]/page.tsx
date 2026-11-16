import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { prisma } from '@/lib/db';
import { whatsappLink } from '@/lib/whatsapp';
import { BRAND } from '@/lib/brand';
import { GOAL_LABEL, planLabelFor, requireCoach } from '@/lib/coach/data';
import { ClientTabs, type ClientFile } from './ClientTabs';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const u = await prisma.user.findUnique({ where: { id }, select: { firstName: true, lastName: true } });
  return { title: u ? `${u.firstName} ${u.lastName}` : 'Client' };
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireCoach();
  const { id } = await params;
  const c = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
      weeklyCheckIns: { orderBy: { checkInDate: 'desc' }, take: 16 },
      foodSubmissions: { orderBy: { createdAt: 'desc' }, take: 20, include: { foodAnalysis: true, coachReview: true } },
      workoutPlansReceived: { where: { active: true }, orderBy: { createdAt: 'desc' }, take: 1, include: { workouts: { orderBy: { orderIndex: 'asc' }, include: { exercises: { orderBy: { orderIndex: 'asc' } } } } } },
      mealPlansReceived: { where: { active: true }, orderBy: { createdAt: 'desc' }, take: 1, include: { items: true } },
      progressReports: { orderBy: { periodEnd: 'desc' } },
    },
  });
  if (!c || c.role !== 'CLIENT') notFound();

  const name = `${c.firstName} ${c.lastName}`;
  const p = c.profile;
  const plan = planLabelFor(c.subscriptions[0]);
  const wa = whatsappLink(c.phone, `Hello ${c.firstName}, ${BRAND.coachName} here.`);
  const workoutPlan = c.workoutPlansReceived[0];
  const mealPlan = c.mealPlansReceived[0];

  const file: ClientFile = {
    id: c.id,
    firstName: c.firstName,
    profile: p
      ? {
          bmr: p.bmr,
          tdee: p.tdee,
          dailyCalories: p.dailyCalories,
          targetProteinG: p.targetProteinG,
          targetCarbsG: p.targetCarbsG,
          targetFatG: p.targetFatG,
          weightKg: p.weightKg,
          startingWeightKg: p.startingWeightKg,
          targetWeightKg: p.targetWeightKg,
          programmeDurationWeeks: p.programmeDurationWeeks,
          programmeStartDate: p.programmeStartDate ? p.programmeStartDate.toISOString() : null,
          facts: [
            ['Age and height', `${p.age} · ${p.heightCm} cm`],
            ['Trains', `${p.trainingEnvironment === 'BOTH' ? 'Home and gym' : p.trainingEnvironment === 'GYM' ? 'Gym' : 'Home'} · ${p.preferredWorkoutDays ?? 4} days · ${p.preferredDurationMin ?? 45} min`],
            ['Experience', [p.fitnessLevel, p.trainingExperience].filter(Boolean).join(' · ')],
            ['Equipment', p.availableEquipment || 'Not given'],
            ['Eats', `${p.dietaryPreference ?? 'Everything'} · ${p.typicalMealFrequency ?? 3} meals a day`],
            ['Allergies', p.allergies || 'None'],
            ['Avoids', p.foodRestrictions || 'None'],
          ],
        }
      : null,
    checkIns: c.weeklyCheckIns.map((k) => ({
      id: k.id,
      date: k.checkInDate.toISOString(),
      weightKg: k.currentWeightKg,
      waistCm: k.waistCm,
      nutrition: k.nutritionAdherence,
      sessions: k.trainingSessionsPlanned ? `${k.trainingSessionsCompleted ?? 0} of ${k.trainingSessionsPlanned}` : null,
      status: k.status,
      feedback: k.coachFeedback,
    })),
    meals: c.foodSubmissions.map((m) => ({
      id: m.id,
      text: m.rawInput,
      mealType: m.mealType,
      date: m.createdAt.toISOString(),
      kcal: Math.round(m.coachReview?.finalCalories ?? m.foodAnalysis?.estimatedCalories ?? 0),
      status: m.status,
      imageUrl: m.imageUrl,
    })),
    programme: workoutPlan
      ? {
          id: workoutPlan.id,
          title: workoutPlan.title,
          weeks: workoutPlan.durationWeeks,
          days: workoutPlan.workouts.map((w) => ({ id: w.id, dayName: w.dayName, title: w.title, exercises: w.exercises.map((e) => `${e.name} · ${e.sets} × ${e.reps}`) })),
        }
      : null,
    mealPlan: mealPlan
      ? { id: mealPlan.id, title: mealPlan.title, kcal: Math.round(mealPlan.dailyCalorieTarget), protein: Math.round(mealPlan.proteinTargetG), days: mealPlan.durationDays ?? 7, items: mealPlan.items.length }
      : null,
    reports: c.progressReports.map((r) => ({ id: r.id, start: r.periodStart.toISOString(), end: r.periodEnd.toISOString(), published: Boolean(r.publishedAt), weight: r.currentWeightKg })),
  };

  return (
    <AdminAppShell
      title={name}
      back={
        <Link href="/admin/clients" aria-label="All clients" className="focus-ring h-11 w-11 rounded-full flex items-center justify-center text-ink-secondary">
          <ChevronLeft size={22} />
        </Link>
      }
      hideTitle
    >
      {/* Sticky identity bar with the primary actions */}
      <header className="sticky top-0 z-30 -mx-4 md:-mx-10 px-4 md:px-10 py-4 bg-[var(--bg-header)] backdrop-blur-md hairline-b">
        <div className="mx-auto max-w-[960px] flex items-center gap-4">
          <Link href="/admin/clients" aria-label="All clients" className="md:hidden focus-ring -ml-2 h-10 w-10 rounded-full flex items-center justify-center text-ink-secondary">
            <ChevronLeft size={22} />
          </Link>
          <ViewTransition name={`client-avatar-${c.id}`} share="morph" default="none">
            <span className="hidden md:inline-flex"><Avatar name={name} src={c.avatarUrl} size="lg" /></span>
          </ViewTransition>
          <ViewTransition name={`client-avatar-m-${c.id}`} share="morph" default="none">
            <span className="md:hidden inline-flex"><Avatar name={name} src={c.avatarUrl} size="lg" /></span>
          </ViewTransition>
          <div className="min-w-0 flex-1">
            <h1 className="t-h2 truncate">{name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Pill tone="brand">{plan}</Pill>
              {p && <span className="t-caption">{GOAL_LABEL[p.primaryGoal] ?? p.primaryGoal}</span>}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {wa && (
              <Button href={wa} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer" leading={<MessageCircle size={16} aria-hidden />}>
                Message
              </Button>
            )}
            <Button href={`/admin/clients/${c.id}/reports/new`} size="sm">Create report</Button>
          </div>
        </div>
        <div className="sm:hidden mt-3 flex gap-2">
          {wa && <Button href={wa} variant="secondary" size="sm" full target="_blank" rel="noopener noreferrer">Message</Button>}
          <Button href={`/admin/clients/${c.id}/reports/new`} size="sm" full>Create report</Button>
        </div>
      </header>

      <ClientTabs file={file} />
    </AdminAppShell>
  );
}
