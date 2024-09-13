const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const colors = require('colors');
const app = express();
const queueManager = require('./queueManager');

// ENV Configuration
dotenv.config();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/queueManager',require('./routes/queueManagerRoutes'))

module.exports = app;