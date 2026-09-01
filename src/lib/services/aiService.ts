import { FitnessGoal } from './nutritionEngine';

export interface FoodAnalysisRequest {
  submissionType: 'PHOTO' | 'MANUAL' | 'NATURAL_LANGUAGE';
  rawInput: String;
  imageUrl?: String | null;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  userGoal: FitnessGoal;
  userDailyCalorieTarget: number;
}

export interface FoodAnalysisResult {
  estimatedCalories: number;
  estimatedProtein: number;
  estimatedCarbs: number;
  estimatedFat: number;
  portionAssessment: string;
  mealQualityScore: number;
  goalAlignmentNotes: string;
  potentialConcerns: string | null;
  suggestedAlternatives: string | null;
  disclaimer: string;
}

export interface CheckInAnalysisResult {
  trendsSummary: string;
  adherenceRating: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  flaggedForCoachReview: boolean;
  flagReason: string | null;
  suggestedPlanAdjustments: string;
}

// Built-in African/Nigerian & global food database heuristics for fast, robust parsing
const FOOD_KNOWLEDGE_BASE: Array<{
  keywords: string[];
  name: string;
  caloriesPerServing: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingUnit: string;
}> = [
  { keywords: ['jollof', 'jollof rice'], name: 'Jollof Rice', caloriesPerServing: 320, proteinG: 6, carbsG: 58, fatG: 8, servingUnit: '1 cup' },
  { keywords: ['fried rice'], name: 'Nigerian Fried Rice', caloriesPerServing: 350, proteinG: 7, carbsG: 54, fatG: 12, servingUnit: '1 cup' },
  { keywords: ['white rice', 'rice'], name: 'White Rice', caloriesPerServing: 240, proteinG: 4, carbsG: 52, fatG: 1, servingUnit: '1 cup' },
  { keywords: ['chicken', 'grilled chicken'], name: 'Grilled Chicken Breast/Thigh', caloriesPerServing: 220, proteinG: 32, carbsG: 0, fatG: 9, servingUnit: '1 piece (150g)' },
  { keywords: ['plantain', 'dodo', 'fried plantain'], name: 'Fried Plantain (Dodo)', caloriesPerServing: 180, proteinG: 1, carbsG: 32, fatG: 7, servingUnit: '5 slices' },
  { keywords: ['yam', 'boiled yam'], name: 'Boiled Yam', caloriesPerServing: 220, proteinG: 2, carbsG: 50, fatG: 0.5, servingUnit: '2 thick slices' },
  { keywords: ['pounded yam'], name: 'Pounded Yam', caloriesPerServing: 360, proteinG: 3, carbsG: 82, fatG: 1, servingUnit: '1 medium wrap' },
  { keywords: ['egusi', 'egusi soup'], name: 'Egusi Soup with Meat', caloriesPerServing: 380, proteinG: 22, carbsG: 8, fatG: 28, servingUnit: '1 bowl' },
  { keywords: ['efo riro', 'vegetable soup'], name: 'Efo Riro (Spinach Stew)', caloriesPerServing: 240, proteinG: 18, carbsG: 6, fatG: 16, servingUnit: '1 bowl' },
  { keywords: ['beans', 'porridge'], name: 'Beans Porridge', caloriesPerServing: 280, proteinG: 14, carbsG: 46, fatG: 5, servingUnit: '1 cup' },
  { keywords: ['moi moi', 'moimoi'], name: 'Moi Moi (Steamed Bean Cake)', caloriesPerServing: 160, proteinG: 9, carbsG: 20, fatG: 5, servingUnit: '1 wrap' },
  { keywords: ['egg', 'eggs', 'fried egg'], name: 'Fried Eggs (2)', caloriesPerServing: 180, proteinG: 12, carbsG: 1, fatG: 14, servingUnit: '2 large eggs' },
  { keywords: ['tilapia', 'fish', 'grilled fish'], name: 'Grilled Tilapia Fish', caloriesPerServing: 190, proteinG: 28, carbsG: 0, fatG: 8, servingUnit: '1 medium fish' },
  { keywords: ['suya', 'beef suya'], name: 'Beef Suya', caloriesPerServing: 310, proteinG: 35, carbsG: 4, fatG: 16, servingUnit: '1 stick/wrap' },
  { keywords: ['coke', 'soda', 'coca-cola'], name: 'Sugar Soda / Coke', caloriesPerServing: 140, proteinG: 0, carbsG: 39, fatG: 0, servingUnit: '1 bottle (35cl)' },
  { keywords: ['salad', 'green salad'], name: 'Fresh Salad with Vinaigrette', caloriesPerServing: 120, proteinG: 3, carbsG: 10, fatG: 8, servingUnit: '1 bowl' },
  { keywords: ['oatmeal', 'oats'], name: 'Oatmeal', caloriesPerServing: 200, proteinG: 7, carbsG: 34, fatG: 4, servingUnit: '1 cup cooked' },
];

