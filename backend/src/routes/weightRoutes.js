const express = require('express');
const router = express.Router();
const { getWeightLogs, logWeight } = require('../controllers/weightController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWeightLogs);
router.post('/', protect, logWeight);

module.exports = router;
