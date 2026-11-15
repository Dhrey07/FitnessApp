import { PrismaClient } from '@prisma/client';
import { NUTRITION_GUIDELINES } from './seed-data/nutritionGuidelines';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing tables
  await prisma.auditLog.deleteMany({});
  await prisma.progressReport.deleteMany({});
  await prisma.nutritionGuideline.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.coachNote.deleteMany({});
  await prisma.progressRecord.deleteMany({});
  await prisma.weeklyCheckIn.deleteMany({});
  await prisma.workoutLog.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.workout.deleteMany({});
  await prisma.workoutPlan.deleteMany({});
  await prisma.mealPlanItem.deleteMany({});
  await prisma.mealPlan.deleteMany({});
  await prisma.coachReview.deleteMany({});
  await prisma.foodAnalysis.deleteMany({});
  await prisma.foodSubmission.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Coach / Admin
  const coach = await prisma.user.create({
    data: {
      email: 'coach@ericonet.fit',
      passwordHash: 'password123',
      role: 'COACH',
      firstName: 'Coach',
      lastName: 'Eric',
      phone: '+2348012345678',
    },
  });

  // 2. Client 1: Chidi (Gold Tier - Fat Loss)
  const clientChidi = await prisma.user.create({
    data: {
      email: 'chidi@example.com',
      passwordHash: 'password123',
      role: 'CLIENT',
      firstName: 'Chidi',
      lastName: 'Okonkwo',
      phone: '+2348023456789',
      profile: {
        create: {
          age: 29,
          sex: 'male',
          heightCm: 180,
          weightKg: 85,
          waistCm: 88,
          activityLevel: 'MODERATELY_ACTIVE',
          primaryGoal: 'FAT_LOSS',
          fitnessLevel: 'INTERMEDIATE',
          trainingExperience: '2 years',
          preferredWorkoutDays: 4,
          preferredDurationMin: 45,
          trainingEnvironment: 'GYM',
          availableEquipment: 'Barbells, Dumbbells, Cables, Squat Rack',
          dietaryPreference: 'OMNIVORE',
          allergies: 'None',
          foodRestrictions: 'None',
          typicalMealFrequency: 3,
          startingWeightKg: 86.5,
          targetWeightKg: 78,
          programmeStartDate: new Date(Date.now() - 21 * 86400000),
          programmeDurationWeeks: 12,
          averageDailySteps: 8400,
          bmr: 1845,
          tdee: 2860,
          dailyCalories: 2288,
          targetProteinG: 187,
          targetCarbsG: 229,
          targetFatG: 64,
        },
      },
      subscriptions: {
        create: {
          planTier: 'GOLD',
          status: 'ACTIVE',
          isTrial: false,
          amountPaid: 25000,
          referenceCode: 'PAY-GOLD-9981',
          startDate: new Date(),
        },
      },
    },
  });

  // 3. Client 2: Aminat (Diamond VIP Tier - Muscle Gain)
  const clientAminat = await prisma.user.create({
    data: {
      email: 'aminat@example.com',
      passwordHash: 'password123',
      role: 'CLIENT',
      firstName: 'Aminat',
      lastName: 'Bello',
      phone: '+2348034567890',
      profile: {
        create: {
          age: 26,
          sex: 'female',
          heightCm: 168,
          weightKg: 62,
          waistCm: 70,
          activityLevel: 'VERY_ACTIVE',
          primaryGoal: 'MUSCLE_GAIN',
          fitnessLevel: 'ADVANCED',
          trainingExperience: '3 years',
          preferredWorkoutDays: 5,
          preferredDurationMin: 60,
          trainingEnvironment: 'GYM',
          availableEquipment: 'Full Commercial Gym',
          dietaryPreference: 'OMNIVORE',
          allergies: 'Shellfish',
          foodRestrictions: 'Low lactose',
          typicalMealFrequency: 4,
          startingWeightKg: 60,
          targetWeightKg: 65,
          programmeStartDate: new Date(Date.now() - 42 * 86400000),
          programmeDurationWeeks: 16,
          averageDailySteps: 9500,
          bmr: 1424,
          tdee: 2456,
          dailyCalories: 2700,
          targetProteinG: 124,
          targetCarbsG: 340,
          targetFatG: 75,
        },
      },
      subscriptions: {
        create: {
          planTier: 'DIAMOND',
          status: 'ACTIVE',
          isTrial: false,
          amountPaid: 40000,
          referenceCode: 'PAY-DIA-7721',
          startDate: new Date(),
        },
      },
    },
  });

  // 4. Client 3: Tunde (Free Tier - nutrition log user)
  const clientTunde = await prisma.user.create({
    data: {
      email: 'tunde@example.com',
      passwordHash: 'password123',
      role: 'CLIENT',
      firstName: 'Tunde',
      lastName: 'Johnson',
      phone: '+2348045678901',
      profile: {
        create: {
          age: 34,
          sex: 'male',
          heightCm: 175,
          weightKg: 96,
          waistCm: 102,
          activityLevel: 'SEDENTARY',
          primaryGoal: 'FAT_LOSS',
          fitnessLevel: 'BEGINNER',
          trainingExperience: 'Beginner / Returning',
          preferredWorkoutDays: 3,
          preferredDurationMin: 30,
          trainingEnvironment: 'HOME',
          availableEquipment: 'Dumbbells (5kg-15kg)',
          dietaryPreference: 'OMNIVORE',
          allergies: 'None',
          foodRestrictions: 'None',
          typicalMealFrequency: 3,
          startingWeightKg: 92,
          targetWeightKg: 84,
          programmeStartDate: new Date(Date.now() - 7 * 86400000),
          programmeDurationWeeks: 12,
          averageDailySteps: 5200,
          bmr: 1859,
          tdee: 2230,
          dailyCalories: 1784,
          targetProteinG: 192,
          targetCarbsG: 154,
          targetFatG: 50,
        },
      },
      subscriptions: {
        create: {
          planTier: 'FREE',
          status: 'ACTIVE',
          isTrial: false,
          amountPaid: 0,
        },
      },
    },
  });

  // 5. Client 4: Zainab (14-Day Free Trial User - Day 5 of 14)
  const trialStart = new Date(Date.now() - 5 * 86400000);
  const trialEnd = new Date(Date.now() + 9 * 86400000);

  const clientZainab = await prisma.user.create({
    data: {
      email: 'zainab@example.com',
      passwordHash: 'password123',
      role: 'CLIENT',
      firstName: 'Zainab',
      lastName: 'Dahiru',
      phone: '+2348056789012',
      profile: {
        create: {
          age: 28,
          sex: 'female',
          heightCm: 165,
          weightKg: 73,
          waistCm: 82,
          activityLevel: 'MODERATELY_ACTIVE',
          primaryGoal: 'FAT_LOSS',
          fitnessLevel: 'BEGINNER',
          trainingExperience: 'Under 1 year',
          preferredWorkoutDays: 4,
          preferredDurationMin: 45,
          trainingEnvironment: 'BOTH',
          availableEquipment: 'Dumbbells, Mat, Gym Membership',
          dietaryPreference: 'HALAL',
          allergies: 'Peanuts',
          foodRestrictions: 'No pork/alcohol',
          typicalMealFrequency: 3,
          startingWeightKg: 70,
          targetWeightKg: 64,
          programmeStartDate: new Date(Date.now() - 5 * 86400000),
          programmeDurationWeeks: 12,
          averageDailySteps: 6800,
          bmr: 1475,
          tdee: 2286,
          dailyCalories: 1828,
          targetProteinG: 146,
          targetCarbsG: 183,
          targetFatG: 51,
        },
      },
      subscriptions: {
        create: {
          planTier: 'GOLD',
          status: 'ACTIVE',
          isTrial: true,
          trialStartDate: trialStart,
          trialEndDate: trialEnd,
          trialStatus: 'ACTIVE',
          amountPaid: 0,
          referenceCode: 'TRIAL-GOLD-14DAY',
        },
      },
    },
  });

  // Seed Meal Plan for Chidi
  await prisma.mealPlan.create({
    data: {
      userId: clientChidi.id,
      coachId: coach.id,
      title: 'Nigerian High-Protein Lean Fat Loss Plan',
      dailyCalorieTarget: 2288,
      proteinTargetG: 187,
      carbsTargetG: 229,
      fatTargetG: 64,
      durationDays: 7,
      guidelinesIncluded: true,
      items: {
        create: [
          {
            dayNumber: 1,
            mealType: 'BREAKFAST',
            mealLabel: 'Meal 1',
            foodName: 'Oatmeal with Boiled Eggs & Banana',
            portion: '1 cup cooked oats + 3 boiled eggs + 1 banana',
            quantity: '1 cup cooked oats + 3 boiled eggs + 1 banana',
            calories: 450,
            proteinG: 28,
            carbsG: 45,
            fatG: 16,
            culturalAlternative: 'Moi Moi (2 wraps) with 2 eggs',
          },
          {
            dayNumber: 1,
            mealType: 'LUNCH',
            mealLabel: 'Meal 2',
            foodName: 'Jollof Rice with Grilled Chicken Breast & Dodo',
            portion: '1.5 cups Jollof + 1 large chicken breast + 4 slices plantain',
            quantity: '1.5 cups Jollof + 1 large chicken breast + 4 slices plantain',
            calories: 680,
            proteinG: 52,
            carbsG: 75,
            fatG: 18,
            culturalAlternative: 'Boiled Yam with Egg & Garden Egg Sauce',
          },
          {
            dayNumber: 1,
            mealType: 'DINNER',
            mealLabel: 'Meal 3',
            foodName: 'Efo Riro (Spinach Stew) with Tilapia & Small Oat Swallow',
            portion: '1 bowl Efo Riro + 1 medium Tilapia + 1 small wrap Oat swallow',
            quantity: '1 bowl Efo Riro + 1 medium Tilapia + 1 small wrap Oat swallow',
            calories: 580,
            proteinG: 48,
            carbsG: 55,
            fatG: 20,
            culturalAlternative: 'Okra Soup with Assorted Lean Beef',
          },
          {
            dayNumber: 1,
            mealType: 'SNACK',
            mealLabel: 'Snack',
            foodName: 'Greek Yogurt with Crushed Almonds',
            portion: '200g yogurt + 15g almonds',
            quantity: '200g yogurt + 15g almonds',
            calories: 250,
            proteinG: 24,
            carbsG: 12,
            fatG: 10,
          },
        ],
      },
    },
  });

  // Seed Workout Plan for Chidi
  await prisma.workoutPlan.create({
    data: {
      userId: clientChidi.id,
      coachId: coach.id,
      title: '4-Day Hypertrophy & Fat Burn Routine',
      goal: 'FAT_LOSS',
      durationWeeks: 4,
      workouts: {
        create: [
          {
            dayName: 'Day 1',
            title: 'Upper Body Push (Chest, Shoulders & Triceps)',
            orderIndex: 1,
            exercises: {
              create: [
                { name: 'Barbell Incline Bench Press', sets: 4, reps: '8-10', restSeconds: 90, tempo: '3-0-1', notes: 'Focus on slow negative descent', coachNotes: 'Focus on slow negative descent', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 1 },
                { name: 'Dumbbell Seated Shoulder Press', sets: 3, reps: '10-12', restSeconds: 60, tempo: '2-0-1', notes: 'Keep elbows slightly in front', coachNotes: 'Keep elbows slightly in front', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 2 },
                { name: 'Cable Chest Flyes', sets: 3, reps: '12-15', restSeconds: 60, tempo: '2-1-1', notes: 'Squeeze chest at peak contraction', coachNotes: 'Squeeze chest at peak contraction', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 3 },
                { name: 'Triceps Rope Pushdowns', sets: 4, reps: '12-15', restSeconds: 45, tempo: '2-0-1', notes: 'Lock elbows to ribs', coachNotes: 'Lock elbows to ribs', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 4 },
              ],
            },
          },
          {
            dayName: 'Day 2',
            title: 'Upper Body Pull (Back & Biceps)',
            orderIndex: 2,
            exercises: {
              create: [
                { name: 'Lat Pulldowns (Wide Grip)', sets: 4, reps: '10-12', restSeconds: 75, tempo: '2-0-1', notes: 'Drive with elbows down into pockets', coachNotes: 'Drive with elbows down into pockets', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 1 },
                { name: 'Seated Cable Rows', sets: 3, reps: '10-12', restSeconds: 60, tempo: '2-1-1', notes: 'Hold 1s at torso', coachNotes: 'Hold 1s at torso', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 2 },
                { name: 'Standing Barbell Bicep Curls', sets: 3, reps: '12-15', restSeconds: 60, tempo: '2-0-1', notes: 'Strict form, no swinging', coachNotes: 'Strict form, no swinging', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 3 },
                { name: 'Hammer Curls', sets: 3, reps: '12-15', restSeconds: 45, tempo: '2-0-1', notes: 'Target brachialis', coachNotes: 'Target brachialis', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 4 },
              ],
            },
          },
          {
            dayName: 'Day 3',
            title: 'Lower Body & Core (Legs & Abs)',
            orderIndex: 3,
            exercises: {
              create: [
                { name: 'Barbell Back Squats', sets: 4, reps: '8-10', restSeconds: 120, tempo: '3-0-1', notes: 'Hit parallel depth', coachNotes: 'Hit parallel depth', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 1 },
                { name: 'Romanian Deadlifts (Dumbbell)', sets: 3, reps: '10-12', restSeconds: 90, tempo: '3-1-1', notes: 'Push hips back for hamstring stretch', coachNotes: 'Push hips back for hamstring stretch', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 2 },
                { name: 'Walking Lunges', sets: 3, reps: '12 per leg', restSeconds: 60, tempo: '2-0-1', notes: 'Keep torso upright', coachNotes: 'Keep torso upright', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 3 },
                { name: 'Hanging Leg Raises', sets: 3, reps: '15-20', restSeconds: 45, tempo: '2-0-2', notes: 'Control the swing', coachNotes: 'Control the swing', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 4 },
              ],
            },
          },
          {
            dayName: 'Day 4',
            title: 'Full Body Metabolic Conditioning',
            orderIndex: 4,
            exercises: {
              create: [
                { name: 'Kettlebell Swings', sets: 4, reps: '20', restSeconds: 60, tempo: '1-0-1', notes: 'Explosive hip hinge', coachNotes: 'Explosive hip hinge', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 1 },
                { name: 'Dumbbell Thrusters', sets: 3, reps: '12', restSeconds: 60, tempo: '2-0-1', notes: 'Fluid squat-to-press motion', coachNotes: 'Fluid squat-to-press motion', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 2 },
                { name: 'Plank Hold', sets: 3, reps: '60s hold', restSeconds: 45, tempo: 'Hold', notes: 'Engage glutes and core', coachNotes: 'Engage glutes and core', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  // Seed Workout Plan for Zainab (Trial)
  await prisma.workoutPlan.create({
    data: {
      userId: clientZainab.id,
      coachId: coach.id,
      title: 'Beginner Body Sculpt & Conditioning (Home & Gym)',
      goal: 'FAT_LOSS',
      durationWeeks: 4,
      workouts: {
        create: [
          {
            dayName: 'Day 1',
            title: 'Full Body Strength A',
            orderIndex: 1,
            exercises: {
              create: [
                { name: 'Goblet Squats', sets: 3, reps: '12', restSeconds: 60, notes: 'Hold dumbbell at chest', coachNotes: 'Hold dumbbell at chest', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 1 },
                { name: 'Dumbbell Floor Press', sets: 3, reps: '12', restSeconds: 60, notes: 'Control descent', coachNotes: 'Control descent', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 2 },
                { name: 'Dumbbell Bent-over Rows', sets: 3, reps: '12', restSeconds: 60, notes: 'Keep spine neutral', coachNotes: 'Keep spine neutral', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 3 },
              ],
            },
          },
          {
            dayName: 'Day 2',
            title: 'Full Body Strength B',
            orderIndex: 2,
            exercises: {
              create: [
                { name: 'Dumbbell Romanian Deadlifts', sets: 3, reps: '12', restSeconds: 60, notes: 'Feel the hamstrings', coachNotes: 'Feel the hamstrings', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 1 },
                { name: 'Overhead Dumbbell Press', sets: 3, reps: '10', restSeconds: 60, notes: 'Press straight overhead', coachNotes: 'Press straight overhead', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 2 },
                { name: 'Glute Bridges', sets: 3, reps: '15', restSeconds: 45, notes: 'Pause 2s at top', coachNotes: 'Pause 2s at top', rpe: 8, rir: 2, progressionGuidance: 'Add 2.5 kg (or 1-2 reps) once every set reaches the top of the rep range at RPE 8 or lower.', orderIndex: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  // Seed Food Submissions
  // Submission 1: Awaiting Coach Review (Aminat)
  await prisma.foodSubmission.create({
    data: {
      userId: clientAminat.id,
      submissionType: 'NATURAL_LANGUAGE',
      rawInput: 'I ate 2 large wraps of pounded yam with egusi soup and 2 pieces of goat meat with a cold Coke.',
      mealType: 'LUNCH',
      status: 'AWAITING_COACH',
      foodAnalysis: {
        create: {
          estimatedCalories: 890,
          estimatedProtein: 38,
          estimatedCarbs: 110,
          estimatedFat: 32,
          portionAssessment: 'Detected: Pounded Yam (2 wraps), Egusi Soup with Goat Meat, Sugar Soda.',
          mealQualityScore: 7,
          goalAlignmentNotes: 'High carbohydrate and caloric density. Good for muscle gain, but soda adds empty refined sugars.',
          potentialConcerns: 'High glycemic load from refined soda.',
          suggestedAlternatives: 'Replace Coca-Cola with Zobo (unsweetened) or sparkling water.',
        },
      },
    },
  });

  // Submission 2: Approved by Coach (Chidi)
  await prisma.foodSubmission.create({
    data: {
      userId: clientChidi.id,
      submissionType: 'NATURAL_LANGUAGE',
      rawInput: '2 cups of jollof rice, grilled chicken breast, and 4 slices of fried plantain.',
      mealType: 'LUNCH',
      status: 'APPROVED',
      foodAnalysis: {
        create: {
          estimatedCalories: 720,
          estimatedProtein: 48,
          estimatedCarbs: 82,
          estimatedFat: 18,
          portionAssessment: 'Balanced protein to carb ratio for post-workout meal.',
          mealQualityScore: 9,
          goalAlignmentNotes: 'Fits within daily calorie deficit target (~2288 kcal).',
        },
      },
      coachReview: {
        create: {
          coachId: coach.id,
          approved: true,
          finalCalories: 710,
          finalProtein: 50,
          finalCarbs: 80,
          finalFat: 17,
          coachFeedback: 'Great meal timing right after your push workout! Keep plantain portion to 4 slices maximum to stay sharp on fat loss.',
          actionTaken: 'APPROVED',
        },
      },
    },
  });

  // Submission 3: Photo submission (Tunde)
  await prisma.foodSubmission.create({
    data: {
      userId: clientTunde.id,
      submissionType: 'PHOTO',
      imageUrl: null,
      rawInput: 'Grilled Tilapia with steamed vegetables and fried sweet potato wedges.',
      mealType: 'DINNER',
      status: 'AWAITING_COACH',
      foodAnalysis: {
        create: {
          estimatedCalories: 510,
          estimatedProtein: 42,
          estimatedCarbs: 45,
          estimatedFat: 14,
          portionAssessment: 'High protein lean fish with nutrient dense steamed greens.',
          mealQualityScore: 9,
          goalAlignmentNotes: 'Superb dinner choice for a fat loss deficit.',
          potentialConcerns: null,
          suggestedAlternatives: null,
        },
      },
    },
  });

  // Seed Weekly Check-In for Chidi (Flagged for Coach Review)
  await prisma.weeklyCheckIn.create({
    data: {
      userId: clientChidi.id,
      currentWeightKg: 84.2,
      waistCm: 87,
      energyLevel: 4,
      sleepQuality: 4,
      workoutAdherence: 90,
      nutritionAdherence: 85,
      difficultyLevel: 'Moderate',
      challenges: 'Felt a bit hungry on Wednesday evening before bed.',
      generalFeedback: 'Overall feeling lighter, clothes fit much better! Strength on bench press is holding steady.',
      averageDailySteps: 8400,
      trainingSessionsCompleted: 4,
      trainingSessionsPlanned: 4,
      hungerLevel: 3,
      stressLevel: 2,
      wins: 'Hit every session, and trousers that were tight in week 1 now fit comfortably.',
      helpNeeded: 'A higher-protein breakfast option that is not eggs every day.',
      status: 'PENDING_REVIEW',
      aiTrendsSummary: 'Weight down -0.8kg this week (85.0kg -> 84.2kg). Waist down -1cm. Adherence is strong.',
    },
  });

  // Progress records for Chidi
  await prisma.progressRecord.createMany({
    data: [
      { userId: clientChidi.id, recordDate: new Date(Date.now() - 21 * 86400000), weightKg: 86.5, waistCm: 89.5, notes: 'Starting baseline' },
      { userId: clientChidi.id, recordDate: new Date(Date.now() - 14 * 86400000), weightKg: 85.8, waistCm: 89.0, notes: 'Week 1 check-in' },
      { userId: clientChidi.id, recordDate: new Date(Date.now() - 7 * 86400000), weightKg: 85.0, waistCm: 88.0, notes: 'Week 2 check-in' },
      { userId: clientChidi.id, recordDate: new Date(), weightKg: 84.2, waistCm: 87.0, notes: 'Week 3 check-in - waist down 2.5cm total' },
    ],
  });

  // Seed Member Transformation Stories / Social Proof
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Oluwaseun Bakare',
        age: 32,
        location: 'Lagos, Nigeria',
        goalAchieved: 'Lost 12.4kg & Built Defined Muscle',
        startingWeightKg: 94.0,
        endingWeightKg: 81.6,
        durationWeeks: 16,
        quote: 'nutrition log changed the game for me. I didn’t have to give up Nigerian food like Jollof or Moi Moi — Coach Eric taught me exact portion management and cultural swaps. The accountability is 100% real.',
        beforePhotoUrl: null,
        afterPhotoUrl: null,
        verifiedClient: true,
        consentGiven: false,
        featured: true,
      },
      {
        name: 'Ngozi Eze',
        age: 28,
        location: 'Abuja, Nigeria',
        goalAchieved: 'Dropped 8kg & Lost 7cm off Waist',
        startingWeightKg: 76.0,
        endingWeightKg: 68.0,
        durationWeeks: 12,
        quote: 'Having a real human coach reviewing what I ate every day kept me honest. The 14-day trial showed me how structured training should actually feel. I upgraded to Gold and haven’t looked back.',
        beforePhotoUrl: null,
        afterPhotoUrl: null,
        verifiedClient: true,
        consentGiven: false,
        featured: true,
      },
      {
        name: 'Emeka Nwosu',
        age: 35,
        location: 'Port Harcourt, Nigeria',
        goalAchieved: 'Recomposed Body: Gained 4kg Lean Mass, Dropped 6% Body Fat',
        startingWeightKg: 82.0,
        endingWeightKg: 83.5,
        durationWeeks: 20,
        quote: 'The VIP Diamond coaching was worth every single naira. Coach Eric adjusted my training volume every single week based on my check-ins. My energy levels and physique are the best they’ve ever been.',
        beforePhotoUrl: null,
        afterPhotoUrl: null,
        verifiedClient: true,
        consentGiven: false,
        featured: true,
      },
    ],
  });

  // Sample published progress report for Chidi (weeks 1-3)
  await prisma.progressReport.create({
    data: {
      userId: clientChidi.id,
      coachId: coach.id,
      periodStart: new Date(Date.now() - 21 * 86400000),
      periodEnd: new Date(),
      startingWeightKg: 86.5,
      currentWeightKg: 84.2,
      waistCm: 87,
      averageSteps: 8400,
      trainingConsistency: 92,
      nutritionAdherence: 85,
      hunger: 3,
      energy: 4,
      sleep: 4,
      strengthPerformance: 'Incline bench up from 60 kg to 65 kg for 8. Squat holding at 100 kg with better depth.',
      challenges: 'Evening hunger on two or three nights a week, mostly Wednesday and Friday.',
      wins: 'Every planned session completed. Waist down 2.5 cm. Clothes noticeably looser.',
      coachAssessment:
        'Three weeks in and the trend is exactly where we want it: about 0.75 kg a week with strength holding or improving, which tells us the loss is coming from fat rather than muscle. Nutrition adherence of 85 percent is good and realistic. Evening hunger is the one thing to solve so it does not turn into unplanned snacking.',
      nextAdjustments:
        'Keep calories at 2,288 kcal. Move 30 g of carbohydrate from Meal 1 to Meal 3 to blunt evening hunger. Keep steps at 8,500. Add one top set on incline bench at RPE 8.5. Review again after week 4; if the weekly average stalls for two weeks, reduce by 100 kcal.',
      publishedAt: new Date(),
    },
  });

  // Nutrition guidelines (brief section 13), in the brief's order
  await prisma.nutritionGuideline.createMany({
    data: NUTRITION_GUIDELINES.map((g, i) => ({ ...g, orderIndex: i + 1, active: true })),
  });

  console.log('✅ Seed data successfully created with full realistic clients, trial user, and testimonials!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
