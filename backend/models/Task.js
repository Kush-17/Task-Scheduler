const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending','in-progress','completed'],
    default: 'pending',
  },
  scheduledAt: {
    type: Date,
    default: Date.now,
  },
  executionTime: {
    type: Number, /// Time in seconds to complete the task
    default: 0,
  },
  priority: {
    type: Number /// Higher the number lower the priority
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);