/**
 * app.js — Express Application Configuration
 *
 * This file CREATES the Express app and CONFIGURES it.
 * It does NOT start the server — that's server.js's job.
 *
 * WHY SEPARATE app.js AND server.js?
 * So we can import the app in tests without starting the server.
 * This is a best practice used in professional Node.js projects.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const medicineRoutes = require('./routes/medicineRoutes');
const errorHandler = require('./middleware/errorHandler');

// ═══════════════════════════════════════════
// Create Express App
// ═══════════════════════════════════════════
const app = express();

// ═══════════════════════════════════════════
// Middleware
// ═══════════════════════════════════════════

// CORS — Allow cross-origin requests (frontend on different port)
app.cors = cors;
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files (for debugging/viewing)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ═══════════════════════════════════════════
// Routes
// ═══════════════════════════════════════════

// Health Check — for monitoring and Python-side connectivity check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'medicine-extraction-backend' });
});

// Medicine API routes
app.use('/api/medicine', medicineRoutes);

// ═══════════════════════════════════════════
// Global Error Handler (must be AFTER routes)
// ═══════════════════════════════════════════
app.use(errorHandler);

module.exports = app;
