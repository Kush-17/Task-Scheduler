import React, { useEffect, useState } from 'react';
import apiClient from '../../../api/apiClient';
import TaskItem from './TaskItem';
import '../../styles/TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiClient.get('/api/tasks');
        const sortedTasks = response.data.tasks.sort((a, b) => {
          const statusOrder = {
            completed: 1,
            'in-progress': 2,
            pending: 3,
          };

          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }

          return a.priority - b.priority;
        });

        setTasks(sortedTasks);
        const inProgressTask = sortedTasks.find(task => task.status === 'in-progress');
        if (!inProgressTask) {
          const nextPendingTask = sortedTasks.find(task => task.status === 'pending');
          if (nextPendingTask) {
            setCurrentTaskId(nextPendingTask._id);
            await apiClient.patch(`/api/tasks/${nextPendingTask._id}`, { status: 'in-progress' });
            fetchTasks(); // Refresh tasks to reflect the status change
          }
        } else {
          setCurrentTaskId(inProgressTask._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const categorizeTasks = (status) => tasks.filter(task => task.status === status);

  return (
    <div className="task-list">
      <h2>In Progress Queue</h2>
      <ul>
        {categorizeTasks('in-progress').map(task => (
          <TaskItem key={task._id} task={task} isCurrent={task._id === currentTaskId} />
        ))}
      </ul>
      <h2>Pending Queue</h2>
      <ul>
        {categorizeTasks('pending').map(task => (
          <TaskItem key={task._id} task={task} isCurrent={false} />
        ))}
      </ul>
      <h2>Completed Queue</h2>
      <ul>
        {categorizeTasks('completed').map(task => (
          <TaskItem key={task._id} task={task} isCurrent={false} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
