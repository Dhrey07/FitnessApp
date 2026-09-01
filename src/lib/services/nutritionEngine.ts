export type Sex = 'male' | 'female';
export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTREMELY_ACTIVE';

export type FitnessGoal =
  | 'FAT_LOSS'
  | 'BODY_RECOMPOSITION'
  | 'MUSCLE_GAIN'
  | 'STRENGTH_PERFORMANCE'
  | 'GENERAL_HEALTH'
  | 'HEALTHY_WEIGHT_GAIN';

export interface NutritionEngineInput {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  activityLevel: ActivityLevel;
  primaryGoal: FitnessGoal;
  customCalorieOffset?: number; // Optional coach override
}

export interface NutritionEngineResult {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  bmi: number;
  waistToHeightRatio: number;
  goalDeltaCalories: number;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTREMELY_ACTIVE: 1.9,
};

export const GOAL_DELTAS: Record<FitnessGoal, { calorieMultiplier: number; fixedDelta: number; proteinPerKg: number }> = {
  FAT_LOSS: { calorieMultiplier: 0.8, fixedDelta: -500, proteinPerKg: 2.2 },
  BODY_RECOMPOSITION: { calorieMultiplier: 1.0, fixedDelta: 0, proteinPerKg: 2.0 },
  MUSCLE_GAIN: { calorieMultiplier: 1.1, fixedDelta: 300, proteinPerKg: 2.0 },
  STRENGTH_PERFORMANCE: { calorieMultiplier: 1.08, fixedDelta: 250, proteinPerKg: 1.9 },
  GENERAL_HEALTH: { calorieMultiplier: 1.0, fixedDelta: 0, proteinPerKg: 1.6 },
  HEALTHY_WEIGHT_GAIN: { calorieMultiplier: 1.15, fixedDelta: 450, proteinPerKg: 1.8 },
};

/**
 * Calculates BMR using the Mifflin-St Jeor Equation.
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  if (sex.toLowerCase() === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

/**
 * Calculates TDEE based on BMR and Activity Level.
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Complete Nutrition Engine Calculation Service.
 * Implements safety checks to prevent dangerously low calories (< BMR or < 1200).
 */
export function calculateNutritionProfile(input: NutritionEngineInput): NutritionEngineResult {
  const bmr = calculateBMR(input.weightKg, input.heightCm, input.age, input.sex);
  const tdee = calculateTDEE(bmr, input.activityLevel);

  const goalConfig = GOAL_DELTAS[input.primaryGoal] || GOAL_DELTAS.FAT_LOSS;
  
  let targetCalories = Math.round(tdee * goalConfig.calorieMultiplier);

  if (input.customCalorieOffset) {
    targetCalories += input.customCalorieOffset;
  }

  // Safety floor: Never recommend calories below BMR or absolute minimum 1200 kcal
  const safeMinimum = Math.max(bmr * 0.9, 1200);
  if (targetCalories < safeMinimum) {
    targetCalories = Math.round(safeMinimum);
  }

  const goalDeltaCalories = targetCalories - tdee;

  // Protein calculation (g / kg bodyweight)
  const targetProteinG = Math.round(input.weightKg * goalConfig.proteinPerKg);
  const proteinCalories = targetProteinG * 4;

  // Fat calculation (25% of total calories)
  const fatCalories = targetCalories * 0.25;
  const targetFatG = Math.round(fatCalories / 9);

  // Carbohydrate calculation (Remaining calories)
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const targetCarbsG = Math.round(remainingCalories / 4);

  // Body Indices
  const heightM = input.heightCm / 100;
  const bmi = Math.round((input.weightKg / (heightM * heightM)) * 10) / 10;
  const waistToHeightRatio = Math.round((input.waistCm / input.heightCm) * 100) / 100;

  return {
    bmr,
    tdee,
    dailyCalories: targetCalories,
    targetProteinG,
    targetCarbsG,
    targetFatG,
    bmi,
    waistToHeightRatio,
    goalDeltaCalories,
  };
}
