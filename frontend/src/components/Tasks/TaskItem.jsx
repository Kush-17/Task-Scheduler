import React, { useEffect, useState } from 'react';
import '../../styles/TaskItem.css';

const TaskItem = ({ task, isCurrent }) => {
  const { title, description, scheduledAt, executionTime, priority, status } = task;
  const [timeRemaining, setTimeRemaining] = useState(isCurrent ? executionTime : 0); // Initialize based on whether it's the current task

  useEffect(() => {
    let interval;

    if (isCurrent && status === 'in-progress') {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval); // Stop the interval if time is up
            return 0;
          }
        });
      }, 1000);
    } else {
      setTimeRemaining(0); // Pause timer for non-current tasks
    }

    // Clear the interval when the component is unmounted or task status changes
    return () => clearInterval(interval);
  }, [isCurrent, status]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <li className={`task-item ${status}`}>
      <p><strong>Priority:</strong> {priority}</p>
      <p><strong>Status:</strong> {status}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <p><strong>Scheduled At:</strong> {new Date(scheduledAt).toLocaleString()}</p>
      {isCurrent && status === 'in-progress' && (
        <p><strong>Time Remaining:</strong> {formatTime(timeRemaining)}</p>
      )}
    </li>
  );
};

export default TaskItem;
