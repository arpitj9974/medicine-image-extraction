"""
extractor.py — The orchestrator for medicine data extraction.

FLOW:
    receive image bytes
        → call gemini_service to get raw AI text
        → call json_cleaner to parse the text
        → validate against MedicineData schema
        → determine status (success / partial / error)
        → return ExtractionResponse

This is the BRAIN of the Python service. It connects all the pieces.
"""

from app.services.gemini_service import extract_from_image
from app.utils.json_cleaner import clean_ai_response
from app.schemas.medicine_schema import MedicineData, ExtractionResponse


async def extract_medicine_data(image_bytes: bytes) -> ExtractionResponse:
    """
    Full extraction pipeline: image → AI → clean → validate → respond.
    
    Args:
        image_bytes: Raw bytes of the medicine image.
        
    Returns:
        ExtractionResponse with status, data, and any warnings/errors.
    """
    try:
        # ─── Step 1: Send image to Gemini ───
        raw_text = await extract_from_image(image_bytes)
        print(f"\n[AI] Raw response from Gemini:\n{raw_text}\n")

        # ─── Step 2: Clean the AI response into a Python dict ───
        try:
            parsed_data = clean_ai_response(raw_text)
        except ValueError as e:
            # AI returned something we can't parse at all
            return ExtractionResponse(
                status="error",
                message=f"AI returned invalid response: {str(e)}",
                raw_response=raw_text[:500]  # Include first 500 chars for debugging
            )

        # ─── Step 3: Validate against our schema ───
        # This ensures only the 4 expected fields are kept,
        # and any extra fields the AI added are discarded.
        medicine = MedicineData(
            medicine_name=parsed_data.get("medicine_name"),
            expiry_date=parsed_data.get("expiry_date"),
            batch_number=parsed_data.get("batch_number"),
            price=_safe_float(parsed_data.get("price")),
        )

        # ─── Step 4: Determine extraction status ───
        filled_fields = sum([
            medicine.medicine_name is not None,
            medicine.expiry_date is not None,
            medicine.batch_number is not None,
            medicine.price is not None,
        ])

        if filled_fields == 4:
            return ExtractionResponse(status="success", data=medicine)
        elif filled_fields > 0:
            return ExtractionResponse(
                status="partial",
                data=medicine,
                warning=f"Only {filled_fields}/4 fields were extracted"
            )
        else:
            return ExtractionResponse(
                status="error",
                message="AI could not extract any fields from this image",
                data=medicine,
                raw_response=raw_text[:500]
            )

    except Exception as e:
        # Catch-all for unexpected errors (network timeout, API key issue, etc.)
        return ExtractionResponse(
            status="error",
            message=f"Extraction failed: {str(e)}"
        )


def _safe_float(value) -> float | None:
    """
    Safely convert a value to float. Returns None if conversion fails.
    
    Handles cases like:
        "45.50"  → 45.5
        "₹45.50" → 45.5  (strips currency symbols)
        "N/A"    → None
        None     → None
    """
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        # Remove common currency symbols and whitespace
        cleaned = value.replace("₹", "").replace("$", "").replace("Rs", "").replace("MRP", "").strip()
        cleaned = cleaned.replace(",", "")  # Handle "1,234.50"
        try:
            return float(cleaned)
        except ValueError:
            return None
    return None
