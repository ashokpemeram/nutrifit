const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Weight', 'Calorie', 'Protein', 'Water', 'Exercise'],
      required: true,
    },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
