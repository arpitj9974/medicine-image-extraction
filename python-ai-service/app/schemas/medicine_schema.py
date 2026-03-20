"""
medicine_schema.py — Pydantic models for request/response validation.

Pydantic ensures that the data going OUT of this service always has a
consistent shape, even if the AI returns garbage. Think of it as a
contract: "I promise my response will always look like THIS."
"""

from pydantic import BaseModel
from typing import Optional


class MedicineData(BaseModel):
    """
    The 4 fields we extract from a medicine image.
    Every field is Optional because the AI may not find it.
    """
    medicine_name: Optional[str] = None
    expiry_date: Optional[str] = None
    batch_number: Optional[str] = None
    price: Optional[float] = None


class ExtractionResponse(BaseModel):
    """
    The full response shape returned by POST /extract.
    
    Examples:
        Success:  { "status": "success", "data": { ... } }
        Partial:  { "status": "partial", "data": { ... }, "warning": "..." }
        Error:    { "status": "error", "message": "..." }
    """
    status: str  # "success" | "partial" | "error"
    data: Optional[MedicineData] = None
    message: Optional[str] = None
    warning: Optional[str] = None
    raw_response: Optional[str] = None
