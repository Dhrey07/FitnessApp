-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "coachNotes" TEXT;
ALTER TABLE "Exercise" ADD COLUMN "progressionGuidance" TEXT;
ALTER TABLE "Exercise" ADD COLUMN "rir" INTEGER;
ALTER TABLE "Exercise" ADD COLUMN "rpe" REAL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "averageDailySteps" INTEGER;
ALTER TABLE "Profile" ADD COLUMN "programmeDurationWeeks" INTEGER DEFAULT 12;
ALTER TABLE "Profile" ADD COLUMN "programmeStartDate" DATETIME;
ALTER TABLE "Profile" ADD COLUMN "startingWeightKg" REAL;
ALTER TABLE "Profile" ADD COLUMN "targetWeightKg" REAL;

-- AlterTable
ALTER TABLE "WeeklyCheckIn" ADD COLUMN "averageDailySteps" INTEGER;
ALTER TABLE "WeeklyCheckIn" ADD COLUMN "helpNeeded" TEXT;
ALTER TABLE "WeeklyCheckIn" ADD COLUMN "hungerLevel" INTEGER;
ALTER TABLE "WeeklyCheckIn" ADD COLUMN "stressLevel" INTEGER;
ALTER TABLE "WeeklyCheckIn" ADD COLUMN "trainingSessionsCompleted" INTEGER;
ALTER TABLE "WeeklyCheckIn" ADD COLUMN "trainingSessionsPlanned" INTEGER;
ALTER TABLE "WeeklyCheckIn" ADD COLUMN "wins" TEXT;

-- CreateTable
CREATE TABLE "ProgressReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "startingWeightKg" REAL NOT NULL,
    "currentWeightKg" REAL NOT NULL,
    "waistCm" REAL NOT NULL,
    "averageSteps" INTEGER,
    "trainingConsistency" INTEGER NOT NULL,
    "nutritionAdherence" INTEGER NOT NULL,
    "hunger" INTEGER,
    "energy" INTEGER,
    "sleep" INTEGER,
    "strengthPerformance" TEXT,
    "challenges" TEXT,
    "wins" TEXT,
    "coachAssessment" TEXT NOT NULL,
    "nextAdjustments" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProgressReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgressReport_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NutritionGuideline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "body" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MealPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coachId" TEXT,
    "title" TEXT NOT NULL,
    "dailyCalorieTarget" REAL NOT NULL,
    "proteinTargetG" REAL NOT NULL,
    "carbsTargetG" REAL NOT NULL,
    "fatTargetG" REAL NOT NULL,
    "notes" TEXT,
    "durationDays" INTEGER NOT NULL DEFAULT 7,
    "guidelinesIncluded" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MealPlan_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MealPlan" ("active", "carbsTargetG", "coachId", "createdAt", "dailyCalorieTarget", "fatTargetG", "id", "notes", "proteinTargetG", "title", "updatedAt", "userId") SELECT "active", "carbsTargetG", "coachId", "createdAt", "dailyCalorieTarget", "fatTargetG", "id", "notes", "proteinTargetG", "title", "updatedAt", "userId" FROM "MealPlan";
DROP TABLE "MealPlan";
ALTER TABLE "new_MealPlan" RENAME TO "MealPlan";
CREATE TABLE "new_MealPlanItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealPlanId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL DEFAULT 1,
    "mealType" TEXT NOT NULL,
    "mealLabel" TEXT,
    "foodName" TEXT NOT NULL,
    "portion" TEXT NOT NULL,
    "quantity" TEXT,
    "calories" REAL NOT NULL,
    "proteinG" REAL NOT NULL,
    "carbsG" REAL NOT NULL,
    "fatG" REAL NOT NULL,
    "culturalAlternative" TEXT,
    "notes" TEXT,
    CONSTRAINT "MealPlanItem_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MealPlanItem" ("calories", "carbsG", "culturalAlternative", "fatG", "foodName", "id", "mealPlanId", "mealType", "notes", "portion", "proteinG") SELECT "calories", "carbsG", "culturalAlternative", "fatG", "foodName", "id", "mealPlanId", "mealType", "notes", "portion", "proteinG" FROM "MealPlanItem";
DROP TABLE "MealPlanItem";
ALTER TABLE "new_MealPlanItem" RENAME TO "MealPlanItem";
CREATE TABLE "new_Testimonial" (
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
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Testimonial" ("afterPhotoUrl", "age", "beforePhotoUrl", "createdAt", "durationWeeks", "endingWeightKg", "featured", "goalAchieved", "id", "location", "name", "quote", "startingWeightKg", "updatedAt", "verifiedClient") SELECT "afterPhotoUrl", "age", "beforePhotoUrl", "createdAt", "durationWeeks", "endingWeightKg", "featured", "goalAchieved", "id", "location", "name", "quote", "startingWeightKg", "updatedAt", "verifiedClient" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "NutritionGuideline_slug_key" ON "NutritionGuideline"("slug");

