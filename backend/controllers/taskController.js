const Task = require('../models/Task');
const queueManager = require('../queueManager');

// Create a new Task and add to queue
exports.createTask = async (req, res) => {
    const { title, description, scheduledAt, executionTime, priority } = req.body;

    const user = req.user._id;
    // Validate input
    if (!title || !scheduledAt || !executionTime || priority === undefined) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    try {
        // Create a new task instance
        const newTask = new Task({
            title,
            description,
            scheduledAt: new Date(scheduledAt),
            executionTime,
            priority,
            status: 'pending',
            user
        });

        // Save the task to the database
        await newTask.save();

        // Add the new task to the queue
        queueManager.addTask(newTask);

        res.status(201).json({
            message: 'Task created and added to the queue',
            success: true,
            task: newTask
        });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, message: 'Failed to add task' });
    }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ priority: 1, scheduledAt: 1 });
        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
