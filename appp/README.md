# GRACE-X Sport + Racing — Deploy Beta (Backend + Frontend)

This bundle gives you:
- **Frontend**: `frontend/index.html` (your slick UI, patched to use backend + client-key)
- **Backend**: `backend/server.js` (OpenAI brain + football live + racing wrapper)
- **Simple paywall**: set `CLIENT_KEYS` in `.env` and the frontend sends `x-client-key`

## 1) Local run (fastest)

**Prereqs:** Node.js 18+

```bash
cd backend
cp .env.template .env
# edit .env (paste your keys)
npm install
npm start
```

Then open `frontend/index.html` in your browser.
- On mobile, you can host `frontend/` with any static server,
  or set `STATIC_DIR=../frontend` and the backend will serve it.

Health check:
- http://localhost:3000/api/health

## 2) Private beta distribution (your plan)

- Give each tester a **client key** (one of the values in `CLIENT_KEYS`)
- If they don’t pay, remove their key from `CLIENT_KEYS` and redeploy/restart.

## 3) Deployment (cheap / near-free)

Easiest “one box” deploy:
- Deploy **backend** on a service like Render/Railway/Fly
- Set env vars in the host dashboard
- Set `STATIC_DIR=frontend` if you deploy the whole folder so it serves the UI too.

Notes:
- Keep API keys **server-side** (in env), not in the HTML.
- Predictions are never guaranteed. Use responsibly.


## 0) What’s included (routes)

Backend endpoints:
- GET `/api/health`
- GET `/api/racing/upcoming`
- GET `/api/racing/race/:race_id/standard`
- GET `/api/football/live`
- GET `/api/football/fixtures` (API-SPORTS pass-through filters)
- POST `/api/brain/analyse`

## 3) Smoke tests

After `npm start`:
- http://localhost:3000/api/health
- http://localhost:3000/api/racing/upcoming
- http://localhost:3000/api/football/live

Brain test (example):
```bash
curl -X POST http://localhost:3000/api/brain/analyse \
  -H "Content-Type: application/json" \
  -d '{"sport":"racing","query":"Rank top 3 picks","data":{},"context":{}}'
```

If `CLIENT_KEYS` is set, add:
`-H "x-client-key: YOUR_KEY"`
