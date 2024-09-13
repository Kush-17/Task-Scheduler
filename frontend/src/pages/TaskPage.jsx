import React from 'react';
import TaskList from '../components/Tasks/TaskList';
import { Link } from 'react-router-dom';
import '../styles/TaskPage.css';

const TaskPage = () => {
  return (
    <div className="task-page">
      <h2>Your Tasks</h2>
      <Link to="/create-task">
        <button>Create New Task</button>
      </Link>
      <TaskList />
    </div>
  );
};

export default TaskPage;

