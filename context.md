# Medicine Image Extraction System — Full Technical Blueprint

> **Purpose of this file:** This is the master context document for the entire project. Every new session must begin by reading this file.
> **Last Updated:** 2026-03-21

---

## A. Project Overview

**What is this project?**
A backend system that accepts a photo of a medicine package, uses AI to automatically read and extract key information from that photo, and stores the structured result in a database.

**In one sentence:**
Upload a medicine image → AI reads it → Get clean JSON data → Save it to MongoDB.

**Why does this matter?**
Pharmacies, warehouses, and hospitals deal with thousands of medicines. Manually typing medicine names, expiry dates, batch numbers, and prices is slow, boring, and error-prone. This system automates that entire process.

**Who uses this?**
A pharmacy employee, a warehouse operator, or any internal user who needs to digitize medicine packaging information.

---

## B. Business Goal

| Aspect | Detail |
|---|---|
| **Problem** | Manual medicine data entry is slow and error-prone |
| **Solution** | AI-powered automated extraction from images |
| **Deliverable** | A working API that accepts an image and returns structured data |
| **Success** | The system extracts ≥4 fields accurately and saves them to DB |

**What the company wants:**
A working backend pipeline — not a research project, not a prototype. Something that receives an image, returns data, and stores it. End to end.

**This is NOT just a Python AI task.** It is a full backend integration where:
- Python = AI brain (reads the image)
- Node.js = Application backbone (manages requests, stores data)
- MongoDB = Permanent memory

---

## C. Input and Output

### Input
| Property | Value |
|---|---|
| Type | Image file |
| Formats | `.jpg`, `.jpeg`, `.png` |
| Max Size | 5 MB (recommended) |
| Content | Photo of a medicine box, strip, bottle, or label |

### Output
A JSON object with these **four mandatory fields**:

```json
{
  "medicine_name": "Paracetamol 500mg",
  "expiry_date": "12/2026",
  "batch_number": "BN-20250312",
  "price": 45.50
}
```

**Rule:** If the AI cannot find a field, its value must be `null` — never an empty string, never "not found", never omitted.

---

## D. Full System Workflow Map

### D.1 — Success Flow (Happy Path)
```text
┌─────────┐     ┌──────────────┐     ┌─────────────────────┐     ┌───────────────┐
│  USER   │────>│  Node.js     │────>│  Python FastAPI      │────>│  Gemini API   │
│ (Upload)│     │  Backend     │     │  Microservice        │     │  (Vision AI)  │
└─────────┘     └──────┬───────┘     └──────────┬──────────┘     └───────┬───────┘
                       │                         │                        │
                       │   POST /extract         │   image + prompt       │
                       │   (sends image)         │   (sends to Gemini)    │
                       │                         │                        │
                       │                         │<───── JSON response ───┘
                       │<──── clean JSON ────────┘
                       │
                       ▼
                ┌──────────────┐
                │   MongoDB    │  ← saves extracted data
                └──────┬───────┘
                       │
                       ▼
                ┌─────────┐
                │  USER   │  ← gets success response with extracted data
                └─────────┘
```

### D.2 — Validation Failure Flow
```text
USER ──> Node.js ──> VALIDATION CHECK
                          │
                          ├── File type not image? ──> 400: "Only JPG/PNG allowed"
                          ├── File too large?       ──> 400: "Max size is 5MB"
                          └── No file attached?     ──> 400: "Image is required"
                          
                     (Python is NEVER called. Fast rejection.)
```

### D.3 — AI Failure Flow
```text
USER ──> Node.js ──> Python ──> Gemini API
                                    │
                                    ├── Timeout (>30s)      ──> Python returns 503
                                    ├── Gibberish response  ──> Python returns 422
                                    └── API key invalid     ──> Python returns 401
                                    
                      Node.js receives error ──> returns 502 to user
                      MongoDB: NOTHING is saved (no garbage data)
```

### D.4 — Database Failure Flow
```text
USER ──> Node.js ──> Python ──> Gemini ──> JSON (success!)
                                              │
                                    Node.js gets good data
                                              │
                                    MongoDB save fails ──> Node.js returns 500
                                              │
                                    (IMPORTANT: Log the extracted JSON to a file
                                     so data is NOT lost even if DB is down)
```

---

## E. End-to-End Working Explanation

