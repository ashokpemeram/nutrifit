const DailyLog = require('../models/DailyLog');
const ExerciseLog = require('../models/ExerciseLog');
const WeightLog = require('../models/WeightLog');
const User = require('../models/User');

// Helper to format date YYYY-MM-DD
const formatDate = (d) => d.toISOString().split('T')[0];

// @desc    Get weekly / monthly progress stats
// @route   GET /api/progress
const getProgressStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysNum = parseInt(days, 10);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (daysNum - 1));

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    const user = await User.findById(req.user._id);
    const calorieTarget = user.profile?.calorieTarget || 2000;
    const proteinTarget = user.profile?.proteinTargetG || 120;

    // Fetch Daily Logs
    const dailyLogs = await DailyLog.find({
      user: req.user._id,
      date: { $gte: startDateStr, $lte: endDateStr },
    }).sort({ date: 1 });

    // Fetch Exercises
    const exerciseLogs = await ExerciseLog.find({
      user: req.user._id,
      date: { $gte: startDateStr, $lte: endDateStr },
    });

    // Fetch Weights
    const weightLogs = await WeightLog.find({
      user: req.user._id,
      date: { $gte: startDateStr, $lte: endDateStr },
    }).sort({ date: 1 });

    // Build day-by-day continuous timeline map
    const timeline = [];
    let cur = new Date(startDate);

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalWater = 0;
    let totalExerciseCal = 0;
    let daysCalorieTargetAchieved = 0;
    let daysProteinTargetAchieved = 0;

    while (cur <= endDate) {
      const dStr = formatDate(cur);
      const log = dailyLogs.find((l) => l.date === dStr);
      const exForDay = exerciseLogs.filter((e) => e.date === dStr);
      const wtForDay = weightLogs.find((w) => w.date === dStr);

      const caloriesConsumed = log ? log.totalCaloriesConsumed : 0;
      const proteinG = log ? log.totalProteinG : 0;
      const carbsG = log ? log.totalCarbsG : 0;
      const fatG = log ? log.totalFatG : 0;
      const waterMl = log ? log.waterIntakeMl : 0;

      const exerciseCal = exForDay.reduce((sum, item) => sum + item.caloriesBurned, 0);

      totalCalories += caloriesConsumed;
      totalProtein += proteinG;
      totalCarbs += carbsG;
      totalFat += fatG;
      totalWater += waterMl;
      totalExerciseCal += exerciseCal;

      // Check target hits
      if (caloriesConsumed > 0 && Math.abs(caloriesConsumed - calorieTarget) <= 150) {
        daysCalorieTargetAchieved++;
      }
      if (proteinG >= proteinTarget * 0.9) {
        daysProteinTargetAchieved++;
      }

      timeline.push({
        date: dStr,
        dayLabel: new Date(dStr).toLocaleDateString('en-US', { weekday: 'short' }),
        caloriesConsumed,
        calorieTarget,
        proteinG,
        proteinTarget,
        carbsG,
        fatG,
        waterMl,
        exerciseCal,
        weightKg: wtForDay ? wtForDay.weightKg : null,
      });

      cur.setDate(cur.getDate() + 1);
    }

    const activeDaysCount = dailyLogs.filter((l) => l.totalCaloriesConsumed > 0).length || 1;

    res.json({
      summary: {
        daysCount: daysNum,
        averageCalories: Math.round(totalCalories / activeDaysCount),
        averageProtein: Math.round(totalProtein / activeDaysCount),
        averageCarbs: Math.round(totalCarbs / activeDaysCount),
        averageFat: Math.round(totalFat / activeDaysCount),
        averageWaterMl: Math.round(totalWater / activeDaysCount),
        averageExerciseCal: Math.round(totalExerciseCal / daysNum),
        daysCalorieTargetAchieved,
        daysProteinTargetAchieved,
        weightChangeKg: weightLogs.length >= 2 ? Math.round((weightLogs[weightLogs.length - 1].weightKg - weightLogs[0].weightKg) * 10) / 10 : 0,
      },
      timeline,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProgressStats,
};
