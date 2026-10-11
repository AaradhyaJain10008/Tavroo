# 🛑 PROJECT ARCHITECTURE & CONTINUITY TRANSMISSION LOG

> CAUTION TO NEW IDE: Read this file entirely before executing or modifying any workspace paths.

## 📅 Last Session Footprint

- **Timestamp:** 2026-10-11 19:55 IST
- **Active Task:** Top-Level Gender Filter, Dynamic Catalog Filtering, and Inclusive Pose Reset Figures:
  1. **Top-Level Gender Selection (`showcase.html` & `showcase-engine.js`):**
     - Prominent Department & Silhouette selector at the very top of the left-hand sidebar with dedicated Male, Female, and Non-Binary selectors.
     - Styled with obsidian glass, champagne gold badges, ivory active states, and clean SVG glyphs.
  2. **Dynamic Clothing Catalog Filtering:**
     - Clothing grid reacts instantly to the chosen gender department.
     - Category-specific catalog datasets for Male (Sartorial Pinstripe shirts, denim shirts, colourblock shirts, vintage heavy tees, knit polos, raw denim, tactical cargos, tailored pleat trousers), Female (Couture dresses, boho blouses, breton knits, ribbed minimal shirts, satin drape shirts, stone pleat trousers, wide-leg denim, utility cargos), and Non-Binary (Deconstructed tees, vegan leather blazers, geometric runway jackets, fluid wide-leg linen trousers, universal cargos).
  3. **Inclusive Pose Reset Figures & Diverse Base Models:**
     - Base figures library expanded to 14 inclusive postures across Female (Runway Frontal, 3/4 Editorial, Relaxed Studio, Hands on Hips Couture, Catwalk Stride), Male (Athletic Frontal, 3/4 Sartorial Turn, Hands in Pockets, Runway Walk, Tailored Profile), and Unisex (Neutral Symmetry, Fluid Angle, Studio Upright, Editorial Motion).
     - Integrated OpenPose vector skeleton illustrations and gender tags on each pose card.
     - Dedicated **"Reset Pose"** action restores the natural base model for the active gender with instant toast notification.
  4. **Dual Studio Architecture Preserved:**
     - `showcase.html` operates as the flagship AI Virtual Dressing Studio with IMAGDressing-v1.
     - `atelier.html` preserves the interactive 3D WebGL Runway Atelier engine with Three.js (`app.js`).
     - Unified navigation links across all pages (`index.html`, `showcase.html`, `atelier.html`, `catalog.html`, `about.html`).
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

