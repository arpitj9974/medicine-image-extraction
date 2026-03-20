"""
config.py — Loads environment variables for the Python AI service.

This file is the SINGLE place where all environment-dependent values live.
Every other file imports from here. Never hardcode API keys or settings.
"""

import os
from dotenv import load_dotenv

# Load variables from .env file into the environment
load_dotenv()


# ═══════════════════════════════════════════
# Gemini AI Configuration
# ═══════════════════════════════════════════
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not set! "
        "Create a .env file with: GEMINI_API_KEY=your_key_here\n"
        "Get your key from: https://aistudio.google.com/app/apikey"
    )

# ═══════════════════════════════════════════
# Application Settings
# ═══════════════════════════════════════════
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
AI_TIMEOUT_SECONDS = int(os.getenv("AI_TIMEOUT_SECONDS", "30"))

# ═══════════════════════════════════════════
# File Upload Settings
# ═══════════════════════════════════════════
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE_MB = 5
