const Heap = require('heap');
const Task = require('./models/Task');

class QueueManager {
  constructor() {
    this.heap = new Heap((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(a.scheduledAt) - new Date(b.scheduledAt);
    });
    this.isProcessing = false;
    this.initQueue();
  }

  async initQueue() {
    await this.loadTasks();
    this.processNextTask();
  }

  async loadTasks() {
    const tasks = await Task.find().sort({ status: 1, priority: 1, scheduledAt: 1 });
    tasks.forEach(task => this.heap.push(task));
  }

  async addTask(task) {
    this.heap.push(task);
    this.processNextTask();
  }

  async processNextTask() {
    if (this.isProcessing) return;
    if (this.heap.empty()) return;

    const task = this.heap.pop();

    if (task.status === 'completed') {
      return this.processNextTask(); // Skip completed tasks
    }

    if (task.status === 'pending') {
      const now = new Date();
      if (new Date(task.scheduledAt) > now) {
        const delay = new Date(task.scheduledAt) - now;
        setTimeout(() => this.executeTask(task), delay);
      } else {
        this.executeTask(task);
      }
    } else if (task.status === 'in-progress') {
      this.executeTask(task);
    }
  }

  async executeTask(task) {
    this.isProcessing = true;
    try {
      task.status = 'in-progress';
      await task.save();
      console.log(`Executing Task: ${task.title}`);

      setTimeout(async () => {
        task.status = 'completed';
        await task.save();
        console.log(`Completed Task: ${task.title}`);
        this.isProcessing = false;
        this.processNextTask();
      }, task.executionTime * 1000);
    } catch (error) {
      console.error(`Error executing task ${task.title}:`, error);
      this.isProcessing = false;
      this.processNextTask();
    }
  }
}

const queueManager = new QueueManager();
module.exports = queueManager;
