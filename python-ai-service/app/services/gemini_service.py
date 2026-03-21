"""
gemini_service.py — Talks to Google Gemini Vision API.

This file has ONE job: 
    Take image bytes + a prompt → Send to Gemini → Return raw text.

It does NOT parse or validate the response. That's extractor.py's job.
Separation of concerns: each file does one thing well.
"""

import google.generativeai as genai
from PIL import Image
import io

from app.config import GEMINI_API_KEY

# ═══════════════════════════════════════════
# Configure the Gemini SDK with our API key
# ═══════════════════════════════════════════
genai.configure(api_key=GEMINI_API_KEY)

# ═══════════════════════════════════════════
# The Extraction Prompt
# ═══════════════════════════════════════════
EXTRACTION_PROMPT = """You are a precise medical data extraction system.

Analyze the provided image of a medicine package.

Extract EXACTLY these fields:
1. medicine_name — the full name of the medicine including dosage (e.g., "Paracetamol 500mg")
2. expiry_date — the expiry or "EXP" date as printed on the package (e.g., "12/2026")
3. batch_number — the batch number, lot number, or "B.No" as printed (e.g., "BN-20250312")
4. price — the MRP (Maximum Retail Price) as a number without currency symbol (e.g., 45.50)

RULES:
- Return ONLY a valid JSON object. No explanation. No markdown. No code fences.
- If a field cannot be found in the image, set its value to null.
- Do NOT guess or invent values. Only extract what is clearly visible.
- For price, always use the MRP value if multiple prices are shown.
- Return the JSON in this exact structure:

{"medicine_name": "...", "expiry_date": "...", "batch_number": "...", "price": ...}"""


async def extract_from_image(image_bytes: bytes) -> str:
    """
    Send an image to Gemini Vision and get the raw text response.
    
    Args:
        image_bytes: Raw bytes of the uploaded image file.
        
    Returns:
        The raw text string from Gemini (hopefully JSON, but not guaranteed).
        
    Raises:
        Exception: If Gemini API call fails (timeout, auth error, etc.)
    """
    # Convert raw bytes to a PIL Image (Gemini SDK expects this)
    image = Image.open(io.BytesIO(image_bytes))

    # Use Gemini 2.5 Flash — fast and cost-effective for extraction tasks
    model = genai.GenerativeModel("gemini-2.5-flash")

    # Send image + prompt to Gemini
    response = model.generate_content(
        [EXTRACTION_PROMPT, image],
        generation_config=genai.types.GenerationConfig(
            temperature=0.1,  # Low temperature = more deterministic, less creative
            max_output_tokens=500,  # We only need a small JSON, not an essay
        ),
    )

    # Return the text part of the response
    return response.text
