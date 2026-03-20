/**
 * pythonApiService.js — Calls the Python AI Microservice
 *
 * WHAT THIS FILE DOES:
 * Takes a file path on disk → reads the file → sends it to the Python
 * FastAPI service at POST /extract → returns the JSON response.
 *
 * WHY THIS IS A SEPARATE FILE:
 * If we ever change the Python API URL, switch to a different AI service,
 * or need to add retry logic, we only change THIS file. The controller
 * doesn't need to know how the AI service is called.
 *
 * FLOW:
 *   Controller calls: pythonApiService.extractFromImage(filePath)
 *   This file:
 *     1. Reads the file from disk
 *     2. Creates a FormData object
 *     3. POSTs it to Python's /extract endpoint
 *     4. Returns the parsed response
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

/**
 * Send an image to the Python AI service and get extracted medicine data.
 *
 * @param {string} filePath - Absolute path to the image file on disk
 * @returns {Object} The extraction result from Python (status, data, etc.)
 * @throws {Error} If Python service is unreachable or returns an error
 */
const extractFromImage = async (filePath) => {
  // Create a FormData object — this is how files are sent over HTTP
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post(`${PYTHON_API_URL}/extract`, form, {
      headers: {
        ...form.getHeaders(), // Content-Type: multipart/form-data with boundary
      },
      timeout: 60000, // 60 second timeout (AI can be slow)
      maxContentLength: 10 * 1024 * 1024, // 10MB max response
    });

    return response.data;
  } catch (error) {
    // ─── Python service is completely down ───
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        'AI extraction service is not running. Please start the Python service on port 8000.'
      );
    }

    // ─── Request timed out ───
    if (error.code === 'ECONNABORTED') {
      throw new Error('AI extraction timed out. The image may be too complex or the service is overloaded.');
    }

    // ─── Python returned an error response ───
    if (error.response) {
      const detail = error.response.data?.detail || error.response.data?.message || 'Unknown error';
      throw new Error(`AI service error (${error.response.status}): ${detail}`);
    }

    // ─── Something else went wrong ───
    throw new Error(`Failed to connect to AI service: ${error.message}`);
  }
};

/**
 * Check if the Python AI service is running.
 * Calls GET /health on the Python server.
 *
 * @returns {boolean} true if healthy, false otherwise
 */
const checkHealth = async () => {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/health`, { timeout: 5000 });
    return response.data.status === 'healthy';
  } catch {
    return false;
  }
};

module.exports = { extractFromImage, checkHealth };
