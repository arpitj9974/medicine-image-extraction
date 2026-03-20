"""
main.py — FastAPI application entry point.

Run this file to start the Python AI microservice:
    uvicorn app.main:app --reload --port 8000

Or from the project root:
    python -m uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.extract_route import router as extract_router
from app.config import ENVIRONMENT

# ═══════════════════════════════════════════
# Create the FastAPI Application
# ═══════════════════════════════════════════
app = FastAPI(
    title="Medicine Image Extraction API",
    description="AI-powered medicine data extraction from packaging images",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT == "development" else None,  # Disable docs in production
)

# ═══════════════════════════════════════════
# CORS Middleware
# In production, replace "*" with your Node.js server's URL
# ═══════════════════════════════════════════
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to Node.js server in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════
# Register Routes
# ═══════════════════════════════════════════
app.include_router(extract_router)


# ═══════════════════════════════════════════
# Health Check Endpoint
# Useful for monitoring and for Node.js to
# check if Python service is alive
# ═══════════════════════════════════════════
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "medicine-extraction-ai"}


# ═══════════════════════════════════════════
# Run with: uvicorn app.main:app --reload --port 8000
# ═══════════════════════════════════════════
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