### Stage 1: User Upload
The user (or frontend) sends a `POST` request with an image file to the Node.js backend.
- **Technology:** HTTP multipart/form-data
- **Node.js library:** `multer` (handles file uploads)
- The file is saved temporarily to a `/uploads` folder on the Node.js server.

### Stage 2: Node.js Forwards the Image
Node.js does **not** know how to read images. It does **not** call Gemini directly. Instead, it takes the file and sends it to the Python microservice using an HTTP request.
- **Technology:** `axios` or `node-fetch` with `form-data`
- **Destination:** `http://localhost:8000/extract` (the Python server)

### Stage 3: Python Receives and Processes
The Python FastAPI service receives the image file, saves it temporarily, and sends it to the AI.
- **AI Used:** Google Gemini Vision API (model: `gemini-1.5-flash` or `gemini-1.5-pro`)
- **What Python sends to Gemini:** The image bytes + a carefully written prompt (see Section N)
- **What Gemini returns:** A text string (hopefully valid JSON)

### Stage 4: Python Cleans and Returns
Python takes the AI's response, strips away any extra text or markdown formatting, parses it into a real JSON object, and sends it back to Node.js.

**Why is this step needed?** Because AI models are not perfect. Sometimes Gemini returns:
```text
Here is the extracted data:
```json
{"medicine_name": "Crocin"}
```
```
Python must clean this to **only** the JSON part.

### Stage 5: Node.js Saves to Database
Node.js receives the clean JSON, creates a MongoDB document using Mongoose, and saves it.

### Stage 6: Response to User
Node.js sends back a final response to the user with the extracted data and a confirmation that it was saved.

---

## F. Recommended Architecture

```text
┌───────────────────────────────────────────────────────────┐
│                     SYSTEM ARCHITECTURE                    │
│                                                           │
│  ┌─────────┐    ┌─────────────┐    ┌──────────────────┐  │
│  │ Frontend │──> │  Node.js    │──> │  Python FastAPI   │  │
│  │ or       │    │  (Express)  │    │  (AI Service)     │  │
│  │ Postman  │    │  Port: 3000 │    │  Port: 8000       │  │
│  └─────────┘    └──────┬──────┘    └────────┬─────────┘  │
│                        │                     │             │
│                        ▼                     ▼             │
│                 ┌──────────┐         ┌──────────────┐     │
│                 │ MongoDB  │         │ Gemini API   │     │
│                 │ Port:    │         │ (External)   │     │
│                 │ 27017    │         └──────────────┘     │
│                 └──────────┘                               │
└───────────────────────────────────────────────────────────┘
```

---

## G. Why Python Microservice + Node.js Combination

**Why not do everything in Node.js?**

| Reason | Explanation |
|---|---|
| **AI Libraries** | Python has the best, most mature AI/ML libraries. Google's official `google-generativeai` SDK for Gemini is Python-first. |
| **Image Processing** | Libraries like Pillow (PIL) and OpenCV are Python-native. Node.js alternatives are weaker. |
| **Isolation** | If the AI service crashes or hangs, your main Node.js server keeps running. Users can still use other features. |
| **Scalability** | You can run 3 copies of the Python service behind a load balancer without touching Node.js. |
| **Team Separation** | The AI team works on Python. The backend team works on Node.js. No conflicts. |

**Why not do everything in Python?**

| Reason | Explanation |
|---|---|
| **Company Stack** | Your company likely already uses Node.js + Express + MongoDB for other services. Consistency matters. |
| **Ecosystem** | Node.js has a richer ecosystem for REST APIs, auth, middleware, and real-time features. |
| **MongoDB Integration** | Mongoose (Node.js ORM for MongoDB) is more mature and widely used than Python's alternatives. |

**The Rule:** Python does ONE thing well: extract data from images. Node.js does everything else.

---

## H. Phase-wise Development Plan

```text
Phase 1: PYTHON SCRIPT (no API yet)
   └─ Write a Python script that takes a local image file and prints JSON to the console.
   └─ This proves the AI extraction works before you build anything else.
   └─ Estimated time: 1 day

Phase 2: PYTHON API (FastAPI)
   └─ Wrap that script inside a FastAPI endpoint: POST /extract
   └─ Test it with Postman by uploading a file.
   └─ Estimated time: 1 day

Phase 3: NODE.JS SETUP
   └─ Create Express server.
   └─ Add multer for file upload.
   └─ Add a route: POST /api/medicine/upload
   └─ Make Node.js call the Python API using axios.
   └─ Estimated time: 1 day

Phase 4: MONGODB INTEGRATION
   └─ Set up MongoDB locally or Atlas.
   └─ Create Mongoose schema.
   └─ After receiving data from Python, save to MongoDB.
   └─ Estimated time: 1 day

Phase 5: ERROR HANDLING + VALIDATION + TESTING
   └─ Add file type/size validation in Node.js.
   └─ Add JSON cleaning logic in Python.
   └─ Add try/catch everywhere.
   └─ Test with 10+ different images (clear, blurry, dark, partial).
   └─ Estimated time: 2 days
```

