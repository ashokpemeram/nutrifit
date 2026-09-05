const Food = require('../models/Food');
const User = require('../models/User');
const initialFoodItems = require('../utils/indianFoodSeed');

// Helper to seed initial Indian foods if database is empty
const ensureFoodSeeded = async () => {
  const count = await Food.countDocuments();
  if (count === 0) {
    console.log('[Food DB] Seeding initial Indian food items...');
    await Food.insertMany(initialFoodItems);
  }
};

// @desc    Get / Search foods
// @route   GET /api/foods
const getFoods = async (req, res) => {
  try {
    await ensureFoodSeeded();

    const { query, category, isIndian, frequentOnly } = req.query;
    let filter = {};

    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (isIndian === 'true') {
      filter.isIndian = true;
    }

    // Filter user's custom foods OR system foods
    filter.$or = [{ createdBy: null }, { createdBy: req.user._id }];

    if (frequentOnly === 'true') {
      const user = await User.findById(req.user._id);
      if (user && user.frequentFoodIds && user.frequentFoodIds.length > 0) {
        filter._id = { $in: user.frequentFoodIds };
      }
    }

    const foods = await Food.find(filter).sort({ name: 1 }).limit(50);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add custom food
// @route   POST /api/foods
const createCustomFood = async (req, res) => {
  try {
    const { name, category, defaultUnit, calories, protein, carbs, fat, fiber, servingSizes } = req.body;

    if (!name || calories === undefined) {
      return res.status(400).json({ message: 'Name and calories are required' });
    }

    const food = await Food.create({
      name,
      category: category || 'Custom',
      defaultUnit: defaultUnit || 'serving',
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      fiber: Number(fiber) || 0,
      isIndian: req.body.isIndian || false,
      servingSizes: servingSizes || [
        { unit: defaultUnit || 'serving', grams: 100, calories: Number(calories), protein: Number(protein) || 0, carbs: Number(carbs) || 0, fat: Number(fat) || 0, fiber: Number(fiber) || 0 }
      ],
      createdBy: req.user._id,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle frequent food for user
// @route   POST /api/foods/:id/frequent
const toggleFrequentFood = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const foodId = req.params.id;

    if (!user.frequentFoodIds) {
      user.frequentFoodIds = [];
    }

    const existsIndex = user.frequentFoodIds.findIndex((id) => id.toString() === foodId);
    if (existsIndex > -1) {
      user.frequentFoodIds.splice(existsIndex, 1);
    } else {
      user.frequentFoodIds.push(foodId);
    }

    await user.save();
    res.json({ frequentFoodIds: user.frequentFoodIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFoods,
  createCustomFood,
  toggleFrequentFood,
};
