const express = require('express');
const router = express.Router();
const queueManagerController = require('../controllers/queueManagerController');
const { protect } = require('../middlewares/authMiddleware');

// Route to add a new task to the queue
router.post('/add', protect, queueManagerController.addTask);

// Route to get the current queue
router.get('/queue',protect, queueManagerController.getQueue);

module.exports = router;