**Why this order?**
You solve the **riskiest** part first (Can AI actually read medicine images?). If Phase 1 fails, there's no point building the rest. This is called "risk-first development."

---

## I. Full Folder Structure — Python Service

```text
python-ai-service/
├── app/
│   ├── __init__.py            # Makes this a Python package
│   ├── main.py                # FastAPI app entry point, defines routes
│   ├── routes/
│   │   ├── __init__.py
│   │   └── extract_route.py   # POST /extract endpoint definition
│   ├── services/
│   │   ├── __init__.py
│   │   └── gemini_service.py  # Talks to Gemini API, sends image + prompt
│   ├── extractor.py           # Core logic: receives image, calls service, cleans output
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── medicine_schema.py # Pydantic models for request/response validation
│   ├── utils/
│   │   ├── __init__.py
│   │   └── json_cleaner.py    # Strips markdown/extra text from AI response
│   └── config.py              # Loads environment variables (API keys, etc.)
├── uploads/                   # Temporary storage for uploaded images
├── tests/
│   ├── test_extractor.py      # Unit tests for extraction logic
│   └── test_api.py            # API integration tests
├── .env                       # GEMINI_API_KEY=your_key_here (NEVER commit this)
├── .gitignore                 # Must include: .env, uploads/, __pycache__/
├── requirements.txt           # All Python dependencies
└── README.md                  # How to run the service
```

### File Responsibilities (Python)

| File | What It Does |
|---|---|
| `main.py` | Creates the FastAPI app, includes routers, starts with `uvicorn` |
| `extract_route.py` | Defines the `POST /extract` endpoint, accepts file upload |
| `gemini_service.py` | Contains the function that calls `google.generativeai` with image+prompt |
| `extractor.py` | Orchestrates: receive image → call gemini_service → clean response → return |
| `medicine_schema.py` | Pydantic models: `MedicineResponse(medicine_name, expiry_date, ...)` |
| `json_cleaner.py` | Removes markdown code fences, "Here is..." text from AI output |
| `config.py` | `GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")` |

---

## J. Full Folder Structure — Node.js Backend

```text
node-backend/
├── src/
│   ├── app.js                        # Express app configuration (middleware, routes)
│   ├── server.js                     # Starts the server, connects to MongoDB
│   ├── routes/
│   │   └── medicineRoutes.js         # Defines: POST /upload, GET /:id
│   ├── controllers/
│   │   └── medicineController.js     # Request handling logic
│   ├── services/
│   │   └── pythonApiService.js       # Calls Python microservice via axios
│   ├── models/
│   │   └── Medicine.js               # Mongoose schema definition
│   ├── middleware/
│   │   ├── uploadMiddleware.js       # Multer configuration for file uploads
│   │   └── errorHandler.js           # Global error handling middleware
│   └── config/
│       └── db.js                     # MongoDB connection logic
├── uploads/                          # Temporary storage for uploaded images
├── .env                              # MONGO_URI, PYTHON_API_URL, PORT
├── .gitignore                        # Must include: .env, uploads/, node_modules/
├── package.json
└── README.md
```

### File Responsibilities (Node.js)

| File | What It Does |
|---|---|
| `app.js` | Sets up Express, applies CORS, JSON parsing, routes |
| `server.js` | Calls `mongoose.connect()`, then starts the Express server on PORT |
| `medicineRoutes.js` | `router.post('/upload', upload.single('image'), controller.upload)` |
| `medicineController.js` | Receives file → calls pythonApiService → saves to DB → responds |
| `pythonApiService.js` | Uses `axios` + `form-data` to POST the image to Python's `/extract` |
| `Medicine.js` | Mongoose schema with all fields (see Section K) |
| `uploadMiddleware.js` | `multer({ dest: 'uploads/', limits: { fileSize: 5MB }, fileFilter: ... })` |
| `errorHandler.js` | Catches unhandled errors, returns clean JSON error responses |
| `db.js` | `mongoose.connect(process.env.MONGO_URI)` |

