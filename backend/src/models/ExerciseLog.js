const mongoose = require('mongoose');

const exerciseLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    name: { type: String, required: true }, // Walking, Running, Cycling, Gym, Weight Training, Swimming, Sports, Custom
    durationMinutes: { type: Number, required: true },
    intensity: {
      type: String,
      enum: ['Light', 'Moderate', 'Vigorous'],
      default: 'Moderate',
    },
    caloriesBurned: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExerciseLog', exerciseLogSchema);
