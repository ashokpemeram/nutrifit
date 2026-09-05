// Preset AI detection templates for realistic food photo scanning simulation
const AI_MEAL_PRESETS = [
  {
    detectedMeal: 'South Indian Breakfast Thali',
    confidence: '94%',
    items: [
      { name: 'Plain Dosa', quantity: 2, unit: 'piece', calories: 260, protein: 7.0, carbs: 46.0, fat: 6.0, fiber: 2.4 },
      { name: 'Coconut Chutney', quantity: 2, unit: 'tablespoon', calories: 90, protein: 1.6, carbs: 4.0, fat: 8.0, fiber: 2.2 },
      { name: 'Sambar', quantity: 1, unit: 'bowl', calories: 110, protein: 5.0, carbs: 18.0, fat: 2.5, fiber: 4.0 },
    ],
    estimatedCalorieRange: '450 - 520 kcal',
  },
  {
    detectedMeal: 'North Indian Meal (Roti + Dal + Rice)',
    confidence: '91%',
    items: [
      { name: 'Chapati / Roti', quantity: 2, unit: 'piece', calories: 170, protein: 6.0, carbs: 32.0, fat: 1.6, fiber: 5.0 },
      { name: 'Yellow Dal Tadka', quantity: 1, unit: 'bowl', calories: 180, protein: 9.0, carbs: 26.0, fat: 4.5, fiber: 6.0 },
      { name: 'Cooked White Rice', quantity: 1, unit: 'bowl', calories: 205, protein: 4.2, carbs: 45.0, fat: 0.4, fiber: 0.6 },
    ],
    estimatedCalorieRange: '520 - 600 kcal',
  },
  {
    detectedMeal: 'High Protein Chicken & Rice Bowl',
    confidence: '96%',
    items: [
      { name: 'Grilled Chicken Breast', quantity: 1, unit: '150g piece', calories: 247, protein: 46.5, carbs: 0, fat: 5.4, fiber: 0 },
      { name: 'Cooked Brown Rice', quantity: 1, unit: 'bowl', calories: 215, protein: 5.0, carbs: 45.0, fat: 1.8, fiber: 3.5 },
    ],
    estimatedCalorieRange: '440 - 490 kcal',
  },
  {
    detectedMeal: 'Idli Sambar Combo',
    confidence: '95%',
    items: [
      { name: 'Idli', quantity: 3, unit: 'piece', calories: 195, protein: 6.6, carbs: 42.0, fat: 0.6, fiber: 2.4 },
      { name: 'Sambar', quantity: 1, unit: 'bowl', calories: 110, protein: 5.0, carbs: 18.0, fat: 2.5, fiber: 4.0 },
      { name: 'Groundnut Chutney (Peanut)', quantity: 1, unit: 'small bowl', calories: 150, protein: 6.2, carbs: 7.5, fat: 11.2, fiber: 2.5 },
    ],
    estimatedCalorieRange: '430 - 480 kcal',
  },
];

// @desc    Scan meal photo (AI computer vision simulation)
// @route   POST /api/ai/scan-meal
const scanMealPhoto = async (req, res) => {
  try {
    // Pick preset or randomize based on prompt/image hint
    const randomIndex = Math.floor(Math.random() * AI_MEAL_PRESETS.length);
    const selectedPreset = AI_MEAL_PRESETS[randomIndex];

    // Add brief artificial latency for camera scan feel
    setTimeout(() => {
      res.json({
        success: true,
        disclaimer: 'AI nutrition estimates are approximate. Please verify portions before saving.',
        data: selectedPreset,
      });
    }, 600);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scanMealPhoto,
};
