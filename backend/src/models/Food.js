const mongoose = require('mongoose');

const servingSizeSchema = new mongoose.Schema({
  unit: { type: String, required: true }, // piece, gram, cup, bowl, plate, handful, etc.
  grams: { type: Number, default: 100 },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
});

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['South Indian', 'Rice & Meals', 'Protein', 'Snacks', 'Beverages', 'Custom'],
      default: 'Custom',
    },
    defaultUnit: { type: String, default: 'serving' },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    isIndian: { type: Boolean, default: false },
    servingSizes: [servingSizeSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null if system food
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
