const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unit: { type: String, required: true, default: 'serving' },
  portionSizeName: { type: String, default: '' }, // e.g. "1 serving"
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
});

const mealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    required: true,
  },
  items: [mealItemSchema],
  totalCalories: { type: Number, default: 0 },
});

const dailyLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format YYYY-MM-DD
    meals: {
      Breakfast: { items: [mealItemSchema], totalCalories: { type: Number, default: 0 } },
      Lunch: { items: [mealItemSchema], totalCalories: { type: Number, default: 0 } },
      Dinner: { items: [mealItemSchema], totalCalories: { type: Number, default: 0 } },
      Snacks: { items: [mealItemSchema], totalCalories: { type: Number, default: 0 } },
    },
    totalCaloriesConsumed: { type: Number, default: 0 },
    totalProteinG: { type: Number, default: 0 },
    totalCarbsG: { type: Number, default: 0 },
    totalFatG: { type: Number, default: 0 },
    totalFiberG: { type: Number, default: 0 },
    waterIntakeMl: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
  },
  { timestamps: true }
);

dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
