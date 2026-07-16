# CostCompass — Deployment Guide
## From zero to live in ~15 minutes

---

## STEP 1 — Get your Anthropic API key (2 min)

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click "API Keys" in the left sidebar
4. Click "Create Key", name it "CostCompass"
5. Copy the key — it starts with `sk-ant-...`
6. Keep it somewhere safe (you won't see it again)

---

## STEP 2 — Set up the project (3 min)

You'll need Node.js installed. Check with:
```
node --version
```
If not installed: https://nodejs.org (download the LTS version)

Then in your terminal:
```bash
# Unzip the costcompass folder, then:
cd costcompass
npm install

# Copy the env template
cp .env.example .env
```

Open `.env` and paste your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
```

---

## STEP 3 — Test locally (1 min)

```bash
npm run dev
```

Open http://localhost:5173 in your browser.
Upload the included `logistics_test_data.xlsx` — you should see a real AI analysis!

---

## STEP 4 — Deploy to Railway (5 min)
Railway gives you a real public URL and free starter credits.

1. Go to https://railway.app and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Push your costcompass folder to a new GitHub repo first:

```bash
git init
git add .
git commit -m "Initial CostCompass deployment"
# Create a repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/costcompass.git
git push -u origin main
```

4. In Railway, select your repo
5. Railway auto-detects the config from `railway.toml`
6. Click "Variables" and add:
   ```
   ANTHROPIC_API_KEY = sk-ant-your-key-here
   ```
7. Click "Deploy" — Railway builds and deploys automatically
8. Click "Generate Domain" to get your public URL

That's it! Your app is live at something like `costcompass-production.up.railway.app`

---

## STEP 5 — Install on your phone (1 min)

**iPhone:**
1. Open your Railway URL in Safari
2. Tap the Share button (box with arrow)
3. Scroll down → "Add to Home Screen"
4. Tap "Add" — CostCompass appears on your home screen like a native app

**Android:**
1. Open your Railway URL in Chrome
2. Tap the 3-dot menu → "Add to Home Screen"
   OR tap the "Install" banner that appears in the app

---

## STEP 6 — Share with others

Just send them your Railway URL. They can:
- Use it in any browser
- Install it to their home screen (same steps as above)
- Upload their own freight data for analysis

---

## Custom domain (optional)

If you want `costcompass.com` instead of the Railway URL:
1. Buy a domain at Namecheap, Google Domains, etc.
2. In Railway → Settings → Domains → Add custom domain
3. Follow the DNS instructions Railway provides

---

## Costs

| Service | Cost |
|---------|------|
| Railway hosting | Free tier covers ~500 hrs/month; $5/mo for always-on |
| Anthropic API | ~$0.01–0.05 per analysis (very cheap) |
| Custom domain | ~$12/year (optional) |

---

## Troubleshooting

**"Analysis failed" error:**
- Check your ANTHROPIC_API_KEY is set correctly in Railway Variables
- Make sure the key hasn't expired at console.anthropic.com

**App won't start:**
- Run `npm install` again
- Make sure Node.js 18+ is installed

**Excel file not parsing:**
- Make sure your file is .xlsx or .xls format
- The app reads the sheet with the most rows automatically

---

## File structure

```
costcompass/
├── server/
│   └── index.js          # Backend API proxy (keeps your API key secure)
├── src/
│   ├── App.jsx           # Main React app
│   └── main.jsx          # React entry point
├── index.html            # HTML shell with PWA meta tags
├── vite.config.js        # Build config + PWA plugin
├── package.json          # Dependencies
├── railway.toml          # Railway deployment config
├── .env.example          # Environment variable template
└── DEPLOY.md             # This file
```
