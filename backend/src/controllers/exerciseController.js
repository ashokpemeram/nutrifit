const ExerciseLog = require('../models/ExerciseLog');

// MET values for standard exercises
const EXERCISE_METS = {
  Walking: 3.8,
  Running: 8.0,
  Cycling: 6.8,
  Gym: 5.5,
  'Weight Training': 5.0,
  Swimming: 7.0,
  Sports: 6.5,
  Custom: 4.5,
};

// @desc    Get exercises for date
// @route   GET /api/exercises/:date
const getExerciseLogs = async (req, res) => {
  try {
    const { date } = req.params;
    const logs = await ExerciseLog.find({ user: req.user._id, date }).sort({ createdAt: -1 });

    const totalCaloriesBurned = logs.reduce((sum, item) => sum + item.caloriesBurned, 0);

    res.json({ logs, totalCaloriesBurned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log new exercise
// @route   POST /api/exercises
const addExerciseLog = async (req, res) => {
  try {
    const { date, name, durationMinutes, intensity, caloriesBurned } = req.body;

    if (!name || !durationMinutes) {
      return res.status(400).json({ message: 'Exercise name and duration are required' });
    }

    let estimatedCalories = caloriesBurned;
    if (!estimatedCalories) {
      const userWeight = req.user.profile?.currentWeightKg || 70;
      const met = EXERCISE_METS[name] || 4.5;
      const intensityMultiplier = intensity === 'Vigorous' ? 1.25 : intensity === 'Light' ? 0.75 : 1.0;
      // Formula: Calories = MET * Weight(kg) * (Duration(mins) / 60) * intensity
      estimatedCalories = Math.round(met * userWeight * (durationMinutes / 60) * intensityMultiplier);
    }

    const newExercise = await ExerciseLog.create({
      user: req.user._id,
      date,
      name,
      durationMinutes: Number(durationMinutes),
      intensity: intensity || 'Moderate',
      caloriesBurned: estimatedCalories,
    });

    res.status(201).json(newExercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete exercise log
// @route   DELETE /api/exercises/:id
const deleteExerciseLog = async (req, res) => {
  try {
    const log = await ExerciseLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!log) {
      return res.status(404).json({ message: 'Exercise log not found' });
    }
    res.json({ message: 'Exercise log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExerciseLogs,
  addExerciseLog,
  deleteExerciseLog,
};