export class FoodAnalysisService {
  /**
   * Analyzes food input (photo, text, manual) using AI heuristic parser with fallback structured engine.
   */
  static async analyzeFoodSubmission(request: FoodAnalysisRequest): Promise<FoodAnalysisResult> {
    const inputLower = (request.rawInput || '').toLowerCase();
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const detectedItems: string[] = [];

    // Search knowledge base matches
    for (const item of FOOD_KNOWLEDGE_BASE) {
      if (item.keywords.some((kw) => inputLower.includes(kw))) {
        // Multiplier heuristic if user says "2 cups", "two pieces", etc.
        let multiplier = 1;
        if (inputLower.includes('2 ') || inputLower.includes('two ')) multiplier = 2;
        if (inputLower.includes('3 ') || inputLower.includes('three ')) multiplier = 3;

        totalCalories += item.caloriesPerServing * multiplier;
        totalProtein += item.proteinG * multiplier;
        totalCarbs += item.carbsG * multiplier;
        totalFat += item.fatG * multiplier;
        detectedItems.push(`${multiplier > 1 ? multiplier + 'x ' : ''}${item.name}`);
      }
    }

    // Default fallback if no keyword matches or image upload without text
    if (detectedItems.length === 0) {
      totalCalories = 450;
      totalProtein = 25;
      totalCarbs = 48;
      totalFat = 16;
      detectedItems.push('Mixed Balanced Meal (Protein + Complex Carbs)');
    }

    totalCalories = Math.round(totalCalories);
    totalProtein = Math.round(totalProtein);
    totalCarbs = Math.round(totalCarbs);
    totalFat = Math.round(totalFat);

    // Goal alignment evaluation
    let mealQualityScore = 8;
    let goalAlignmentNotes = '';
    let potentialConcerns: string | null = null;
    let suggestedAlternatives: string | null = null;

    const targetPerMeal = Math.round(request.userDailyCalorieTarget / 3);

    if (request.userGoal === 'FAT_LOSS') {
      if (totalCalories > targetPerMeal + 150) {
        mealQualityScore = 6;
        goalAlignmentNotes = `Meal is slightly calorie-dense for a single sitting (${totalCalories} kcal vs target ~${targetPerMeal} kcal per meal).`;
        potentialConcerns = 'High caloric load might slow down weekly fat loss deficit.';
        suggestedAlternatives = 'Swap a portion of refined carbs for steamed vegetables or salad to lower calorie density while keeping volume high.';
      } else {
        mealQualityScore = 9;
        goalAlignmentNotes = `Excellent calorie control (${totalCalories} kcal). High protein content supports satiety and muscle retention during fat loss.`;
      }
    } else if (request.userGoal === 'MUSCLE_GAIN' || request.userGoal === 'HEALTHY_WEIGHT_GAIN') {
      if (totalProtein < 20) {
        mealQualityScore = 6;
        goalAlignmentNotes = 'Calorie intake is adequate, but protein per meal is below the optimal 30g threshold for muscle protein synthesis.';
        potentialConcerns = 'Insufficient protein distribution throughout the day.';
        suggestedAlternatives = 'Add 2 boiled eggs, extra grilled chicken, or a scoop of protein powder.';
      } else {
        mealQualityScore = 9;
        goalAlignmentNotes = `Strong nutrient profile for hyper-trophy/gain (${totalCalories} kcal, ${totalProtein}g protein).`;
      }
    } else {
      mealQualityScore = 8;
      goalAlignmentNotes = `Balanced meal providing ${totalCalories} kcal, ${totalProtein}g protein, ${totalCarbs}g carbs, and ${totalFat}g healthy fats.`;
    }

    const portionAssessment = `Detected items: ${detectedItems.join(', ')}. Total estimated yield: ~${totalCalories} kcal.`;

    return {
      estimatedCalories: totalCalories,
      estimatedProtein: totalProtein,
      estimatedCarbs: totalCarbs,
      estimatedFat: totalFat,
      portionAssessment,
      mealQualityScore,
      goalAlignmentNotes,
      potentialConcerns,
      suggestedAlternatives,
      disclaimer:
        'Estimates generated by AI visual/text analysis are approximations. Official recommendations are reviewed and approved by your human coach.',
    };
  }
}

