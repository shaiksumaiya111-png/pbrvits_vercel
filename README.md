# PBRVITS AI Chatbot — Vercel Version (100% Free)

## 📁 Project Structure (IMPORTANT — keep exactly this structure)
```
pbrvits-chatbot/
├── api/
│   └── chat.js       ← Backend serverless function
├── public/
│   └── index.html    ← Frontend chatbot UI
├── package.json
└── vercel.json       ← Vercel routing config
```

---

## 🚀 Deploy to Vercel — Step by Step

### Step 1 — Upload to GitHub
1. Go to https://github.com → Log in
2. Click **New Repository**
   - Name: `pbrvits-chatbot`
   - Set to **Public**
   - Click **Create Repository**
3. Upload ALL files keeping the folder structure:
   - `vercel.json` (root)
   - `package.json` (root)
   - `api/chat.js` (inside api folder)
   - `public/index.html` (inside public folder)

> ⚠️ Make sure `chat.js` is inside a folder called `api` and `index.html` is inside `public`

---

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com → Sign up with GitHub (free)
2. Click **Add New Project**
3. Select your `pbrvits-chatbot` repo → Click **Import**
4. In the settings page, scroll to **Environment Variables:**
   - Click **Add**
   - Name:  `GEMINI_API_KEY`
   - Value: `AIzaSy...` (paste your full Google API key)
   - Click **Add**
5. Click **Deploy** 🚀
6. Wait ~1 minute → You get a free URL like:
   `https://pbrvits-chatbot.vercel.app` ✅

---

### Step 3 — Embed on College Website
Paste this into any page of pbrvits.ac.in:

```html
<iframe
  src="https://pbrvits-chatbot.vercel.app"
  width="100%"
  height="600px"
  style="border:none; border-radius:16px;">
</iframe>
```

---

## 💰 Cost — Completely Free!
| Service | Cost |
|---------|------|
| Vercel Hobby Plan | FREE forever |
| Google Gemini 1.5 Flash | FREE (1500 req/day) |
| **Total** | **₹0/month** |

---

## ❓ Troubleshooting
- **"Function not found" error?** Make sure `chat.js` is inside the `api/` folder
- **"Invalid API key" error?** Double-check the GEMINI_API_KEY in Vercel settings
- **Chatbot not loading?** Make sure `index.html` is inside the `public/` folder
