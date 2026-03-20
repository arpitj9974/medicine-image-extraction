/**
 * db.js — MongoDB Connection Logic
 * 
 * WHAT THIS DOES:
 * Connects to MongoDB using the connection string from your .env file.
 * Called once when the server starts. If the connection fails, the server
 * will NOT start (fail fast — better than crashing later).
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the server — no point running without a database
  }
};

module.exports = connectDB;
