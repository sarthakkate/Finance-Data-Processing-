// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const { connectDB } = require('./config/database');
// const { errorHandler, notFound, asyncHandler } = require('./middleware/errorHandler');

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const recordRoutes = require('./routes/recordRoutes');
// const summaryRoutes = require('./routes/summaryRoutes');

// // Initialize Express app
// const app = express();

// // Middleware: Security
// app.use(helmet());

// // Middleware: CORS
// app.use(
//   cors({
//     origin: '*', // Configure based on your frontend URL in production
//     credentials: true,
//   })
// );

// // Middleware: Body parser
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// // Middleware: Request logging (optional)
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/records', recordRoutes);
// app.use('/api/summary', summaryRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//   });
// });

// // 404 handler
// app.use(notFound);

// // Error handler middleware (must be last)
// app.use(errorHandler);

// // Connect to database and start server
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     // Connect to MongoDB
//     await connectDB();

//     // Start listening
//     app.listen(PORT, () => {
//       console.log(`
// ╔════════════════════════════════════════════════════╗
// ║   Finance Data Processing Backend                  ║
// ║   Server running on: http://localhost:${PORT}       ║
// ║   Environment: ${process.env.NODE_ENV}                      ║
// ║   Database: Connected                              ║
// ╚════════════════════════════════════════════════════╝
//       `);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled Rejection:', error.message);
//   process.exit(1);
// });

// // Graceful shutdown
// process.on('SIGINT', () => {
//   console.log('\n✓ Server shutdown gracefully');
//   process.exit(0);
// });

// // Start the server
// startServer();

// module.exports = app;


/**
 * FINANCE DATA PROCESSING BACKEND
 * Main Entry Point: server.js
 * Developer: Sarthak Kate
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// Initialize Express app
const app = express();

// 1. Security Middleware
app.use(helmet()); // Sets security-related HTTP headers

// 2. CORS Configuration
app.use(
  cors({
    origin: '*', // In production, replace '*' with your specific Frontend URL
    credentials: true,
  })
);

// 3. Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Request Logger (Helpful for debugging in terminal)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 5. ROOT ROUTE (This fixes the "Not Found" error in your browser)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Finance Dashboard API',
    developer: 'Sarthak Kate',
    version: '1.0.0',
    health_check: '/api/health'
  });
});

// 6. HEALTH CHECK (For monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy and running',
    timestamp: new Date().toISOString(),
  });
});

// 7. API ROUTES
app.use('/api/auth', authRoutes);       // Login, Register, Profile
app.use('/api/records', recordRoutes);    // CRUD operations for Finance
app.use('/api/summary', summaryRoutes);   // Analytics/Dashboard stats

// 8. ERROR HANDLING (Must be after all routes)
app.use(notFound);      // Catches 404s
app.use(errorHandler);  // Final error formatter

// 9. START SERVER
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas (using your .env credentials)
    await connectDB();

    // Start listening on the assigned port
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║    FINANCE DATA PROCESSING BACKEND IS LIVE         ║
╠════════════════════════════════════════════════════╣
║  URL: http://localhost:${PORT}                      ║
║  Environment: ${process.env.NODE_ENV || 'development'}           ║
║  Database: MongoDB Cloud Connected                 ║
╚════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to start server:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Handle Unhandled Promise Rejections (e.g. Database connection lost)
process.on('unhandledRejection', (error) => {
  console.error(`Unhandled Rejection Error: ${error.message}`);
  // Close server & exit process
  process.exit(1);
});

// Graceful Shutdown (For Clean Nodemon Restarts)
process.on('SIGINT', () => {
  console.log('\n✓ Server shutdown gracefully');
  process.exit(0);
});

startServer();

module.exports = app; // Export for testing purposes