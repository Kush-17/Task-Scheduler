import React, { useState } from 'react';
import apiClient from '../../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/tasks');
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
