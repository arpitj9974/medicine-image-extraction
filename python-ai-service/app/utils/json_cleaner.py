"""
json_cleaner.py — Strips unwanted text from AI responses.

WHY THIS EXISTS:
Even with a perfect prompt, Gemini sometimes returns things like:

    "Here is the extracted data:\n```json\n{\"medicine_name\": ...}\n```"

This module takes that messy string and extracts ONLY the JSON part.
"""

import json
import re


def clean_ai_response(raw_text: str) -> dict:
    """
    Attempt to parse valid JSON from a potentially messy AI response.
    
    Strategy (in order):
    1. Try direct json.loads() — maybe the AI behaved perfectly.
    2. Try extracting JSON from markdown code fences (```json ... ```).
    3. Try finding the first { ... } block in the text.
    4. Give up and raise ValueError.
    
    Args:
        raw_text: The raw string response from Gemini.
        
    Returns:
        A Python dictionary parsed from the JSON.
        
    Raises:
        ValueError: If no valid JSON can be found.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("AI returned an empty response")

    text = raw_text.strip()

    # ─── Strategy 1: Direct parse ───
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # ─── Strategy 2: Extract from markdown code fences ───
    # Matches: ```json { ... } ``` or ``` { ... } ```
    code_fence_pattern = r"```(?:json)?\s*(\{[\s\S]*?\})\s*```"
    match = re.search(code_fence_pattern, text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # ─── Strategy 3: Find first { ... } block ───
    brace_pattern = r"\{[\s\S]*\}"
    match = re.search(brace_pattern, text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    # ─── All strategies failed ───
    raise ValueError(
        f"Could not extract valid JSON from AI response. Raw text: {text[:200]}"
    )
