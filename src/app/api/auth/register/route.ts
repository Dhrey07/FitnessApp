import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { calculateNutritionProfile, FitnessGoal, ActivityLevel, Sex } from '@/lib/services/nutritionEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      sex,
      heightCm,
      weightKg,
      waistCm,
      activityLevel,
      primaryGoal,
      fitnessLevel,
      trainingExperience,
      preferredWorkoutDays,
      preferredDurationMin,
      trainingEnvironment,
      availableEquipment,
      dietaryPreference,
      allergies,
      foodRestrictions,
      typicalMealFrequency,
    } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required account details' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 });
    }

    // Calculate Nutrition Targets using Mifflin-St Jeor Engine
    const parsedAge = parseInt(String(age || 28), 10);
    const parsedHeight = parseFloat(String(heightCm || 175));
    const parsedWeight = parseFloat(String(weightKg || 80));
    const parsedWaist = parseFloat(String(waistCm || 85));

    const nutrition = calculateNutritionProfile({
      age: parsedAge,
      sex: (sex?.toLowerCase() === 'female' ? 'female' : 'male') as Sex,
      heightCm: parsedHeight,
      weightKg: parsedWeight,
      waistCm: parsedWaist,
      activityLevel: (activityLevel || 'MODERATELY_ACTIVE') as ActivityLevel,
      primaryGoal: (primaryGoal || 'FAT_LOSS') as FitnessGoal,
    });

    // 14-Day Free Trial timestamps
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 14 * 86400000);

    // Create User, Profile, Subscription, and Notification in transaction
    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash: password || 'password123',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: 'CLIENT',
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
        profile: {
          create: {
            age: parsedAge,
            sex: sex?.toLowerCase() === 'female' ? 'female' : 'male',
            heightCm: parsedHeight,
            weightKg: parsedWeight,
            waistCm: parsedWaist,
            activityLevel: activityLevel || 'MODERATELY_ACTIVE',
            primaryGoal: primaryGoal || 'FAT_LOSS',
            fitnessLevel: fitnessLevel || 'INTERMEDIATE',
            trainingExperience: trainingExperience || '1-2 years',
            preferredWorkoutDays: parseInt(String(preferredWorkoutDays || 4), 10),
            preferredDurationMin: parseInt(String(preferredDurationMin || 45), 10),
            trainingEnvironment: trainingEnvironment || 'BOTH',
            availableEquipment: availableEquipment || 'Dumbbells, Barbells',
            dietaryPreference: dietaryPreference || 'OMNIVORE',
            allergies: allergies || 'None',
            foodRestrictions: foodRestrictions || 'None',
            typicalMealFrequency: parseInt(String(typicalMealFrequency || 3), 10),
            bmr: nutrition.bmr,
            tdee: nutrition.tdee,
            dailyCalories: nutrition.dailyCalories,
            targetProteinG: nutrition.targetProteinG,
            targetCarbsG: nutrition.targetCarbsG,
            targetFatG: nutrition.targetFatG,
          },
        },
        subscriptions: {
          create: {
            planTier: 'GOLD',
            status: 'ACTIVE',
            isTrial: true,
            trialStartDate: now,
            trialEndDate: trialEnd,
            trialStatus: 'ACTIVE',
            amountPaid: 0,
            referenceCode: `TRIAL-14DAY-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        },
        notifications: {
          create: {
            title: 'Welcome to Fitness Police!',
            message: 'Your 14-Day Free Trial is now active. Explore your personalized workouts and log your meals for free in Food Police.',
            link: '/client/dashboard',
          },
        },
      },
      include: {
        profile: true,
        subscriptions: true,
      },
    });

    // Create Initial Workout Plan for New Client
    await prisma.workoutPlan.create({
      data: {
        userId: newUser.id,
        title: `${primaryGoal?.replace('_', ' ') || 'Fat Loss'} Starter Routine`,
        goal: primaryGoal || 'FAT_LOSS',
        durationWeeks: 4,
        workouts: {
          create: [
            {
              dayName: 'Day 1',
              title: 'Upper Body Push & Core',
              orderIndex: 1,
              exercises: {
                create: [
                  { name: 'Dumbbell Incline Bench Press', sets: 3, reps: '10-12', restSeconds: 60, orderIndex: 1 },
                  { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 60, orderIndex: 2 },
                  { name: 'Push-ups (or Knee Push-ups)', sets: 3, reps: '12-15', restSeconds: 45, orderIndex: 3 },
                  { name: 'Plank Hold', sets: 3, reps: '45s', restSeconds: 45, orderIndex: 4 },
                ],
              },
            },
            {
              dayName: 'Day 2',
              title: 'Lower Body & Conditioning',
              orderIndex: 2,
              exercises: {
                create: [
                  { name: 'Goblet Squats', sets: 3, reps: '12', restSeconds: 60, orderIndex: 1 },
                  { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', restSeconds: 60, orderIndex: 2 },
                  { name: 'Walking Lunges', sets: 3, reps: '10 per leg', restSeconds: 45, orderIndex: 3 },
                ],
              },
            },
          ],
        },
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        profile: newUser.profile,
        subscription: newUser.subscriptions[0],
      },
      redirectTo: '/client/dashboard',
    });

    // Set HTTP-only session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newUser.email,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account and complete onboarding' }, { status: 500 });
  }
}