---

## K. Database Schema Design (MongoDB + Mongoose)

```javascript
// models/Medicine.js
const medicineSchema = new mongoose.Schema({
  // ═══════════════════════════════════
  // EXTRACTED FIELDS (from AI)
  // ═══════════════════════════════════
  medicine_name:    { type: String, default: null },
  expiry_date:      { type: String, default: null },  // String, not Date — AI returns varied formats
  batch_number:     { type: String, default: null },
  price:            { type: Number, default: null },

  // ═══════════════════════════════════
  // METADATA FIELDS (system-generated)
  // ═══════════════════════════════════
  image_url:        { type: String, required: true },  // Path or URL to the uploaded image
  raw_ai_response:  { type: Object, default: {} },     // Full AI output for debugging
  extraction_status: {
    type: String,
    enum: ['success', 'partial', 'failed'],
    default: 'failed'
  },
  error_message:    { type: String, default: null },   // Why extraction failed (if it did)

}, { timestamps: true });  // Adds createdAt and updatedAt automatically
```

### Why Each Field Matters

| Field | Why It Exists |
|---|---|
| `medicine_name` | The primary extracted value |
| `expiry_date` | Stored as String because AI returns "12/2026", "Dec 2026", "2026-12" etc. Standardize later. |
| `batch_number` | For traceability and recall tracking |
| `price` | Stored as Number for math operations (sorting, filtering) |
| `image_url` | So you can re-check the original image if the AI was wrong |
| `raw_ai_response` | **Critical for debugging.** If a user says "price is wrong," you check what AI actually returned |
| `extraction_status` | `success` = all 4 fields found. `partial` = some fields null. `failed` = AI returned garbage |
| `error_message` | Stores the reason for failure: "AI timeout", "invalid image", etc. |
| `timestamps` | `createdAt` for record-keeping, `updatedAt` for re-processing tracking |

---

## L. API Endpoint Design

### L.1 — Python Microservice API

#### `POST /extract`

**Purpose:** Accept an image, extract medicine data using AI, return JSON.

**Request:**
```text
Method: POST
URL: http://localhost:8000/extract
Content-Type: multipart/form-data
Body: file = <medicine_image.jpg>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "medicine_name": "Crocin Advance 500mg",
    "expiry_date": "03/2027",
    "batch_number": "CR-2025-A912",
    "price": 32.50
  }
}
```

**Partial Success Response (200):**
```json
{
  "status": "partial",
  "data": {
    "medicine_name": "Dolo 650",
    "expiry_date": null,
    "batch_number": null,
    "price": 30.00
  },
  "warning": "Some fields could not be extracted"
}
```

**AI Failure Response (422):**
```json
{
  "status": "error",
  "message": "AI returned invalid response",
  "raw_response": "I cannot read this image clearly..."
}
```

**Server Error Response (500):**
```json
{
  "status": "error",
  "message": "Internal server error during extraction"
}
```

---

### L.2 — Node.js Backend API

#### `POST /api/medicine/upload`

**Purpose:** Accept image from client, orchestrate extraction via Python, save to MongoDB.

**Request:**
```text
Method: POST
URL: http://localhost:3000/api/medicine/upload
Content-Type: multipart/form-data
Body: image = <medicine_image.jpg>
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Medicine data extracted and saved",
  "data": {
    "_id": "660a1b2c3d4e5f6a7b8c9d0e",
    "medicine_name": "Crocin Advance 500mg",
    "expiry_date": "03/2027",
    "batch_number": "CR-2025-A912",
    "price": 32.50,
    "extraction_status": "success",
    "image_url": "/uploads/1711004320000-medicine.jpg",
    "createdAt": "2026-03-21T10:00:00.000Z"
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid file type. Only JPG and PNG are allowed."
}
```

**Python Service Down Response (502):**
```json
{
  "success": false,
  "message": "AI extraction service is currently unavailable. Please try again later."
}
```

---

#### `GET /api/medicine/:id`  *(Optional but recommended)*

**Purpose:** Retrieve a previously saved extraction result.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "660a1b2c3d4e5f6a7b8c9d0e",
    "medicine_name": "Crocin Advance 500mg",
    "expiry_date": "03/2027",
    "batch_number": "CR-2025-A912",
    "price": 32.50,
    "extraction_status": "success",
    "image_url": "/uploads/1711004320000-medicine.jpg",
    "raw_ai_response": { ... },
    "createdAt": "2026-03-21T10:00:00.000Z"
  }
}
```

---

## M. AI Prompt Design for Extraction

### The Production Prompt

```text
You are a precise medical data extraction system.

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

