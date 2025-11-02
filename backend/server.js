const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./src/config/database');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

// Import routes (will create these next)
// const authRoutes = require('./src/routes/auth');
// const eventRoutes = require('./src/routes/events');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to database
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CEO Bazaar Backend Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/ai', require('./src/routes/ai'));
app.use('/api/events', require('./src/routes/events'));
app.use('/api/organizations', require('./src/routes/organizations'));
app.use('/api/collaborative-events', require('./src/routes/collaborativeEvents'));

// Future routes
// app.use('/api/transactions', require('./src/routes/transactions'));
// app.use('/api/tickets', require('./src/routes/tickets'));
// app.use('/api/admin', require('./src/routes/admin'));

// Serve static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// API routes (will uncomment as we create them)
// app.use('/api/auth', authRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/organizations', organizationRoutes);
// app.use('/api/merchandise', merchandiseRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/admin', adminRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 CEO Bazaar API Server is running!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
🔗 Health Check: http://localhost:${PORT}/health
🎯 Frontend URL: ${process.env.FRONTEND_URL}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;