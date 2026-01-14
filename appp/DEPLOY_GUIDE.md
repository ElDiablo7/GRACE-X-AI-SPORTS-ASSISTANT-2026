# 🚀 Deployment Guide for GRACE-X Sport

You are ready to go live! Here is your checklist to get the app running on the web.

## 1. Stripe Setup (The Money Part)
To make the payment buttons work, you need to link your Stripe account.

1.  **Create Account**: Go to [Stripe.com](https://stripe.com) and sign up.
2.  **Get API Keys**:
    *   Go to **Developers > API Keys**.
    *   Copy the **Publishable Key** (`pk_test_...`) and **Secret Key** (`sk_test_...`).
    *   Paste them into your `.env` file (or your host's environment variables).
3.  **Create Products**:
    *   Go to **Product Catalog**.
    *   Create a product called "Pro Punter".
    *   Add a price (e.g., £12.99/month).
    *   **Crucial**: Copy the **Price API ID** (looks like `price_1Pxyz...`).
    *   *Note: You'll need to update `public/index.html` with this real Price ID instead of the placeholder.*

## 2. Going Live (Hosting)
The easiest way to host this Node.js app is **Render** or **Railway**.

### Option A: Render (Recommended)
1.  Push your code to GitHub (if you haven't already).
2.  Sign up at [render.com](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repo.
5.  **Settings**:
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
6.  **Environment Variables**:
    *   Click "Environment" and add the keys from your `.env` file:
        *   `STRIPE_SECRET_KEY`
        *   `STRIPE_PUBLISHABLE_KEY`
        *   `OPENAI_API_KEY` (if using AI)
        *   `CLIENT_KEYS` (e.g., `admin-key-1,test-key-2`)

## 3. Final Verification
*   **Test Payments**: Use Stripe's "Test Mode" card numbers (e.g., `4242 4242 4242 4242`) to buy a plan.
*   **Check AI**: Ensure "Ask Grace" responds correctly.
*   **Mobile Check**: Open the deployed URL on your phone to check the layout.

## 4. Domain Name
Once deployed, Render/Railway will give you a URL like `gracex-app.onrender.com`.
To look professional, buy a domain (e.g., `gracex.sport`) from Namecheap or GoDaddy and connect it in the Render settings.

Good luck, mate! 🚀
