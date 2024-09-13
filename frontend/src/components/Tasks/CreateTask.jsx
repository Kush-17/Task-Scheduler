import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import '../../styles/CreateTask.css';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('pending');

  const navigate = useNavigate();

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const newTask = {
        title,
        description,
        scheduledAt,
        executionTime: parseInt(executionTime, 10), // Convert to number
        priority: parseInt(priority, 10), // Convert to number
        status,
      };

      // Send a POST request to add the new task to the queue
      await apiClient.post('/api/queueManager/add', newTask);

      // Redirect to the Task List page after task creation
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  return (
    <form onSubmit={handleCreateTask} className='auth-form'>
      <h2>Create New Task</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        required
      />
      <input
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
        placeholder="Scheduled At"
        required
      />
      <input
        type="number"
        value={executionTime}
        onChange={(e) => setExecutionTime(e.target.value)}
        placeholder="Execution Time (in seconds)"
        min="1" // Ensure positive number
        required
      />
      <input
        type="number"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        placeholder="Priority (lower number = higher priority)"
        min="1" // Ensure positive number
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} required>
        <option value="pending">Pending</option>
        <option value="in-progress">In-Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default CreateTask;