{"medicine_name": "...", "expiry_date": "...", "batch_number": "...", "price": ...}
```

### Why Prompt Design Matters

| Problem | Without Good Prompt | With Good Prompt |
|---|---|---|
| AI adds explanation | `"Here is your data: {..."` | `{"medicine_name": ...}` |
| AI uses markdown | `` ```json {...} ``` `` | `{"medicine_name": ...}` |
| Missing field | `"expiry_date": "not found"` | `"expiry_date": null` |
| Multiple prices | Random pick | Always MRP |
| Guessing | `"batch_number": "BATCH001"` | `"batch_number": null` |

**Even with a perfect prompt, AI can misbehave.** That's why `json_cleaner.py` exists as a safety net (see Section I).

---

## N. Image Upload and Processing Flow

```text
Step 1: User sends image via POST request
Step 2: Node.js multer saves file to /node-backend/uploads/ (temp)
Step 3: Node.js reads the file and sends it to Python via HTTP
Step 4: Python FastAPI receives it, saves to /python-ai-service/uploads/ (temp)
Step 5: Python reads the file bytes and sends them to Gemini API
Step 6: After AI responds, Python DELETES its temp file
Step 7: After Node.js gets the response, Node.js DELETES its temp file
```

### Key Decisions

| Question | Answer | Reason |
|---|---|---|
| Save images permanently? | **No (MVP)** | Saves disk space, reduces privacy risk |
| Delete after processing? | **Yes** | Mandatory for security |
| Allow to keep for debugging? | **Optional** | Only in development mode, never in production |
| Upload to cloud (S3)? | **Not in MVP** | Future enhancement |
| Max file size? | **5 MB** | Gemini doesn't need high-res images |

---

## O. Error Handling Plan

| Error | Where It Happens | How to Handle |
|---|---|---|
| No file uploaded | Node.js (multer) | Return `400: "Image file is required"` |
| Wrong file type (.pdf, .docx) | Node.js (multer fileFilter) | Return `400: "Only JPG/PNG allowed"` |
| File too large (>5MB) | Node.js (multer limits) | Return `400: "File exceeds 5MB limit"` |
| Python service is down | Node.js (axios call fails) | Return `502: "AI service unavailable"` |
| Gemini API timeout (>30s) | Python (httpx/requests timeout) | Return `503: "AI processing timed out"` |
| Gemini API key invalid | Python (auth error) | Return `401: "AI service authentication failed"` — log it, alert dev team |
| AI returns non-JSON text | Python (json.loads fails) | Try `json_cleaner.py`. If still fails, return `422: "AI returned invalid response"` |
| AI returns empty response | Python | Return `422: "AI returned empty response"` |
| All 4 fields are null | Node.js (post-validation) | Save with `extraction_status: "failed"` |
| Some fields are null | Node.js (post-validation) | Save with `extraction_status: "partial"` |
| MongoDB write fails | Node.js (mongoose error) | Return `500: "Database error"`. **Log the extracted data to a fallback file** |
| Image is blurry / dark | Gemini (poor quality) | AI will return nulls. System marks as `partial` or `failed` |

**Golden Rule:** Never silently swallow an error. Always return a meaningful message AND log the details.

---

## P. Validation Rules

### Node.js Side (Before calling Python)

| Check | Rule | Error Code |
|---|---|---|
| File exists | Request must have a file attached | 400 |
| File type | Must be `image/jpeg` or `image/png` | 400 |
| File size | Must be ≤ 5 MB | 400 |
| File name | Sanitize to prevent path traversal (`../../etc/passwd`) | 400 |

### Python Side (After AI responds)

| Check | Rule | Action |
|---|---|---|
| Response is valid JSON | `json.loads()` must not throw | Try json_cleaner, then return 422 |
| Required keys exist | Must have all 4 keys in the object | Fill missing keys with `null` |
| Price is a number | `price` must be numeric or null | Convert if possible, else `null` |
| No hallucinated data | If prompt said "don't guess", trust it | Log `raw_ai_response` for audit |

### Node.js Side (After receiving Python response)

| Check | Rule | Action |
|---|---|---|
| All fields null | AI couldn't read anything | Save with `extraction_status: "failed"` |
| Some fields null | Partial read | Save with `extraction_status: "partial"` |
| All fields filled | Full success | Save with `extraction_status: "success"` |
| Schema validation | Mongoose schema enforces types | Mongoose throws on invalid data |

---

## Q. Testing Strategy

### Q.1 — Unit Tests

| Test Case | What to Test | Expected Result |
|---|---|---|
| Clean image test | Clear photo of a medicine box | All 4 fields extracted correctly |
| Blurry image test | Out-of-focus photo | Some/all fields are null, status is `partial` or `failed` |
| Missing text test | Image where price is hidden | Price is null, others extracted |
| Dark image test | Very low light photo | Graceful degradation, no crash |

### Q.2 — API Tests (Postman/curl)

| Test Case | How | Expected |
|---|---|---|
| Happy path | POST image to `/extract` | 200 with all fields |
| No file | POST without file | 400 error |
| Wrong type | POST a .pdf file | 400 error |
| Large file | POST a 10MB image | 400 error |

### Q.3 — Integration Tests

| Test Case | How | Expected |
|---|---|---|
| Full pipeline | POST image to Node.js `/upload` | Data saved in MongoDB |
| Python down | Stop Python server, POST to Node.js | 502 error, nothing in DB |
| DB down | Stop MongoDB, POST to Node.js | 500 error, data logged to fallback file |

### Q.4 — Realistic Test Images to Collect
1. Medicine box — front face (clear text)
2. Medicine strip — foil pack with tiny text
3. Syrup bottle — curved label
4. Medicine with sticker-covered MRP
5. Blurry photo taken in bad lighting
6. Photo with multiple medicines in frame
7. Photo captured at an angle
8. Medicine with text in regional language + English

---

## R. Real-World Challenges

| Challenge | Why It's Hard | How to Handle |
|---|---|---|
| Different packaging layouts | Every pharma company designs differently | Rely on AI (Gemini is good at this), test widely |
| Tiny text on strips | Phone cameras may not capture clearly | Ask users to take close-up shots; document this |
| Multiple prices (MRP, Net Price, Offer Price) | AI might pick the wrong one | Prompt specifically says "MRP" |
| Batch number formats vary | "B.No.", "Batch:", "Lot No.", "L/N" | AI handles synonyms well; test to confirm |
| Expiry in different formats | "EXP 12/26", "Best Before Dec 2026", "Exp. Date: 2026-12" | Store as string, normalize later |
| Shiny/reflective packaging | Camera flash causes glare | Advise users, but system must handle gracefully (return nulls) |
| Regional language text | Hindi, Tamil, etc. mixed with English | Gemini supports many languages; test with samples |
| AI occasionally hallucinates | Gemini might "read" text that isn't there | Validate against reasonable patterns; store raw_ai_response |

---

## S. Security and Environment Variables

### .env Files (Both services)

**Python `.env`:**
```env
GEMINI_API_KEY=AIzaSy...your_key_here
ENVIRONMENT=development
AI_TIMEOUT_SECONDS=30
```

**Node.js `.env`:**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/medicine_db
PYTHON_API_URL=http://localhost:8000
NODE_ENV=development
```

