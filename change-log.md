# 🛑 PROJECT ARCHITECTURE & CONTINUITY TRANSMISSION LOG

> CAUTION TO NEW IDE: Read this file entirely before executing or modifying any workspace paths.

## 📅 Last Session Footprint

- **Timestamp:** 2026-10-09 16:30 IST
- **Active Task:** Solidified `showcase.html` Solely as AI Virtual Dressing Studio & Synced Upstream Navigation:
  1. **showcase.html Primary AI Dressing Studio:**
     - `showcase.html` is the primary AI Virtual Dressing Studio powered by IMAGDressing-v1 (`showcase-engine.js` and `showcase-ai.css`).
     - Includes Step 2 Bottoms / Lowers selection, live pairing with upper garments, and custom garment upload zones.
     - Includes non-refresh `Redo Look` (seed randomization) and `Change Outfit` (reset stage) actions.
     - Features 100% zoom viewport fit (`calc(100vh - 75px)`, `object-fit: contain` with flexbox containment, zero overflow or cutoff).
     - Fully redesigned buttons with human-crafted luxury atelier styling (ivory bone primary button, obsidian glass secondary buttons, clean SVG vector glyphs, zero emojis).
  2. **Backward-Compatible Routing:**
     - `ai-dressing.html` includes zero-delay auto-redirect to `showcase.html` to prevent any broken links.
     - Site-wide navigation updated across `index.html`, `catalog.html`, `about.html`, and collection pages pointing to `showcase.html` (AI Dressing Studio).
- **Git State:** On `main`, tracking GitHub repository `AaradhyaJain10008/Tavroo` through `origin`.
- **Hosting Engine:** Continuous cloud deployment automated via GitHub Pages & Vercel.

## 📍 Last Edited Points & Core Logic

### 1. 3D Runway Atelier Engine (`app.js` & `showcase.html`)
- Restored clean, sorted classic mannequin figure geometry with elegant facial features and naturally posed runway hands.
- Smooth clearcoat PBR skin material without noise bump maps.
- Shoulder and neck fitting: 16° trapezius slope yokes, flush neckline collar rings (`y=1.568`, `radius=0.082`), no chest clipping.
- Dynamic sleeve swapping/morphing without stretching graphic decal texture weaves.
- Localized leg/torso height scaling preserving headwear circular aspect ratio.
- Footwear purged across all data structures, raycasters, and UI templates.

### 2. Cross-Device Responsive Framework (`styles.css` & `showcase.html`)
- Dedicated layout configurations for Large Desktop (1440p/4K), Standard PC, Laptop (1025px–1366px), Tablet (769px–1024px), Mobile (481px–768px), and Small Phones (<=480px).
- Sticky glassmorphic segmented tab bar for touch navigation between Avatar, 3D Runway, and Garments on portable screens.

## 🐛 Open Quirks & Technical Blocks

- None. All Three.js WebGL shaders and materials compile cleanly. Google Tag Manager (`G-D3SFVX78SR`) preserved.

## ⏭️ Immediate Next Execution Objectives

1. Verify live deployment at https://tavroo.vercel.app/
2. Validate 3D canvas interaction on touch mobile and desktop viewports.

