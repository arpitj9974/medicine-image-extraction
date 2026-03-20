/**
 * server.js — Application Entry Point
 *
 * This file:
 *   1. Loads environment variables from .env
 *   2. Connects to MongoDB
 *   3. Starts the Express server
 *
 * Run with: node src/server.js
 * Or dev:   npx nodemon src/server.js
 */

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════
// Start the Application
// ═══════════════════════════════════════════
const startServer = async () => {
  // Step 1: Connect to MongoDB
  await connectDB();

  // Step 2: Start Express server
  app.listen(PORT, () => {
    console.log(`\n🚀 Medicine Extraction Backend running on port ${PORT}`);
    console.log(`📋 API Base URL: http://localhost:${PORT}/api/medicine`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

startServer();
