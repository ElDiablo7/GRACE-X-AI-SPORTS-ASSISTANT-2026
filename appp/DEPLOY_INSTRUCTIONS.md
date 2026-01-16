# GRACE-X Sport™ Deployment Instructions

You are ready to deploy! Here is exactly what you need to do to get this live.

## 1. Local Testing (How to view it NOW)

**CRITICAL**: You must run the server to see the real data.

1.  Open your terminal.
2.  Run: `npm start`
3.  Open your browser to: **[http://localhost:3000](http://localhost:3000)**

**DO NOT** just double-click `index.html`. It needs the server to talk to the premium APIs.

---

## 2. Deployment Steps (Getting it Online)

To share this with others (private beta), you need to host the backend.

### Option A: Render.com (Easiest / Free Tier)

1.  **Push your code** to GitHub (or upload).
2.  Create a **New Web Service** on Render.
3.  Connect your repository.
4.  **Settings**:
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Copy these from your `.env` file):
    *   `OPENAI_API_KEY`: (Your key)
    *   `FOOTBALL_API_KEY`: (Your key)
    *   `RACING_USERNAME`: (Your user)
    *   `RACING_PASSWORD`: (Your pass)
    *   `RACING_REGION_CODES`: `gb`
    *   `CLIENT_KEYS`: `beta-user-1,beta-user-2` (Create keys for your users)

### Option B: Railway.app (Robust)

1.  Login to Railway.
2.  "New Project" > "Deploy from GitHub".
3.  Add your variables in the "Variables" tab.
4.  It will auto-detect Node.js and deploy.

---

## 3. Private Beta Access

1.  Once deployed, give your users the **URL**.
2.  Give them a **Client Key** (e.g., `beta-user-1`).
3.  When they open the site, they paste the key into the "Client Key" box to unlock the Pro features.

## 4. Troubleshooting

*   **"No Information"**: This means the API is working but there are no *live* games right now. This is correct behavior for a real app.
*   **"Feed Offline"**: The backend is not reachable. Check your server logs.

**Status**:
*   ✅ Horse Racing API: **Connected** (GB Region)
*   ✅ Football API: **Connected** (API-SPORTS)
*   ✅ Voice: **Enabled** (Click to activate)
*   ✅ Minigames: **Ready** (Paper Toss)
