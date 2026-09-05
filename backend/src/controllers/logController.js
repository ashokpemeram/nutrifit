const DailyLog = require('../models/DailyLog');

// Helper to recalculate daily totals
const recalculateDailyLogTotals = (dailyLog) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  mealTypes.forEach((type) => {
    if (!dailyLog.meals[type]) {
      dailyLog.meals[type] = { items: [], totalCalories: 0 };
    }

    let mealCal = 0;
    dailyLog.meals[type].items.forEach((item) => {
      mealCal += item.calories || 0;
      totalProtein += item.protein || 0;
      totalCarbs += item.carbs || 0;
      totalFat += item.fat || 0;
      totalFiber += item.fiber || 0;
    });

    dailyLog.meals[type].totalCalories = Math.round(mealCal);
    totalCalories += mealCal;
  });

  dailyLog.totalCaloriesConsumed = Math.round(totalCalories);
  dailyLog.totalProteinG = Math.round(totalProtein * 10) / 10;
  dailyLog.totalCarbsG = Math.round(totalCarbs * 10) / 10;
  dailyLog.totalFatG = Math.round(totalFat * 10) / 10;
  dailyLog.totalFiberG = Math.round(totalFiber * 10) / 10;
};

// @desc    Get daily log for date (YYYY-MM-DD)
// @route   GET /api/logs/:date
const getDailyLogByDate = async (req, res) => {
  try {
    const { date } = req.params;
    let log = await DailyLog.findOne({ user: req.user._id, date });

    if (!log) {
      log = await DailyLog.create({
        user: req.user._id,
        date,
        meals: {
          Breakfast: { items: [], totalCalories: 0 },
          Lunch: { items: [], totalCalories: 0 },
          Dinner: { items: [], totalCalories: 0 },
          Snacks: { items: [], totalCalories: 0 },
        },
      });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to a meal
// @route   POST /api/logs/:date/meals/:mealType
const addMealItem = async (req, res) => {
  try {
    const { date, mealType } = req.params;
    const { foodId, name, quantity, unit, portionSizeName, calories, protein, carbs, fat, fiber } = req.body;

    let log = await DailyLog.findOne({ user: req.user._id, date });
    if (!log) {
      log = new DailyLog({
        user: req.user._id,
        date,
        meals: {
          Breakfast: { items: [], totalCalories: 0 },
          Lunch: { items: [], totalCalories: 0 },
          Dinner: { items: [], totalCalories: 0 },
          Snacks: { items: [], totalCalories: 0 },
        },
      });
    }

    if (!log.meals[mealType]) {
      log.meals[mealType] = { items: [], totalCalories: 0 };
    }

    const newItem = {
      foodId: foodId || null,
      name,
      quantity: Number(quantity) || 1,
      unit: unit || 'serving',
      portionSizeName: portionSizeName || '',
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      fiber: Number(fiber) || 0,
    };

    log.meals[mealType].items.push(newItem);
    recalculateDailyLogTotals(log);

    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete meal item
// @route   DELETE /api/logs/:date/meals/:mealType/items/:itemId
const deleteMealItem = async (req, res) => {
  try {
    const { date, mealType, itemId } = req.params;

    const log = await DailyLog.findOne({ user: req.user._id, date });
    if (!log || !log.meals[mealType]) {
      return res.status(404).json({ message: 'Log or meal not found' });
    }

    log.meals[mealType].items = log.meals[mealType].items.filter(
      (item) => item._id.toString() !== itemId
    );

    recalculateDailyLogTotals(log);
    await log.save();

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Duplicate meal from previous date
// @route   POST /api/logs/:date/meals/:mealType/duplicate
const duplicateMeal = async (req, res) => {
  try {
    const { date, mealType } = req.params;
    const { sourceDate, sourceMealType } = req.body;

    const sourceLog = await DailyLog.findOne({ user: req.user._id, date: sourceDate });
    if (!sourceLog || !sourceLog.meals[sourceMealType || mealType]?.items.length) {
      return res.status(404).json({ message: 'Source meal not found or empty' });
    }

    let targetLog = await DailyLog.findOne({ user: req.user._id, date });
    if (!targetLog) {
      targetLog = new DailyLog({
        user: req.user._id,
        date,
        meals: {
          Breakfast: { items: [], totalCalories: 0 },
          Lunch: { items: [], totalCalories: 0 },
          Dinner: { items: [], totalCalories: 0 },
          Snacks: { items: [], totalCalories: 0 },
        },
      });
    }

    const itemsToCopy = sourceLog.meals[sourceMealType || mealType].items.map((item) => ({
      foodId: item.foodId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      portionSizeName: item.portionSizeName,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
    }));

    targetLog.meals[mealType].items.push(...itemsToCopy);
    recalculateDailyLogTotals(targetLog);

    await targetLog.save();
    res.json(targetLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update water intake
// @route   PUT /api/logs/:date/water
const updateWaterIntake = async (req, res) => {
  try {
    const { date } = req.params;
    const { amountMl, mode } = req.body; // mode: 'add' or 'set'

    let log = await DailyLog.findOne({ user: req.user._id, date });
    if (!log) {
      log = new DailyLog({
        user: req.user._id,
        date,
        meals: {
          Breakfast: { items: [], totalCalories: 0 },
          Lunch: { items: [], totalCalories: 0 },
          Dinner: { items: [], totalCalories: 0 },
          Snacks: { items: [], totalCalories: 0 },
        },
      });
    }

    if (mode === 'add') {
      log.waterIntakeMl = Math.max(0, log.waterIntakeMl + Number(amountMl));
    } else {
      log.waterIntakeMl = Math.max(0, Number(amountMl));
    }

    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update steps
// @route   PUT /api/logs/:date/steps
const updateSteps = async (req, res) => {
  try {
    const { date } = req.params;
    const { steps } = req.body;

    let log = await DailyLog.findOne({ user: req.user._id, date });
    if (!log) {
      log = new DailyLog({ user: req.user._id, date });
    }

    log.steps = Math.max(0, Number(steps));
    await log.save();

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDailyLogByDate,
  addMealItem,
  deleteMealItem,
  duplicateMeal,
  updateWaterIntake,
  updateSteps,
};
