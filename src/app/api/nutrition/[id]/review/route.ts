import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCoach } from '@/lib/printAuth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params;
    const body = await request.json();
    const { approved, finalCalories, finalProtein, finalCarbs, finalFat, coachFeedback, actionTaken } = body;
    const coach = await isCoach();
    if (!coach) return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
    const coachId = coach.id;

    if (!submissionId) {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
    }
    for (const v of [finalCalories, finalProtein, finalCarbs, finalFat]) {
      if (!Number.isFinite(Number(v)) || Number(v) < 0) {
        return NextResponse.json({ error: 'Calories and macros must be numbers.' }, { status: 400 });
      }
    }

    const submission = await prisma.foodSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const reviewStatus = actionTaken === 'REJECTED' ? 'REJECTED' : actionTaken === 'MODIFIED' ? 'MODIFIED' : 'APPROVED';

    // Upsert Coach Review
    const coachReview = await prisma.coachReview.upsert({
      where: { submissionId },
      create: {
        submissionId,
        coachId,
        approved: approved !== false,
        finalCalories: Number(finalCalories),
        finalProtein: Number(finalProtein),
        finalCarbs: Number(finalCarbs),
        finalFat: Number(finalFat),
        coachFeedback: coachFeedback || 'Reviewed and approved by your coach.',
        actionTaken: reviewStatus,
      },
      update: {
        coachId,
        approved: approved !== false,
        finalCalories: Number(finalCalories),
        finalProtein: Number(finalProtein),
        finalCarbs: Number(finalCarbs),
        finalFat: Number(finalFat),
        coachFeedback: coachFeedback || 'Reviewed and updated by your coach.',
        actionTaken: reviewStatus,
        reviewedAt: new Date(),
      },
    });

    // Update submission status to COMPLETED / APPROVED / MODIFIED
    await prisma.foodSubmission.update({
      where: { id: submissionId },
      data: { status: reviewStatus },
    });

    // Create Notification for user
    await prisma.notification.create({
      data: {
        userId: submission.userId,
        title: 'Meal review complete',
        message: `Your coach checked your ${submission.mealType.toLowerCase()}.`,
        link: '/client/nutrition',
      },
    });

    return NextResponse.json({
      message: 'Coach review successfully submitted.',
      coachReview,
    });
  } catch (error) {
    console.error('Error submitting coach review:', error);
    return NextResponse.json({ error: 'Failed to process coach review' }, { status: 500 });
  }
}
