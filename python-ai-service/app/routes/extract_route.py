"""
extract_route.py — FastAPI route for the /extract endpoint.

This file ONLY defines the HTTP contract:
    - What URL to listen on
    - What input to accept (file upload)
    - What validation to do on the file
    - What output to return

The actual AI logic is in extractor.py. This route just calls it.
"""

import os
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.extractor import extract_medicine_data
from app.config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB

router = APIRouter()


@router.post("/extract")
async def extract_medicine(file: UploadFile = File(...)):
    """
    Accept a medicine image and return extracted data as JSON.
    
    - Validates file type (only JPG/PNG)
    - Validates file size (max 5MB)
    - Sends to AI for extraction
    - Returns structured response
    """

    # ─── Validation 1: Check file type ───
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file_ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # ─── Validation 2: Read file and check size ───
    contents = await file.read()
    file_size_mb = len(contents) / (1024 * 1024)

    if file_size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({file_size_mb:.1f}MB). Maximum allowed: {MAX_FILE_SIZE_MB}MB"
        )

    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    # ─── Process: Send to AI extractor ───
    result = await extract_medicine_data(contents)

    # Return the ExtractionResponse as JSON
    return result.model_dump()