### Security Checklist

| Rule | Why |
|---|---|
| Never commit `.env` to Git | API keys in GitHub = security breach |
| Add `.env` to `.gitignore` | Prevents accidental commits |
| Use `dotenv` package | Standard way to load env vars |
| Restrict CORS | Only your frontend domain should call Node.js |
| Restrict Python API access | Only Node.js server IP should call Python |
| Sanitize filenames | Prevent directory traversal attacks |
| Limit upload size | Prevent denial-of-service via giant files |
| Rate limiting | Prevent one user from flooding the API |

---

## T. Mandatory MVP vs Optional Enhancements

### Mandatory (Must Build for MVP)
- [x] Python script that extracts data from a medicine image
- [ ] FastAPI endpoint `POST /extract`
- [ ] Node.js Express endpoint `POST /api/medicine/upload`
- [ ] Multer file upload handling
- [ ] Axios call from Node.js to Python
- [ ] MongoDB schema and save logic
- [ ] Basic error handling (try/catch everywhere)
- [ ] `.env` configuration for API keys

### Good Improvements (Build after MVP works)
- [ ] File type and size validation
- [ ] JSON cleaning utility in Python
- [ ] Extraction status tracking (success/partial/failed)
- [ ] Temporary file cleanup after processing
- [ ] GET endpoint to retrieve past extractions
- [ ] Logging (use `winston` in Node, `logging` in Python)

