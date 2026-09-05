const express = require('express');
const router = express.Router();
const { getExerciseLogs, addExerciseLog, deleteExerciseLog } = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:date', protect, getExerciseLogs);
router.post('/', protect, addExerciseLog);
router.delete('/:id', protect, deleteExerciseLog);

module.exports = router;
