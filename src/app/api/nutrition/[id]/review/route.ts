import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params;
    const body = await request.json();
    const { coachId, approved, finalCalories, finalProtein, finalCarbs, finalFat, coachFeedback, actionTaken } = body;

    if (!submissionId || !coachId) {
      return NextResponse.json({ error: 'Missing submissionId or coachId' }, { status: 400 });
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
        message: `Your human coach has reviewed your ${submission.mealType.toLowerCase()} submission!`,
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
