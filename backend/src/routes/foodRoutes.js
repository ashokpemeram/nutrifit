const express = require('express');
const router = express.Router();
const { getFoods, createCustomFood, toggleFrequentFood } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getFoods);
router.post('/', protect, createCustomFood);
router.post('/:id/frequent', protect, toggleFrequentFood);

module.exports = router;
