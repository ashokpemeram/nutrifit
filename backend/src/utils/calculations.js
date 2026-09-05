/**
 * Calculates BMR using the Mifflin-St Jeor Equation
 * Male: (10 * kg) + (6.25 * cm) - (5 * age) + 5
 * Female: (10 * kg) + (6.25 * cm) - (5 * age) - 161
 */
function calculateBMR(weightKg, heightCm, age, gender) {
  const isMale = gender.toLowerCase() === 'male';
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(isMale ? base + 5 : base - 161);
}

/**
 * Calculates TDEE based on activity level
 */
function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };
  const multiplier = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates recommended daily calories and macros
 */
function calculateTargets(profile) {
  const { currentWeightKg: weightKg, heightCm, age, gender, activityLevel, goal, weeklyTargetKg = 0.5 } = profile;
  
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  let calorieAdjustment = 0;
  if (goal === 'lose') {
    // 1 kg fat ~ 7700 kcal -> 0.5 kg/week ~ -500 kcal/day
    calorieAdjustment = -Math.round((weeklyTargetKg * 7700) / 7);
  } else if (goal === 'gain') {
    calorieAdjustment = Math.round((weeklyTargetKg * 7700) / 7);
  }

  // Set safe minimum calorie floor
  const minCalories = gender.toLowerCase() === 'male' ? 1500 : 1200;
  const recommendedCalories = Math.max(minCalories, tdee + calorieAdjustment);

  // Protein calculation: ~1.8g per kg for loss/gain or 25% of calories
  const proteinGrams = Math.round(Math.max(weightKg * 1.8, (recommendedCalories * 0.25) / 4));

  // Fat calculation: ~25% of calories (9 kcal per gram)
  const fatGrams = Math.round((recommendedCalories * 0.25) / 9);

  // Remaining calories to Carbohydrates (4 kcal per gram)
  const remainingCaloriesForCarbs = recommendedCalories - proteinGrams * 4 - fatGrams * 9;
  const carbGrams = Math.round(Math.max(50, remainingCaloriesForCarbs / 4));

  // Fiber calculation: ~14g per 1000 kcal
  const fiberGrams = Math.round((recommendedCalories / 1000) * 14);

  return {
    bmr,
    tdee,
    recommendedCalories,
    proteinTarget: proteinGrams,
    carbTarget: carbGrams,
    fatTarget: fatGrams,
    fiberTarget: fiberGrams,
    waterTargetMl: Math.round(weightKg * 35), // ~35ml per kg body weight
  };
}

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateTargets,
};
