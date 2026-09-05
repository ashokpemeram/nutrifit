const express = require('express');
const router = express.Router();
const { scanMealPhoto } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/scan-meal', protect, scanMealPhoto);

module.exports = router;
