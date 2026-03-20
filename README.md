# Medicine Image Extraction System

An AI-powered system that extracts medicine details (name, expiry date, batch number, price) from packaging images using Google Gemini Vision API.

## Architecture

```
User Upload → Node.js Backend → Python FastAPI → Gemini Vision AI → JSON → MongoDB
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| AI Service | Python 3.10+ / FastAPI |
| Backend API | Node.js / Express |
| Database | MongoDB |
| AI Provider | Google Gemini 1.5 Flash |
| File Upload | Multer (Node) / UploadFile (FastAPI) |

## Quick Start

### 1. Python AI Service
```bash
cd python-ai-service
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Node.js Backend
```bash
cd node-backend
npm install
cp .env.example .env
# Add your MONGO_URI to .env
npm run dev
```

### 3. Test
```bash
# Upload a medicine image via Postman
POST http://localhost:3000/api/medicine/upload
Body: form-data, key: "image", value: <your_image.jpg>
```

## API Endpoints

| Method | URL | Service | Purpose |
|--------|-----|---------|---------|
| POST | `/extract` | Python :8000 | Extract data from image |
| POST | `/api/medicine/upload` | Node :3000 | Upload + extract + save |
| GET | `/api/medicine` | Node :3000 | List all records |
| GET | `/api/medicine/:id` | Node :3000 | Get single record |
| GET | `/health` | Both | Health check |

## Extracted Fields
- `medicine_name` — Full name with dosage
- `expiry_date` — Expiry date as printed
- `batch_number` — Batch/Lot number
- `price` — MRP (Maximum Retail Price)

## Project Structure
```
├── python-ai-service/       # AI extraction microservice
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── extractor.py      # Extraction orchestrator
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Gemini API integration
│   │   ├── schemas/           # Pydantic models
│   │   └── utils/             # JSON cleaner utility
│   └── requirements.txt
│
└── node-backend/             # Main backend API
    ├── src/
    │   ├── server.js          # Entry point
    │   ├── app.js             # Express configuration
    │   ├── controllers/       # Request handlers
    │   ├── services/          # Python API client
    │   ├── models/            # Mongoose schemas
    │   ├── middleware/        # Upload + error handling
    │   └── config/            # Database connection
    └── package.json
```
