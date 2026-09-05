export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
  goal: 'lose' | 'maintain' | 'gain';
  weeklyTargetKg: number;
  bmr: number;
  tdee: number;
  calorieTarget: number;
  customCalorieTarget: number | null;
  proteinTargetG: number;
  carbTargetG: number;
  fatTargetG: number;
  fiberTargetG: number;
  waterTargetMl: number;
  stepsGoal: number;
}

export interface UserNotifications {
  breakfastReminder: boolean;
  lunchReminder: boolean;
  dinnerReminder: boolean;
  waterReminder: boolean;
  exerciseReminder: boolean;
  weightReminder: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profile: UserProfile;
  notifications?: UserNotifications;
}

export interface ServingSize {
  unit: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItem {
  _id?: string;
  name: string;
  category: 'South Indian' | 'Rice & Meals' | 'Protein' | 'Snacks' | 'Beverages' | 'Custom';
  defaultUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  isIndian?: boolean;
  servingSizes?: ServingSize[];
}

export interface MealItem {
  _id?: string;
  foodId?: string;
  name: string;
  quantity: number;
  unit: string;
  portionSizeName?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealSection {
  items: MealItem[];
  totalCalories: number;
}

export interface DailyLog {
  _id?: string;
  date: string;
  meals: {
    Breakfast: MealSection;
    Lunch: MealSection;
    Dinner: MealSection;
    Snacks: MealSection;
  };
  totalCaloriesConsumed: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalFiberG: number;
  waterIntakeMl: number;
  steps: number;
}

export interface ExerciseEntry {
  _id?: string;
  date: string;
  name: string;
  durationMinutes: number;
  intensity: 'Light' | 'Moderate' | 'Vigorous';
  caloriesBurned: number;
}

export interface WeightEntry {
  _id?: string;
  date: string;
  weightKg: number;
  weeklyAverageKg?: number;
  notes?: string;
}

export interface Goal {
  _id?: string;
  title: string;
  category: 'Weight' | 'Calorie' | 'Protein' | 'Water' | 'Exercise';
  targetValue: number;
  currentValue: number;
  unit: string;
  isCompleted: boolean;
  dueDate?: string;
}
