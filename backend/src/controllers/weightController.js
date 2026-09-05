const WeightLog = require('../models/WeightLog');
const User = require('../models/User');

// @desc    Get weight logs & 7-day rolling averages
// @route   GET /api/weight
const getWeightLogs = async (req, res) => {
  try {
    const logs = await WeightLog.find({ user: req.user._id }).sort({ date: 1 });

    // Calculate 7-day moving average
    const logsWithMovingAvg = logs.map((entry, idx, arr) => {
      const windowStart = Math.max(0, idx - 6);
      const window = arr.slice(windowStart, idx + 1);
      const avg = window.reduce((acc, curr) => acc + curr.weightKg, 0) / window.length;

      return {
        _id: entry._id,
        date: entry.date,
        weightKg: entry.weightKg,
        weeklyAverageKg: Math.round(avg * 10) / 10,
        notes: entry.notes,
      };
    });

    const user = await User.findById(req.user._id);
    const targetWeightKg = user.profile?.targetWeightKg || 70;
    const currentWeightKg = logsWithMovingAvg.length > 0
      ? logsWithMovingAvg[logsWithMovingAvg.length - 1].weightKg
      : user.profile?.currentWeightKg || 75;

    const startingWeightKg = logsWithMovingAvg.length > 0 ? logsWithMovingAvg[0].weightKg : currentWeightKg;
    const totalChangeKg = Math.round((currentWeightKg - startingWeightKg) * 10) / 10;
    const remainingToTargetKg = Math.round(Math.abs(currentWeightKg - targetWeightKg) * 10) / 10;

    res.json({
      logs: logsWithMovingAvg,
      summary: {
        startingWeightKg,
        currentWeightKg,
        targetWeightKg,
        totalChangeKg,
        remainingToTargetKg,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log weight for date
// @route   POST /api/weight
const logWeight = async (req, res) => {
  try {
    const { date, weightKg, notes } = req.body;

    if (!date || !weightKg) {
      return res.status(400).json({ message: 'Date and weight are required' });
    }

    const log = await WeightLog.findOneAndUpdate(
      { user: req.user._id, date },
      { weightKg: Number(weightKg), notes: notes || '' },
      { new: true, upsert: true }
    );

    // Update current weight in user profile as well
    await User.findByIdAndUpdate(req.user._id, {
      'profile.currentWeightKg': Number(weightKg),
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWeightLogs,
  logWeight,
};
