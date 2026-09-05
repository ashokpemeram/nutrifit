import { FoodItem, UserProfile } from '../types';

export const INITIAL_FOOD_DATABASE: FoodItem[] = [
  // South Indian
  { _id: '1', name: 'Idli', category: 'South Indian', defaultUnit: 'piece', calories: 65, protein: 2.2, carbs: 14.0, fat: 0.2, fiber: 0.8, isIndian: true },
  { _id: '2', name: 'Plain Dosa', category: 'South Indian', defaultUnit: 'piece', calories: 130, protein: 3.5, carbs: 23.0, fat: 3.0, fiber: 1.2, isIndian: true },
  { _id: '3', name: 'Masala Dosa', category: 'South Indian', defaultUnit: 'piece', calories: 250, protein: 5.5, carbs: 38.0, fat: 9.0, fiber: 3.0, isIndian: true },
  { _id: '4', name: 'Medu Vada', category: 'South Indian', defaultUnit: 'piece', calories: 150, protein: 4.0, carbs: 16.0, fat: 8.0, fiber: 2.1, isIndian: true },
  { _id: '5', name: 'Mysore Bonda', category: 'South Indian', defaultUnit: 'piece', calories: 140, protein: 3.0, carbs: 18.0, fat: 6.5, fiber: 1.0, isIndian: true },
  { _id: '6', name: 'Upma', category: 'South Indian', defaultUnit: 'bowl', calories: 210, protein: 4.5, carbs: 35.0, fat: 6.0, fiber: 2.5, isIndian: true },
  { _id: '7', name: 'Ven Pongal', category: 'South Indian', defaultUnit: 'bowl', calories: 260, protein: 6.0, carbs: 40.0, fat: 8.5, fiber: 3.0, isIndian: true },
  { _id: '8', name: 'Puri', category: 'South Indian', defaultUnit: 'piece', calories: 120, protein: 2.0, carbs: 15.0, fat: 6.0, fiber: 1.0, isIndian: true },
  { _id: '9', name: 'Sambar', category: 'South Indian', defaultUnit: 'bowl', calories: 110, protein: 5.0, carbs: 18.0, fat: 2.5, fiber: 4.0, isIndian: true },
  { _id: '10', name: 'Coconut Chutney', category: 'South Indian', defaultUnit: 'tablespoon', calories: 45, protein: 0.8, carbs: 2.0, fat: 4.0, fiber: 1.1, isIndian: true },
  { _id: '11', name: 'Groundnut Chutney', category: 'South Indian', defaultUnit: 'tablespoon', calories: 60, protein: 2.5, carbs: 3.0, fat: 4.5, fiber: 1.0, isIndian: true },
  { _id: '12', name: 'Lemon Rice', category: 'South Indian', defaultUnit: 'bowl', calories: 270, protein: 4.5, carbs: 45.0, fat: 8.0, fiber: 2.0, isIndian: true },
  { _id: '13', name: 'Curd Rice', category: 'South Indian', defaultUnit: 'bowl', calories: 220, protein: 5.5, carbs: 34.0, fat: 7.0, fiber: 1.2, isIndian: true },

  // Rice & Meals
  { _id: '14', name: 'Cooked White Rice', category: 'Rice & Meals', defaultUnit: 'bowl', calories: 205, protein: 4.2, carbs: 45.0, fat: 0.4, fiber: 0.6, isIndian: true },
  { _id: '15', name: 'Cooked Brown Rice', category: 'Rice & Meals', defaultUnit: 'bowl', calories: 215, protein: 5.0, carbs: 45.0, fat: 1.8, fiber: 3.5, isIndian: false },
  { _id: '16', name: 'Dal Tadka', category: 'Rice & Meals', defaultUnit: 'bowl', calories: 180, protein: 9.0, carbs: 26.0, fat: 4.5, fiber: 6.0, isIndian: true },
  { _id: '17', name: 'Chicken Biryani', category: 'Rice & Meals', defaultUnit: 'plate', calories: 480, protein: 28.0, carbs: 55.0, fat: 16.0, fiber: 3.2, isIndian: true },
  { _id: '18', name: 'Veg Biryani', category: 'Rice & Meals', defaultUnit: 'plate', calories: 360, protein: 8.5, carbs: 58.0, fat: 11.0, fiber: 5.0, isIndian: true },
  { _id: '19', name: 'Chapati / Roti', category: 'Rice & Meals', defaultUnit: 'piece', calories: 85, protein: 3.0, carbs: 16.0, fat: 0.8, fiber: 2.5, isIndian: true },

  // Protein
  { _id: '20', name: 'Boiled Egg', category: 'Protein', defaultUnit: 'piece', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, isIndian: false },
  { _id: '21', name: 'Egg Omelette (2 Eggs)', category: 'Protein', defaultUnit: 'serving', calories: 210, protein: 13.0, carbs: 1.5, fat: 17.0, fiber: 0.2, isIndian: true },
  { _id: '22', name: 'Grilled Chicken Breast', category: 'Protein', defaultUnit: '100g', calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, isIndian: false },
  { _id: '23', name: 'Chicken Curry', category: 'Protein', defaultUnit: 'bowl', calories: 280, protein: 24.0, carbs: 8.0, fat: 17.0, fiber: 1.5, isIndian: true },
  { _id: '24', name: 'Paneer (Raw / Fresh)', category: 'Protein', defaultUnit: '100g', calories: 265, protein: 18.0, carbs: 3.5, fat: 20.0, fiber: 0, isIndian: true },
  { _id: '25', name: 'Whole Milk', category: 'Protein', defaultUnit: 'cup', calories: 150, protein: 8.0, carbs: 12.0, fat: 8.0, fiber: 0, isIndian: false },
  { _id: '26', name: 'Plain Curd / Dahi', category: 'Protein', defaultUnit: 'bowl', calories: 100, protein: 5.5, carbs: 7.0, fat: 6.0, fiber: 0, isIndian: true },

  // Snacks
  { _id: '27', name: 'Banana', category: 'Snacks', defaultUnit: 'piece', calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3, fiber: 3.1, isIndian: false },
  { _id: '28', name: 'Apple', category: 'Snacks', defaultUnit: 'piece', calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, fiber: 4.4, isIndian: false },
  { _id: '29', name: 'Roasted Peanuts', category: 'Snacks', defaultUnit: 'handful', calories: 165, protein: 7.3, carbs: 6.0, fat: 14.0, fiber: 2.4, isIndian: true },
  { _id: '30', name: 'Almonds', category: 'Snacks', defaultUnit: 'handful', calories: 160, protein: 6.0, carbs: 6.0, fat: 14.0, fiber: 3.5, isIndian: false },
];

export const DEFAULT_PROFILE: UserProfile = {
  age: 26,
  gender: 'male',
  heightCm: 175,
  currentWeightKg: 75,
  targetWeightKg: 70,
  activityLevel: 'moderate',
  goal: 'lose',
  weeklyTargetKg: 0.5,
  bmr: 1710,
  tdee: 2650,
  calorieTarget: 2000,
  customCalorieTarget: null,
  proteinTargetG: 120,
  carbTargetG: 220,
  fatTargetG: 65,
  fiberTargetG: 30,
  waterTargetMl: 2500,
  stepsGoal: 8000,
};