### Advanced Future Enhancements
- [ ] Cloud image storage (AWS S3 or GCP Cloud Storage)
- [ ] User authentication (JWT-based)
- [ ] Admin dashboard to review/correct extractions
- [ ] Re-extraction: re-process an image with a better prompt
- [ ] Batch upload: process multiple images at once
- [ ] Custom AI model training for better accuracy
- [ ] Webhook notifications on extraction completion
- [ ] Caching to avoid re-processing the same image

---

## U. Missing Requirement Analysis

> **These are things the company project brief does NOT clearly define.** You should raise these with your manager.

| Missing Requirement | Why It Matters | Recommended Action |
|---|---|---|
| **Frontend** | Who builds it? What framework? | Ask: is frontend in scope, or is Postman enough? |
| **Authentication** | Who is allowed to upload? Everyone? Only logged-in users? | Ask: do we need login? |
| **Accuracy Target** | What % accuracy is "acceptable"? 80%? 95%? | Ask: what's the threshold? |
| **Deployment Plan** | Where will this run? Local? AWS? Docker? | Ask: what's the deployment target? |
| **Image Storage** | Keep images forever? Delete after extraction? Cloud storage? | Ask: what's the retention policy? |
| **Error Contract** | What should the frontend show when AI fails? | Define error codes and messages now |
| **Rate Limiting** | How many requests per minute? | Important for Gemini API cost control |
| **Multi-language** | Will medicines have non-English text? | Test Gemini with regional language packs |
| **Audit Trail** | Does the company need to know who uploaded what and when? | Affects schema design and auth requirements |
| **Gemini API Cost** | Who pays? Is there a budget? What if costs spike? | Set up usage alerts in Google Cloud |

---

## V. Professional Summary (For Your Manager)

> "The Medicine Image Extraction System is designed using a microservice architecture that separates concerns between AI processing and core business logic. The AI extraction layer is implemented as a Python-based FastAPI microservice that interfaces with Google's Gemini Vision API to perform optical character recognition and structured data extraction from medicine packaging images. This service returns validated JSON containing the medicine name, expiry date, batch number, and MRP.
>
> The application backbone is a Node.js/Express backend that manages the request lifecycle — handling file uploads via multer, orchestrating the extraction workflow by communicating with the Python microservice, and persisting results to a MongoDB database using Mongoose ODM.
>
> This architecture ensures fault isolation (an AI failure does not bring down the main API), independent scalability (the AI service can be scaled horizontally based on load), and clean team boundaries (AI and backend can be developed in parallel). The system includes comprehensive error handling for edge cases such as unclear images, AI timeouts, and database failures."

---

## W. Final Implementation Checklist

```text
STEP 1: ✅ Read and understand this context document
STEP 2: 🔲 Install Python 3.10+, Node.js 18+, MongoDB
STEP 3: 🔲 Get Google Gemini API key from Google AI Studio
STEP 4: 🔲 Create python-ai-service/ folder structure
STEP 5: 🔲 Write extractor.py — test with 1 local image
STEP 6: 🔲 Write main.py with FastAPI — test with Postman
STEP 7: 🔲 Create node-backend/ folder structure
STEP 8: 🔲 Write app.js + medicineRoutes.js + multer setup
STEP 9: 🔲 Write pythonApiService.js — call Python API
STEP 10: 🔲 Write Medicine.js schema + db.js connection
STEP 11: 🔲 Write medicineController.js — full pipeline
STEP 12: 🔲 Test full flow: upload → extract → save → respond
STEP 13: 🔲 Add error handling and validation
STEP 14: 🔲 Test with 10+ different medicine images
STEP 15: 🔲 Clean up temp files, secure .env, write README
```

---

## X. Quick Reference Card

| What | Technology | Port |
|---|---|---|
| AI Service | Python + FastAPI | 8000 |
| Backend API | Node.js + Express | 3000 |
| Database | MongoDB | 27017 |
| AI Provider | Google Gemini Vision | External |
| File Upload | multer (Node) / UploadFile (FastAPI) | — |
| HTTP Client | axios (Node) / built-in (Python) | — |
| DB ORM | Mongoose (Node) | — |

---

> **Remember:** Always read this file first when starting a new session on this project.
