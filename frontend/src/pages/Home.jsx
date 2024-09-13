import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleViewTasks = () => {
        navigate('/tasks');
    };

    const handleCreateTask = () => {
        navigate('/create-task');
    };

    return (
        <div className="home-page">
            <h1>Welcome to the Task Management App</h1>
            <button onClick={handleViewTasks}>View Tasks</button>
            <button onClick={handleCreateTask}>Create Task</button>
        </div>
    );
};

export default Home;
