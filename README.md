# VANGUARD DAILY — OPERATOR MANUAL
### Intelligence Portal · Hassan Group Limited

```
SYSTEM      : Vanguard Daily v1.0.0
STACK       : React 18 · Vite 5 · Tailwind CSS 3 · React Router v6 (HashRouter)
HOSTING     : GitHub Pages (static, zero-server)
LANGUAGES   : English (EN) · Bangla (BN)
THEME       : Auto-detect (prefers-color-scheme) · Manual toggle
```

---

## TABLE OF CONTENTS

1. [Architecture Overview](#1-architecture-overview)
2. [Local Development](#2-local-development)
3. [News Injection (JSON Schema)](#3-news-injection-json-schema)
4. [Deployment to GitHub Pages](#4-deployment-to-github-pages)
5. [Configuration Reference](#5-configuration-reference)
6. [Troubleshooting](#6-troubleshooting)
7. [System Constraints](#7-system-constraints)

---

## 1. ARCHITECTURE OVERVIEW

```
vanguard-daily/
├── index.html                  ← Shell + anti-flicker theme script
├── vite.config.js              ← Vite build config (base: "./")
├── tailwind.config.js          ← Tailwind + CSS variable bridge
├── postcss.config.js
├── package.json
│
├── public/
│   └── news/
│       ├── intel_en.json       ← English news repository
│       └── intel_bn.json       ← Bangla news repository
│
└── src/
    ├── main.jsx                ← React root mount
    ├── index.css               ← Global styles, CSS variables, typography
    ├── App.jsx                 ← Language Gateway + Global State (theme/lang)
    └── Dashboard.jsx           ← TopBar + Bento Grid + Sidebar + Modal
```

### Data Flow

```
User visits → Anti-flicker script → Language Gateway (localStorage check)
           → App.jsx loads → Dashboard.jsx fetches intel_{lang}.json
           → Filtered/sliced feed → Rendered in Bento Grid
                                  → Breaking items → Sidebar ticker
```

### Routing (HashRouter)

All routes use hash-based navigation (`/#/`, `/#/archive`).  
This is **required** for GitHub Pages — static hosts cannot rewrite server-side paths.

| Route        | Component   | Description               |
|--------------|-------------|---------------------------|
| `/#/`        | Dashboard   | Main feed (10 articles)   |
| `/#/archive` | Dashboard   | Full archive (all articles)|

---

## 2. LOCAL DEVELOPMENT

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_ORG/vanguard-daily.git
cd vanguard-daily

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

### Build Preview

```bash
npm run build
npm run preview
# → http://localhost:4173
```

The `dist/` directory is the production build. Verify all assets load correctly in preview before deploying.

---

## 3. NEWS INJECTION (JSON SCHEMA)

News content lives entirely in `/public/news/`. The files are fetched at runtime — no rebuild required to update content.

### Article Schema

```jsonc
{
  "id": "en-001",              // REQUIRED. Unique string per article. 
                               // Convention: "{lang}-{NNN}" e.g. "en-013", "bn-013"
  
  "headline": "...",           // REQUIRED. String. Article title / lede.
                               // For Bangla: use Unicode Bengali script directly (UTF-8).

  "category": "Global",        // REQUIRED. Enum: "Global" | "National"
                               // Controls badge rendering and sidebar filtering logic.

  "isBreaking": false,         // REQUIRED. Boolean.
                               // true  → Appears in Breaking Intelligence sidebar ticker.
                               // true  → Renders breaking indicator bar on card top edge.
                               // true  → Pulsing "BREAKING" badge rendered on card.

  "timestamp": "2026-04-29T06:00:00Z",  
                               // REQUIRED. ISO 8601 UTC string.
                               // Rendered in user's locale format by Intl.DateTimeFormat.

  "content": "..."             // REQUIRED. String. Full article body text.
                               // Displayed in the article modal on card click.
                               // Recommended length: 80–300 words.
}
```

### Full Injection Example (English)

```json
[
  {
    "id": "en-013",
    "headline": "Blunov AI Unit Launches Sovereign LLM for Government Sector",
    "category": "National",
    "isBreaking": true,
    "timestamp": "2026-05-01T09:30:00Z",
    "content": "Blunov Technology International's AI research division has unveiled a sovereign large language model purpose-built for government intelligence workflows. The model, trained on 2.4 trillion tokens of multilingual South Asian corpora, operates entirely within on-premises infrastructure with zero external API dependency."
  }
]
```

### Full Injection Example (Bangla)

```json
[
  {
    "id": "bn-013",
    "headline": "ব্লুনভ এআই ইউনিট সরকারি খাতের জন্য সার্বভৌম এলএলএম চালু করেছে",
    "category": "National",
    "isBreaking": true,
    "timestamp": "2026-05-01T09:30:00Z",
    "content": "ব্লুনভ টেকনোলজি ইন্টারন্যাশনালের এআই গবেষণা বিভাগ সরকারি গোয়েন্দা ওয়ার্কফ্লোর জন্য বিশেষভাবে তৈরি একটি সার্বভৌম বড় ভাষার মডেল উন্মোচন করেছে।"
  }
]
```

### Important Rules

- **IDs must be unique** across all articles in the same file. Duplicates will cause React key warnings and undefined render behavior.
- **Both files must be valid JSON arrays**. An extra trailing comma or missing bracket will cause the feed to silently fail. Validate with `jq . public/news/intel_en.json` before deploying.
- **`isBreaking` is strictly Boolean** (`true` / `false`), not a string. `"true"` will not work.
- **Article order = display order**. The feed renders the first 10 articles. Place the most recent articles at the top of the array.
- **No rebuild required** — JSON files are served as static assets. Update files, push to `gh-pages`, done.

---

## 4. DEPLOYMENT TO GITHUB PAGES

### One-time Setup

**Step 1 — Install the deploy helper**

```bash
npm install --save-dev gh-pages
```

**Step 2 — Configure `package.json`**

Add the `homepage` field pointing to your GitHub Pages URL:

```json
{
  "homepage": "https://YOUR_ORG.github.io/vanguard-daily",
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**Step 3 — Verify `vite.config.js` base**

```js
export default defineConfig({
  base: "./",   // ← Critical. Relative paths. Do NOT use "/" or a repo path.
  ...
})
```

**Step 4 — Authenticate GitHub**

Ensure your local git remote is authenticated (SSH key or HTTPS token with `repo` scope).

### Deploying

```bash
# Full deploy (build + push dist/ to gh-pages branch)
npm run deploy
```

This command:
1. Runs `vite build` → outputs `dist/`
2. Pushes `dist/` to the `gh-pages` branch of your repository
3. GitHub Pages serves from that branch automatically

### Manual Deploy (alternative)

```bash
npm run build
cd dist
git init
git add -A
git commit -m "deploy: vanguard-daily $(date)"
git push -f git@github.com:YOUR_ORG/vanguard-daily.git main:gh-pages
```

### After Deploy

- GitHub Pages propagation: 1–3 minutes
- Your portal will be live at: `https://YOUR_ORG.github.io/vanguard-daily`
- All routes resolve correctly via HashRouter (`/#/`, `/#/archive`)
- **No 404s** — HashRouter ensures deep links never hit the server

### Updating News Only (No Rebuild)

Since JSON files are in `/public/`, they are served verbatim:

```bash
# Edit news files
nano public/news/intel_en.json

# Rebuild and deploy
npm run deploy
```

Or, if you want to bypass the build entirely and just push updated JSON files to the `gh-pages` branch directly, you can do so via the GitHub web editor or a git commit targeting only those files.

---

## 5. CONFIGURATION REFERENCE

### Theme Tokens (`src/index.css`)

```css
/* Modify these to rebrand the portal */
:root {          /* Dark (default) */
  --bg-base:        #0D0D0D;    /* Page background */
  --bg-card:        #161616;    /* Card background */
  --bg-card-hover:  #1C1C1C;    /* Card hover state */
  --border:         #262626;    /* Primary border */
  --border-subtle:  #1E1E1E;    /* Divider lines */
  --text-primary:   #FAFAFA;    /* Headlines, primary copy */
  --text-secondary: #A1A1AA;    /* Body copy, descriptions */
  --text-muted:     #52525B;    /* Timestamps, labels, mono text */
  --accent:         #FAFAFA;    /* Accent color (breaking bar, etc.) */
  --accent-dim:     rgba(250,250,250,0.08); /* Hover fill */
}

[data-theme="light"] {
  --bg-base:        #FFFFFF;
  --bg-card:        #F4F4F5;
  /* ... override all tokens */
}
```

### Feed Limit

In `src/Dashboard.jsx`, line:

```js
const FEED_LIMIT = 10;
```

Adjust this value to change how many articles appear on the main feed before the "CONSULT SYSTEM ARCHIVE" button is shown.

### Social Links

In `src/Dashboard.jsx`, TopBar component:

```jsx
<a className="social-icon" href="https://x.com/YOUR_HANDLE" ...>
<a className="social-icon" href="https://linkedin.com/company/YOUR_ORG" ...>
<a className="social-icon" href="https://github.com/YOUR_ORG" ...>
```

---

## 6. TROUBLESHOOTING

### ❌ Bangla Characters Rendering as Squares / Boxes

**Cause:** `Hind Siliguri` font not loaded, or browser rendering pipeline not receiving correct font-family declaration.

**Fix 1 — Verify Google Fonts import is present** in `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
```

**Fix 2 — Ensure `lang` attribute is set on `<html>`:**  
The `index.html` anti-flicker script reads `localStorage.getItem('vd_lang')` and sets `document.documentElement.lang`. Verify this is being called before the React bundle loads.

**Fix 3 — Check that Bangla components receive the correct font-family:**  
All Bangla-mode text blocks in `Dashboard.jsx` should conditionally apply:
```js
fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif"
```

**Fix 4 — Force font preload** by adding to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600&display=swap">
```

---

### ❌ Theme Flicker on Page Load (Light flash before dark theme applies)

**Cause:** React renders after JS bundle parses. Without a synchronous theme script, the browser briefly shows the default (light) theme before React sets the correct class.

**Solution:** The anti-flicker script in `index.html` must remain **inline and synchronous** — never move it to an external file or defer it:

```html
<script>
  (function () {
    try {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!prefersDark) {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {}
  })();
</script>
```

This executes synchronously during HTML parse, before the first paint, eliminating the flash entirely.

Additionally, ensure:

```css
html {
  background-color: var(--bg-base); /* set in :root, reads before React mounts */
}
```

---

### ❌ 404 on Direct URL / Page Refresh

**Cause:** Navigating directly to a URL path on a static host triggers a 404 because the server looks for a physical file at that path.

**Solution:** This repo uses `HashRouter`. All routes are `/#/path`, not `/path`. The hash portion is **never sent to the server**, so GitHub Pages always serves `index.html`, and React Router handles the rest client-side. Do not switch to `BrowserRouter` on static hosting.

---

### ❌ News Feed Not Loading (Blank page, no articles)

**Steps to diagnose:**

1. Open DevTools → Network tab. Look for `intel_en.json` or `intel_bn.json` request.
2. If **404**: The JSON files were not included in the build. Verify they live in `/public/news/`, not `/src/`.
3. If **200 but empty**: The JSON is malformed. Validate with:  
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('public/news/intel_en.json'))"
   ```
4. If **CORS error on localhost**: Run via `npm run dev`, not by opening `index.html` directly in a browser.

---

### ❌ Language Gateway Reappears Every Visit

**Cause:** `localStorage` key `vd_lang` was cleared or is being blocked (incognito mode, browser privacy extensions).

**Manual Reset (dev/testing):**

```js
// In browser console — clear language preference
localStorage.removeItem('vd_lang');
location.reload();
```

**For production users behind aggressive privacy tools:** Add a fallback — if `localStorage` is unavailable, default to `"en"` silently:

```js
const [language, setLanguage] = useState(() => {
  try { return localStorage.getItem("vd_lang") || null; }
  catch { return "en"; } // localStorage blocked
});
```

---

### ❌ `gh-pages` Deploy Fails with Permission Error

```bash
# Ensure you have write access and SSH key configured
ssh -T git@github.com

# Or set HTTPS remote explicitly
git remote set-url origin https://github.com/YOUR_ORG/vanguard-daily.git
```

---

## 7. SYSTEM CONSTRAINTS

| Constraint              | Value / Rule                                              |
|-------------------------|-----------------------------------------------------------|
| Max feed articles shown | 10 (configurable via `FEED_LIMIT` in `Dashboard.jsx`)    |
| Archive triggers when   | `allArticles.length > 10`                                 |
| Breaking sidebar source | All articles where `isBreaking === true`                  |
| Search scope            | `headline` field only (case-insensitive substring match)  |
| Animation duration      | 150ms `ease-in-out` — no exceptions                       |
| External JS libraries   | None (React + React Router only)                          |
| JSON fetch path         | `./news/intel_{lang}.json` (relative, gh-pages safe)     |
| Language persistence    | `localStorage` key: `vd_lang`                            |
| Theme persistence       | Session only — re-detected from OS on each load           |
| Routing strategy        | HashRouter — no server config required                    |

---

```
VANGUARD DAILY — INTELLIGENCE PORTAL
HASSAN GROUP LIMITED · BLUNOV TECHNOLOGY INTERNATIONAL
CLASSIFIED INTERNAL DOCUMENTATION — v1.0.0
```
