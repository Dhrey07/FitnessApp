import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isCoach } from '@/lib/printAuth';

export async function GET() {
  const coach = await isCoach();
  if (!coach) return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const coach = await isCoach();
  if (!coach) return NextResponse.json({ error: 'Coach access only' }, { status: 403 });
  try {
    const body = await request.json();
    const { name, age, location, goalAchieved, startingWeightKg, endingWeightKg, durationWeeks, quote, beforePhotoUrl, afterPhotoUrl, consentGiven } = body;

    if (!name || !quote || !goalAchieved) {
      return NextResponse.json({ error: 'Name, quote, and goal achieved are required' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        age: parseInt(String(age || 30), 10),
        location: location || 'Nigeria',
        goalAchieved,
        startingWeightKg: parseFloat(String(startingWeightKg || 80)),
        endingWeightKg: parseFloat(String(endingWeightKg || 72)),
        durationWeeks: parseInt(String(durationWeeks || 12), 10),
        quote,
        beforePhotoUrl,
        afterPhotoUrl,
        verifiedClient: true,
        consentGiven: Boolean(consentGiven),
        featured: true,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
