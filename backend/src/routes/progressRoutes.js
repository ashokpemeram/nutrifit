const express = require('express');
const router = express.Router();
const { getProgressStats } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProgressStats);

module.exports = router;
