# 🚂 Railway Deployment Guide: All-in-One Fullstack Deployment

Railway is an excellent choice for this project because it allows you to host your Database, Python service, and Node.js backend all inside one single project dashboard.

---

## Step 1: Setup Your Railway Project
1. Go to [Railway.app](https://railway.app/) and log in with your GitHub account.
2. Click **+ New Project**.
3. Select **Provision MongoDB**. 
   - Railway will immediately create a live MongoDB database for you.

---

## Step 2: Deploy the Python AI Service
1. Inside your new Railway project, click **+ New** (top right) or the "Empty Square" button.
2. Select **GitHub Repo** and choose your `Medicine-Image-Extraction` repository.
3. Once the service is added, click on it and go to the **Settings** tab:
   - **Service Name:** Change to `python-ai-service`
   - **Root Directory:** Set to `python-ai-service`
4. Go to the **Variables** tab and click **+ New Variable**:
   - `GEMINI_API_KEY`: *(Paste your Gemini Key)*
   - `ENVIRONMENT`: `production`
5. Go to **Networking** and click **Generate Domain**. Copy this URL (e.g., `https://python-ai-service-production.up.railway.app`).

---

## Step 3: Deploy the Node.js Backend
1. Click **+ New** again -> **GitHub Repo** -> choose the same repository.
2. Click on this new service and go to **Settings**:
   - **Service Name:** Change to `node-backend`
   - **Root Directory:** Set to `node-backend`
3. Go to the **Variables** tab. Railway makes this easy:
   - Click **+ New Variable** -> **Add Reference**.
   - Select your **MongoDB** service and choose **MONGODB_URL**. (Railway will automatically link them!)
   - Add another variable:
     - `PYTHON_API_URL`: *(Paste the Python Service URL from Step 2)*
     - `PORT`: `3000`
4. Go to **Networking** and click **Generate Domain**. Copy this URL.

---

## Step 4: Deploy the Frontend
You can deploy the frontend on Railway as well for simplicity:
1. Click **+ New** -> **GitHub Repo** -> choose the same repository.
2. Click on it and go to **Settings**:
   - **Service Name:** `medicine-frontend`
   - **Root Directory:** `frontend`
3. Go to the **Variables** tab:
   - `VITE_API_URL`: *(Paste the Node Backend URL from Step 3)*
4. Go to **Networking** and click **Generate Domain**.

---

## ✅ Final Deployment Checklist
- [ ] **Python AI Service:** Has `GEMINI_API_KEY`.
- [ ] **Node Backend:** Has `MONGO_URL` (linked to Railway MongoDB) and `PYTHON_API_URL`.
- [ ] **Frontend:** Has `VITE_API_URL` pointing to the Node Backend.

**Note on Costs:** Railway gives you a $5 trial credit. Once that runs out, you may need to add a credit card to keep the services running. If you want a 100% free forever option, the **Render + MongoDB Atlas** guide (Step 1) is still your best bet!
