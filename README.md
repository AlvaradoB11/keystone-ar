# Keystone Dam AR Exhibit

A WebAR experience that overlays historical information on 9 archival photographs from the construction of Keystone Dam (Tulsa District, U.S. Army Corps of Engineers). Built with [MindAR.js](https://hiukim.github.io/mind-ar-js-doc/) and Three.js — no build tools, no npm in production.

---

## How It Works

Point your phone camera at any of the 9 exhibit photographs. When a photo is recognized:

1. A **floating name label** appears above the image.
2. **Tap the label** to expand a full description card.
3. **Tap the card** (or move away) to collapse it back.

All 9 images can be tracked simultaneously.

---

## Live Demo

Hosted on GitHub Pages: `https://<your-username>.github.io/<repo-name>/`

---

## Project Structure

```
/
├── index.html          ← Single-page AR app (CDN-only, no bundler)
├── targets.mind        ← Compiled MindAR image target database (binary)
├── assets/
│   ├── target-1.jpg    ← Flood Relief at Riverside
│   ├── target-2.jpg    ← Turbine Chamber Interior
│   ├── target-3.jpg    ← Keystone Dam Brochure, 1958
│   ├── target-4.jpg    ← Spillway Construction Aerial
│   ├── target-5.jpg    ← Hyde Cranes at the Spillway
│   ├── target-6.jpg    ← Reservoir Basin Aerial
│   ├── target-7.jpg    ← Arkansas River Diversion
│   ├── target-8.jpg    ← Channel Excavation Trench
│   └── target-9.jpg    ← Spillway Excavation, Looking South
├── compile.mjs         ← Node.js script to recompile targets.mind
├── package.json        ← Dev dependencies (compiler only)
└── README.md
```

---

## Replacing Images & Recompiling targets.mind

### Step 1 — Replace images

Drop your new JPEG files into `assets/` and name them `target-1.jpg` through `target-9.jpg`.  
You can use fewer than 9 — just update the `TARGETS` array in `index.html` and the image paths in `compile.mjs`.

### Step 2 — Install compiler dependencies (one-time)

```bash
npm install
```

> Requires Node.js 18+. On Windows, if the `canvas` package fails to build natively, run:
> ```bash
> cd node_modules/canvas && npx prebuild-install -r napi
> ```

### Step 3 — Recompile

```bash
node compile.mjs
```

This overwrites `targets.mind` in the project root. Compilation takes **2–10 minutes** depending on image size and CPU.

### Step 4 — Commit and push

```bash
git add targets.mind assets/
git commit -m "update AR targets"
git push
```

---

## Enabling GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose **main** branch, **/ (root)** folder.
5. Click **Save**.

Your site will be live at `https://<username>.github.io/<repo>/` within a few minutes.

> `targets.mind` must be committed to the repo root — it is not generated at runtime.

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome for Android | ✅ Recommended |
| Safari (iOS 15+) | ✅ Works (requires HTTPS) |
| Firefox for Android | ⚠️ Limited — WebRTC inconsistencies |
| Desktop Chrome/Edge | ✅ Works with a webcam |
| Desktop Safari | ⚠️ May require macOS 12+ |

**HTTPS is required.** Camera access is blocked by browsers on plain HTTP (except `localhost`).

---

## Camera Permission Instructions

### Android (Chrome)
1. Open the site URL in Chrome.
2. Tap **Allow** when the browser asks for camera access.
3. If you accidentally denied: go to **Settings → Site settings → Camera**, find the site, and set to **Allow**.

### iPhone / iPad (Safari)
1. Open the site in Safari.
2. Tap **Allow** for camera access.
3. If denied: **Settings → Safari → Camera** → set to **Ask** or **Allow**.

### Desktop (Chrome/Edge)
1. Click the **camera icon** in the address bar.
2. Select **Allow**.

---

## Technical Notes

- `index.html` uses CDN script tags only — no local JS files, no bundler required to run.
- MindAR.js v1.2.5 via jsDelivr (`mindar-image-three.prod.js`)
- Three.js r128 is bundled inside MindAR's prod build.
- All 9 anchors are registered at indices 0–8 in `index.html`.
- Overlays are positioned using Three.js world-to-screen projection on each animation frame.
