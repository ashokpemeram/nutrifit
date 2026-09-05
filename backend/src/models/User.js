const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profile: {
      age: { type: Number, default: 25 },
      gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
      heightCm: { type: Number, default: 172 },
      currentWeightKg: { type: Number, default: 75 },
      targetWeightKg: { type: Number, default: 70 },
      activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'extra'],
        default: 'moderate',
      },
      goal: {
        type: String,
        enum: ['lose', 'maintain', 'gain'],
        default: 'lose',
      },
      weeklyTargetKg: { type: Number, default: 0.5 },
      bmr: { type: Number, default: 1650 },
      tdee: { type: Number, default: 2350 },
      calorieTarget: { type: Number, default: 1850 },
      customCalorieTarget: { type: Number, default: null }, // Manual override
      proteinTargetG: { type: Number, default: 120 },
      carbTargetG: { type: Number, default: 210 },
      fatTargetG: { type: Number, default: 55 },
      fiberTargetG: { type: Number, default: 28 },
      waterTargetMl: { type: Number, default: 2500 },
      stepsGoal: { type: Number, default: 8000 },
    },
    notifications: {
      breakfastReminder: { type: Boolean, default: true },
      lunchReminder: { type: Boolean, default: true },
      dinnerReminder: { type: Boolean, default: true },
      waterReminder: { type: Boolean, default: true },
      exerciseReminder: { type: Boolean, default: true },
      weightReminder: { type: Boolean, default: true },
    },
    frequentFoodIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
