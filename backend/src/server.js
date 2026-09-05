const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect Database (MongoDB or In-Memory fallback)
connectDB();

// CORS Configuration
const allowedOrigin = process.env.CLIENT_ORIGIN;
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);
    if (!allowedOrigin || allowedOrigin === '*') {
      // Reflect origin so credentials work seamlessly across domains
      return callback(null, true);
    }
    const origins = allowedOrigin.split(',').map((o) => o.trim());
    if (origins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback allow to avoid breaking deployments
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/weight', require('./routes/weightRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Serve Frontend in Production if dist folder exists
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend build not found. Run "npm run build" in frontend.');
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] NutriFit API Server running on port ${PORT}`);
});
