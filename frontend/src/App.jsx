import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskPage from './pages/TaskPage';
import Home from './pages/Home';
import CreateTask from './components/Tasks/CreateTask';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/create-task" element={<CreateTask />} />
      </Routes>
    </Router>
  );
};

export default App;