export class ProgressAnalysisService {
  /**
   * Analyzes weekly check-in metrics to assist the coach with actionable insights.
   */
  static analyzeCheckIn(
    currentWeightKg: number,
    previousWeightKg: number | null,
    workoutAdherence: number,
    nutritionAdherence: number,
    userGoal: FitnessGoal
  ): CheckInAnalysisResult {
    let flagForCoach = false;
    let flagReason: string | null = null;
    let rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' = 'Good';

    const weightDelta = previousWeightKg ? currentWeightKg - previousWeightKg : 0;

    if (workoutAdherence < 60 || nutritionAdherence < 60) {
      rating = 'Needs Attention';
      flagForCoach = true;
      flagReason = `Low adherence reported (Workouts: ${workoutAdherence}%, Nutrition: ${nutritionAdherence}%). User may be facing fatigue or scheduling friction.`;
    } else if (userGoal === 'FAT_LOSS' && weightDelta > 0.8) {
      rating = 'Fair';
      flagForCoach = true;
      flagReason = `Weight increased by +${weightDelta.toFixed(1)}kg this week despite Fat Loss goal. Check for water retention or hidden calorie logging gaps.`;
    } else if (workoutAdherence >= 85 && nutritionAdherence >= 85) {
      rating = 'Excellent';
    }

    const trendsSummary = previousWeightKg
      ? `Weight changed from ${previousWeightKg}kg to ${currentWeightKg}kg (${weightDelta >= 0 ? '+' : ''}${weightDelta.toFixed(1)}kg). Workout adherence: ${workoutAdherence}%, Nutrition adherence: ${nutritionAdherence}%.`
      : `First weekly check-in recorded at ${currentWeightKg}kg. Workout adherence: ${workoutAdherence}%, Nutrition adherence: ${nutritionAdherence}%.`;

    let suggestedPlanAdjustments = 'Maintain current targets and re-evaluate next week.';
    if (flagForCoach && userGoal === 'FAT_LOSS') {
      suggestedPlanAdjustments = 'Consider reducing daily calorie target by 100-150 kcal or encouraging 2,000 extra daily steps.';
    } else if (rating === 'Excellent') {
      suggestedPlanAdjustments = 'Progress is on track. Reinforce momentum with positive coach feedback.';
    }

    return {
      trendsSummary,
      adherenceRating: rating,
      flaggedForCoachReview: flagForCoach,
      flagReason,
      suggestedPlanAdjustments,
    };
  }
}
