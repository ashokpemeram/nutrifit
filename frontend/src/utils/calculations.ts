import { UserProfile } from '../types';

export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: string): number {
  const isMale = gender.toLowerCase() === 'male';
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(isMale ? base + 5 : base - 161);
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };
  const mult = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * mult);
}

export function calculateTargets(profile: Partial<UserProfile>): Partial<UserProfile> {
  const weightKg = profile.currentWeightKg || 75;
  const heightCm = profile.heightCm || 172;
  const age = profile.age || 25;
  const gender = profile.gender || 'male';
  const activityLevel = profile.activityLevel || 'moderate';
  const goal = profile.goal || 'lose';
  const weeklyTargetKg = profile.weeklyTargetKg || 0.5;

  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  let calorieAdj = 0;
  if (goal === 'lose') {
    calorieAdj = -Math.round((weeklyTargetKg * 7700) / 7);
  } else if (goal === 'gain') {
    calorieAdj = Math.round((weeklyTargetKg * 7700) / 7);
  }

  const minCal = gender === 'male' ? 1500 : 1200;
  const recommendedCalories = Math.max(minCal, tdee + calorieAdj);

  const proteinTargetG = Math.round(Math.max(weightKg * 1.8, (recommendedCalories * 0.25) / 4));
  const fatTargetG = Math.round((recommendedCalories * 0.25) / 9);
  const remainingCalForCarbs = recommendedCalories - proteinTargetG * 4 - fatTargetG * 9;
  const carbTargetG = Math.round(Math.max(50, remainingCalForCarbs / 4));
  const fiberTargetG = Math.round((recommendedCalories / 1000) * 14);
  const waterTargetMl = Math.round(weightKg * 35);

  return {
    bmr,
    tdee,
    calorieTarget: profile.customCalorieTarget || recommendedCalories,
    proteinTargetG,
    carbTargetG,
    fatTargetG,
    fiberTargetG,
    waterTargetMl,
  };
}
