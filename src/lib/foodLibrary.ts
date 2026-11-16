/** Quick-pick foods for the meal composer's search. Estimates per stated portion. */
export const FOOD_LIBRARY = [
  { name: 'Jollof rice', portion: '1 cup cooked', kcal: 320, protein: 6, carbs: 58, fat: 8 },
  { name: 'White rice', portion: '1 cup cooked', kcal: 240, protein: 4, carbs: 53, fat: 0 },
  { name: 'Grilled chicken breast', portion: '150 g', kcal: 220, protein: 32, carbs: 0, fat: 9 },
  { name: 'Fried plantain (dodo)', portion: '5 slices', kcal: 180, protein: 1, carbs: 32, fat: 7 },
  { name: 'Boiled plantain', portion: '1 medium', kcal: 220, protein: 2, carbs: 57, fat: 1 },
  { name: 'Pounded yam', portion: '1 wrap', kcal: 360, protein: 3, carbs: 82, fat: 1 },
  { name: 'Eba', portion: '1 wrap', kcal: 330, protein: 1, carbs: 80, fat: 1 },
  { name: 'Boiled yam', portion: '200 g', kcal: 230, protein: 3, carbs: 55, fat: 0 },
  { name: 'Egusi soup with meat', portion: '1 bowl', kcal: 380, protein: 22, carbs: 8, fat: 28 },
  { name: 'Efo riro', portion: '1 bowl', kcal: 240, protein: 18, carbs: 6, fat: 16 },
  { name: 'Moi moi', portion: '1 wrap', kcal: 160, protein: 9, carbs: 20, fat: 5 },
  { name: 'Beans porridge', portion: '1 cup', kcal: 280, protein: 15, carbs: 42, fat: 6 },
  { name: 'Grilled tilapia', portion: '1 fish', kcal: 190, protein: 28, carbs: 0, fat: 8 },
  { name: 'Suya', portion: '100 g', kcal: 260, protein: 25, carbs: 4, fat: 16 },
  { name: 'Boiled eggs', portion: '2 large', kcal: 140, protein: 12, carbs: 1, fat: 10 },
  { name: 'Oats', portion: '60 g dry', kcal: 230, protein: 8, carbs: 40, fat: 4 },
  { name: 'Greek yoghurt', portion: '170 g', kcal: 100, protein: 17, carbs: 6, fat: 1 },
  { name: 'Groundnuts', portion: '20 g', kcal: 115, protein: 5, carbs: 3, fat: 10 },
  { name: 'Banana', portion: '1 medium', kcal: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Akara', portion: '4 balls', kcal: 220, protein: 9, carbs: 14, fat: 14 },
] as const;

export type FoodItem = (typeof FOOD_LIBRARY)[number];
