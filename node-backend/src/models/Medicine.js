/**
 * Medicine.js — Mongoose Schema for Medicine Records
 *
 * This is the "shape" of every medicine document in MongoDB.
 * Think of it as a blueprint: every medicine record MUST look like this.
 *
 * FIELDS:
 * - Extracted fields (from AI): medicine_name, expiry_date, batch_number, price
 * - Metadata fields (system-generated): image_url, raw_ai_response, extraction_status, error_message
 * - Timestamps (auto): createdAt, updatedAt
 */

const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    // ═══════════════════════════════════════════
    // EXTRACTED FIELDS (from AI via Python service)
    // All are optional because AI might not find them
    // ═══════════════════════════════════════════
    medicine_name: {
      type: String,
      default: null,
      trim: true,
    },
    expiry_date: {
      type: String, // String, NOT Date — AI returns varied formats like "12/2026", "Dec 2026"
      default: null,
      trim: true,
    },
    batch_number: {
      type: String,
      default: null,
      trim: true,
    },
    price: {
      type: Number,
      default: null,
    },

    // ═══════════════════════════════════════════
    // METADATA FIELDS (system-generated)
    // ═══════════════════════════════════════════
    image_url: {
      type: String,
      required: [true, 'Image path is required'],
    },
    raw_ai_response: {
      type: mongoose.Schema.Types.Mixed, // Can store any JSON shape
      default: {},
    },
    extraction_status: {
      type: String,
      enum: ['success', 'partial', 'failed'],
      default: 'failed',
    },
    error_message: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Medicine', medicineSchema);
