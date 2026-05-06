# 🚀 Final Deployment Guide: Medicine Image Extraction

This is the confirmed, final guide for your deployment on **Render** and **Vercel**.

---

### Phase 1: Database (MongoDB Atlas) - [Optional]
*   **Sign Up:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
*   **Security:** Scroll to **Security -> Network Access** and click **Allow Access from Anywhere** (0.0.0.0/0).
*   **Link:** Copy your connection string from **Connect -> Drivers**.

---

### Phase 2: Python AI Service (Render)
*   **Repo:** `Medicine-Image-Extraction`
*   **Root Directory:** `python-ai-service`
*   **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
*   **Variable:** `GEMINI_API_KEY` = *(Your Gemini Key)*

---

### Phase 3: Node.js Backend (Render)
*   **Repo:** `Medicine-Image-Extraction`
*   **Root Directory:** `node-backend`
*   **Variables:**
    *   `MONGO_URI`: *(Your MongoDB link)*
    *   `PYTHON_API_URL`: *(Link to Phase 2 Service)*
    *   `PORT`: `3000`

---

### Phase 4: Frontend UI (Vercel)
*   **Repo:** `Medicine-Image-Extraction`
*   **Root Directory:** `frontend`
*   **Variable:** `VITE_API_URL` = *(Link to Phase 3 Service)*

---

### 💡 Pro-Tips for Free Users:
1.  **First Upload Delay:** On the free tier, the first request after a break will take about 50 seconds. This is normal.
2.  **No Trailing Slashes:** Ensure your URLs do not end with a `/` (e.g., use `.com`, not `.com/`).
3.  **Redeploy:** If you change an environment variable, you must click **Manual Deploy** in Render or **Redeploy** in Vercel.
