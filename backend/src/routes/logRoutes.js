const express = require('express');
const router = express.Router();
const {
  getDailyLogByDate,
  addMealItem,
  deleteMealItem,
  duplicateMeal,
  updateWaterIntake,
  updateSteps,
} = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:date', protect, getDailyLogByDate);
router.post('/:date/meals/:mealType', protect, addMealItem);
router.delete('/:date/meals/:mealType/items/:itemId', protect, deleteMealItem);
router.post('/:date/meals/:mealType/duplicate', protect, duplicateMeal);
router.put('/:date/water', protect, updateWaterIntake);
router.put('/:date/steps', protect, updateSteps);

module.exports = router;
