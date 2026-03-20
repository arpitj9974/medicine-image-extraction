/**
 * uploadMiddleware.js — Multer Configuration for File Uploads
 *
 * WHAT MULTER DOES:
 * When a user sends a file via a POST request, Express cannot read it by
 * itself. Multer is a middleware that:
 *   1. Reads the file from the request
 *   2. Saves it to the /uploads folder
 *   3. Attaches file info to req.file so your controller can use it
 *
 * THIS FILE CONFIGURES:
 * - WHERE files are saved (uploads/ directory)
 * - WHAT files are allowed (only JPG and PNG)
 * - HOW BIG files can be (max 5MB)
 */

const multer = require('multer');
const path = require('path');

// ═══════════════════════════════════════════
// Storage Configuration
// ═══════════════════════════════════════════
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save uploaded files to the /uploads folder
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    // Create a unique filename: timestamp-originalname
    // Example: 1711004320000-paracetamol.jpg
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// ═══════════════════════════════════════════
// File Filter — Only allow image files
// ═══════════════════════════════════════════
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error(`Invalid file type: ${file.mimetype}. Only JPG and PNG are allowed.`),
      false
    );
  }
};

// ═══════════════════════════════════════════
// Create and Export the Multer Instance
// ═══════════════════════════════════════════
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

module.exports = upload;
