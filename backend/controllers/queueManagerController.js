const Task = require('../models/Task');
const queueManager = require('../queueManager');

exports.addTask = async (req, res) => {
    try {
        const { title, description, scheduledAt, executionTime, priority } = req.body;

        // Create a new task instance
        const user = req.user._id;
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
        await queueManager.addTask(newTask);

        res.status(201).json({
            message: 'Task created and added to the queue',
            task: newTask
        });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Failed to add task' });
    }
};

exports.getQueue = (req, res) => {
    try {
        const currentQueue = queueManager.heap.toArray();

        res.status(200).json({
            message: 'Current queue',
            queue: currentQueue
        });
    } catch (error) {
        console.error('Error retrieving queue:', error);
        res.status(500).json({ message: 'Failed to retrieve queue' });
    }
};
