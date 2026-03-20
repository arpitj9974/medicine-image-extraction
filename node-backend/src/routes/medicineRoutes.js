/**
 * medicineRoutes.js — Express Route Definitions
 *
 * This file maps URLs to controller functions:
 *   POST /api/medicine/upload   → uploadAndExtract
 *   GET  /api/medicine          → getAllMedicines
 *   GET  /api/medicine/:id      → getMedicineById
 *
 * The upload middleware (multer) is applied ONLY to the POST route.
 */

const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const {
  uploadAndExtract,
  getMedicineById,
  getAllMedicines,
} = require('../controllers/medicineController');

// ═══════════════════════════════════════════
// POST /api/medicine/upload
// Upload a medicine image and extract data
// upload.single('image') = accept ONE file with field name "image"
// ═══════════════════════════════════════════
router.post('/upload', upload.single('image'), uploadAndExtract);

// ═══════════════════════════════════════════
// GET /api/medicine
// List all extraction records
// ═══════════════════════════════════════════
router.get('/', getAllMedicines);

// ═══════════════════════════════════════════
// GET /api/medicine/:id
// Get a single record by ID
// ═══════════════════════════════════════════
router.get('/:id', getMedicineById);

module.exports = router;
