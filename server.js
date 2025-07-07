const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import routes
const searchRoutes = require('./routes/search');
const offersRoutes = require('./routes/offers');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts for frontend
}));
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/search', searchRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/health', healthRoutes);

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Error handling middleware
app.use(errorMiddleware);

// For Vercel, we need to export the app
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  // Start server in development
  app.listen(PORT, () => {
    logger.info(`🚀 Compareit server running on port ${PORT}`);
    logger.info(`📱 Frontend available at: http://localhost:${PORT}`);
    logger.info(`🔗 API available at: http://localhost:${PORT}/api`);
    logger.info(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
}