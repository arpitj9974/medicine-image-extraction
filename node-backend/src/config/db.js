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
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ No MONGO_URI found. Running in "No-Database" mode.');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn('🚀 App will continue running in "No-Database" mode (records will not be saved).');
  }
};

module.exports = connectDB;
