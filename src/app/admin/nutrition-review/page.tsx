import type { Metadata } from 'next';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { prisma } from '@/lib/db';
import { requireCoach } from '@/lib/coach/data';
import { MealReview, type MealItem } from './MealReview';

export const metadata: Metadata = { title: 'Meals' };
export const dynamic = 'force-dynamic';

const PENDING = ['AWAITING_COACH', 'PENDING', 'AI_PROCESSED'];

export default async function MealsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireCoach();
  const { id } = await searchParams;
  const include = { user: { select: { firstName: true, lastName: true, profile: { select: { dailyCalories: true, primaryGoal: true } } } }, foodAnalysis: true, coachReview: true } as const;

  const [pending, reviewed] = await Promise.all([
    prisma.foodSubmission.findMany({ where: { status: { in: PENDING } }, orderBy: { createdAt: 'asc' }, include }),
    prisma.foodSubmission.findMany({ where: { status: { notIn: PENDING } }, orderBy: { updatedAt: 'desc' }, take: 30, include }),
  ]);
  const linked = id && ![...pending, ...reviewed].some((m) => m.id === id) ? await prisma.foodSubmission.findUnique({ where: { id }, include }) : null;

  const items: MealItem[] = [...pending, ...reviewed, ...(linked ? [linked] : [])].map((m) => ({
    id: m.id,
    name: `${m.user.firstName} ${m.user.lastName}`,
    firstName: m.user.firstName,
    text: m.rawInput,
    imageUrl: m.imageUrl,
    mealType: m.mealType,
    date: m.createdAt.toISOString(),
    pending: PENDING.includes(m.status),
    status: m.status,
    dailyCalories: Math.round(m.user.profile?.dailyCalories ?? 0),
    estimate: {
      kcal: Math.round(m.foodAnalysis?.estimatedCalories ?? 0),
      protein: Math.round(m.foodAnalysis?.estimatedProtein ?? 0),
      carbs: Math.round(m.foodAnalysis?.estimatedCarbs ?? 0),
      fat: Math.round(m.foodAnalysis?.estimatedFat ?? 0),
    },
    notes: [m.foodAnalysis?.portionAssessment, m.foodAnalysis?.goalAlignmentNotes, m.foodAnalysis?.potentialConcerns].filter((x): x is string => Boolean(x && x.trim())),
    review: m.coachReview
      ? { kcal: Math.round(m.coachReview.finalCalories), protein: Math.round(m.coachReview.finalProtein), carbs: Math.round(m.coachReview.finalCarbs), fat: Math.round(m.coachReview.finalFat), feedback: m.coachReview.coachFeedback }
      : null,
  }));

  return (
    <AdminAppShell title="Meals" hideTitle>
      <MealReview items={items} initialId={id ?? pending[0]?.id ?? null} linked={Boolean(id)} pendingCount={pending.length} />
    </AdminAppShell>
  );
}
