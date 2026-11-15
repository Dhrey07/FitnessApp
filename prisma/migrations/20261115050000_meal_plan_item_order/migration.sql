-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MealPlanItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealPlanId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL DEFAULT 1,
    "mealType" TEXT NOT NULL,
    "mealLabel" TEXT,
    "foodName" TEXT NOT NULL,
    "portion" TEXT NOT NULL,
    "quantity" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "calories" REAL NOT NULL,
    "proteinG" REAL NOT NULL,
    "carbsG" REAL NOT NULL,
    "fatG" REAL NOT NULL,
    "culturalAlternative" TEXT,
    "notes" TEXT,
    CONSTRAINT "MealPlanItem_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MealPlanItem" ("calories", "carbsG", "culturalAlternative", "dayNumber", "fatG", "foodName", "id", "mealLabel", "mealPlanId", "mealType", "notes", "portion", "proteinG", "quantity") SELECT "calories", "carbsG", "culturalAlternative", "dayNumber", "fatG", "foodName", "id", "mealLabel", "mealPlanId", "mealType", "notes", "portion", "proteinG", "quantity" FROM "MealPlanItem";
DROP TABLE "MealPlanItem";
ALTER TABLE "new_MealPlanItem" RENAME TO "MealPlanItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

