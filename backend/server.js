require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedDB = require('./config/seed');

// Initialize Database Connection
connectDB().then(() => {
  // Run DB Seeding if database has 0 items
  seedDB();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic API Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tariffs', require('./routes/tariffs'));
app.use('/api/currency', require('./routes/currency'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
