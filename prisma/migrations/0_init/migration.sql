-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "heightCm" REAL NOT NULL,
    "weightKg" REAL NOT NULL,
    "waistCm" REAL NOT NULL,
    "activityLevel" TEXT NOT NULL DEFAULT 'MODERATELY_ACTIVE',
    "primaryGoal" TEXT NOT NULL DEFAULT 'FAT_LOSS',
    "fitnessLevel" TEXT DEFAULT 'INTERMEDIATE',
    "trainingExperience" TEXT DEFAULT '1-2 years',
    "preferredWorkoutDays" INTEGER DEFAULT 4,
    "preferredDurationMin" INTEGER DEFAULT 45,
    "trainingEnvironment" TEXT DEFAULT 'BOTH',
    "availableEquipment" TEXT DEFAULT 'Dumbbells, Barbells, Resistance Bands',
    "dietaryPreference" TEXT DEFAULT 'OMNIVORE',
    "allergies" TEXT,
    "foodRestrictions" TEXT,
    "typicalMealFrequency" INTEGER DEFAULT 3,
    "bmr" REAL NOT NULL,
    "tdee" REAL NOT NULL,
    "dailyCalories" REAL NOT NULL,
    "targetProteinG" REAL NOT NULL,
    "targetCarbsG" REAL NOT NULL,
    "targetFatG" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planTier" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isTrial" BOOLEAN NOT NULL DEFAULT false,
    "trialStartDate" DATETIME,
    "trialEndDate" DATETIME,
    "trialStatus" TEXT DEFAULT 'ACTIVE',
    "amountPaid" REAL NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "referenceCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "location" TEXT DEFAULT 'Lagos, Nigeria',
    "goalAchieved" TEXT NOT NULL,
    "startingWeightKg" REAL NOT NULL,
    "endingWeightKg" REAL NOT NULL,
    "durationWeeks" INTEGER NOT NULL DEFAULT 12,
    "quote" TEXT NOT NULL,
    "beforePhotoUrl" TEXT,
    "afterPhotoUrl" TEXT,
    "verifiedClient" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FoodSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "submissionType" TEXT NOT NULL DEFAULT 'NATURAL_LANGUAGE',
    "imageUrl" TEXT,
    "rawInput" TEXT NOT NULL,
    "mealType" TEXT NOT NULL DEFAULT 'LUNCH',
    "portionDescription" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FoodSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FoodAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "estimatedCalories" REAL NOT NULL,
    "estimatedProtein" REAL NOT NULL,
    "estimatedCarbs" REAL NOT NULL,
    "estimatedFat" REAL NOT NULL,
    "portionAssessment" TEXT NOT NULL,
    "mealQualityScore" INTEGER NOT NULL,
    "goalAlignmentNotes" TEXT NOT NULL,
    "potentialConcerns" TEXT,
    "suggestedAlternatives" TEXT,
    "aiRawOutput" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FoodAnalysis_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FoodSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoachReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "finalCalories" REAL NOT NULL,
    "finalProtein" REAL NOT NULL,
    "finalCarbs" REAL NOT NULL,
    "finalFat" REAL NOT NULL,
    "coachFeedback" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "reviewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoachReview_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FoodSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoachReview_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coachId" TEXT,
    "title" TEXT NOT NULL,
    "dailyCalorieTarget" REAL NOT NULL,
    "proteinTargetG" REAL NOT NULL,
    "carbsTargetG" REAL NOT NULL,
    "fatTargetG" REAL NOT NULL,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MealPlan_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MealPlanItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealPlanId" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "portion" TEXT NOT NULL,
    "calories" REAL NOT NULL,
    "proteinG" REAL NOT NULL,
    "carbsG" REAL NOT NULL,
    "fatG" REAL NOT NULL,
    "culturalAlternative" TEXT,
    "notes" TEXT,
    CONSTRAINT "MealPlanItem_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coachId" TEXT,
    "title" TEXT NOT NULL,
    "goal" TEXT NOT NULL DEFAULT 'FAT_LOSS',
    "durationWeeks" INTEGER NOT NULL DEFAULT 4,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkoutPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutPlan_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutPlanId" TEXT NOT NULL,
    "dayName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Workout_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "WorkoutPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 3,
    "reps" TEXT NOT NULL DEFAULT '10-12',
    "restSeconds" INTEGER NOT NULL DEFAULT 60,
    "tempo" TEXT DEFAULT '2-0-2',
    "notes" TEXT,
    "mediaUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setsCompleted" INTEGER NOT NULL,
    "repsCompleted" TEXT NOT NULL,
    "weightUsedKg" REAL NOT NULL,
    "notes" TEXT,
    "adherenceScore" INTEGER NOT NULL DEFAULT 100,
    CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutLog_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeeklyCheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "checkInDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentWeightKg" REAL NOT NULL,
    "waistCm" REAL NOT NULL,
    "energyLevel" INTEGER NOT NULL,
    "sleepQuality" INTEGER NOT NULL,
    "workoutAdherence" INTEGER NOT NULL,
    "nutritionAdherence" INTEGER NOT NULL,
    "difficultyLevel" TEXT NOT NULL,
    "challenges" TEXT,
    "generalFeedback" TEXT,
    "photoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "aiTrendsSummary" TEXT,
    "coachFeedback" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WeeklyCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "recordDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weightKg" REAL NOT NULL,
    "waistCm" REAL NOT NULL,
    "notes" TEXT,
    CONSTRAINT "ProgressRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoachNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "noteText" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoachNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoachNote_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_referenceCode_key" ON "Subscription"("referenceCode");

-- CreateIndex
CREATE UNIQUE INDEX "FoodAnalysis_submissionId_key" ON "FoodAnalysis"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "CoachReview_submissionId_key" ON "CoachReview"("submissionId");

