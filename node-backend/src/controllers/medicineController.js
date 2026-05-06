/**
 * medicineController.js — The Orchestrator
 *
 * THIS IS THE BRAIN OF THE NODE.JS BACKEND.
 *
 * Each function here handles one API endpoint. It coordinates:
 *   1. Getting the uploaded file from multer
 *   2. Calling the Python AI service
 *   3. Saving the result to MongoDB
 *   4. Cleaning up the temporary file
 *   5. Sending the response to the user
 *
 * IMPORTANT: Controllers should be "thin". They coordinate, they don't
 * contain business logic. The actual AI call is in pythonApiService.js.
 * The actual DB save is via the Medicine model.
 */

const fs = require('fs');
const path = require('path');
const Medicine = require('../models/Medicine');
const { extractFromImage } = require('../services/pythonApiService');

/**
 * POST /api/medicine/upload
 * 
 * Full pipeline: Upload → Extract → Save → Respond → Cleanup
 */
const uploadAndExtract = async (req, res, next) => {
  let filePath = null;

  try {
    // ─── Step 1: Check if file was uploaded ───
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Send a file with field name "image".',
      });
    }

    filePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    console.log(`📷 Received image: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)}KB)`);

    // ─── Step 2: Call Python AI Service ───
    console.log('🤖 Sending image to AI service...');
    let extractionResult;

    try {
      extractionResult = await extractFromImage(filePath);
    } catch (aiError) {
      // AI service failed — save a "failed" record so we have a log
      console.error(`❌ AI extraction failed: ${aiError.message}`);

      const failedRecord = await Medicine.create({
        image_url: imageUrl,
        extraction_status: 'failed',
        error_message: aiError.message,
      });

      return res.status(502).json({
        success: false,
        message: 'AI extraction service failed. The upload has been logged.',
        record_id: failedRecord._id,
        error: aiError.message,
      });
    }

    // ─── Step 3: Save to MongoDB (Optional) ───
    console.log(`📊 Extraction status: ${extractionResult.status}`);
    let medicineRecord = null;

    try {
      if (require('mongoose').connection.readyState === 1) {
        medicineRecord = await Medicine.create({
          medicine_name: extractionResult.data?.medicine_name || null,
          expiry_date: extractionResult.data?.expiry_date || null,
          batch_number: extractionResult.data?.batch_number || null,
          price: extractionResult.data?.price || null,
          image_url: imageUrl,
          raw_ai_response: extractionResult,
          extraction_status: extractionResult.status === 'error' ? 'failed' : extractionResult.status,
          error_message: extractionResult.message || null,
        });
        console.log(`✅ Saved to MongoDB: ${medicineRecord._id}`);
      } else {
        console.warn('⚠️ Skipping database save (not connected).');
      }
    } catch (dbError) {
      console.warn(`⚠️ Failed to save record: ${dbError.message}`);
    }

    // ─── Step 4: Send Response ───
    const statusCode = extractionResult.status === 'success' ? 201 : 200;

    return res.status(statusCode).json({
      success: true,
      message: extractionResult.status === 'success'
          ? 'Medicine data extracted successfully'
          : extractionResult.status === 'partial'
          ? 'Partial extraction — some fields could not be read'
          : 'Extraction completed with issues',
      data: {
        _id: medicineRecord?._id || `temp_${Date.now()}`,
        medicine_name: medicineRecord?.medicine_name || extractionResult.data?.medicine_name || null,
        expiry_date: medicineRecord?.expiry_date || extractionResult.data?.expiry_date || null,
        batch_number: medicineRecord?.batch_number || extractionResult.data?.batch_number || null,
        price: medicineRecord?.price || extractionResult.data?.price || null,
        extraction_status: medicineRecord?.extraction_status || extractionResult.status,
        image_url: medicineRecord?.image_url || imageUrl,
        createdAt: medicineRecord?.createdAt || new Date(),
      },
      warning: extractionResult.warning || undefined,
      db_status: medicineRecord ? 'saved' : 'not_saved'
    });
  } catch (error) {
    next(error); // Pass to global error handler
  } finally {
    // We intentionally keep the image in the /uploads directory 
    // so that the React frontend can display it in the History Table.
    console.log('✅ Upload flow completed.');
  }
};

/**
 * GET /api/medicine/:id
 * 
 * Retrieve a previously saved medicine extraction record.
 */
const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine record not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    // Invalid MongoDB ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid record ID format',
      });
    }
    next(error);
  }
};

/**
 * GET /api/medicine
 * 
 * List all medicine extraction records (newest first).
 */
const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find()
      .sort({ createdAt: -1 }) // Newest first
      .select('-raw_ai_response'); // Exclude raw response in list view (it's large)

    return res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAndExtract, getMedicineById, getAllMedicines };
