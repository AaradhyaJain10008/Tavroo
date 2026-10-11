# 🛑 PROJECT ARCHITECTURE & CONTINUITY TRANSMISSION LOG

> CAUTION TO NEW IDE: Read this file entirely before executing or modifying any workspace paths.

## 📅 Last Session Footprint

- **Timestamp:** 2026-10-11 23:35 IST
- **Active Task:** Gender-Differentiated AI Models & Exact Garment Look Synthesis:
  1. **Strict Gender Model Separation:** When generating looks, Female selections exclusively display high-fashion FEMALE models, while Male selections exclusively display tailored MALE models.
  2. **Exact Clothes Matching:** Updated all upper and lower lookbook mappings in `showcase-engine.js` so the AI-generated picture displays the exact piece chosen (e.g. Coffee Contrast Zip Polo, Navy Stripe Sweatshirt, Boho Peasant Blouse, Urban Graphic Tee, Washed Flare Denim, Stone Tailored Trousers).
  3. **New Model Lookbook Assets Added:** Generated and integrated 13 high-resolution on-model lookbook studio photos (`male-navy-stripe-sweatshirt.jpg`, `male-chocolate-pinstripe-shirt.jpg`, `male-indigo-denim-shirt.jpg`, `male-olive-colourblock-shirt.jpg`, `male-chicago-jersey-tee.jpg`, `male-crane-embroidered-shirt.jpg`, `male-stone-tailored-trousers.jpg`, `male-light-wide-leg-jeans.jpg`, `male-olive-utility-cargos.jpg`, `male-ivory-minimal-joggers.jpg`, `male-navy-pinstripe-trousers.jpg`, `male-charcoal-relaxed-jeans.jpg`, and `female-urban-graphic-tee.jpg`).
  4. **State Machine Polish:** Implemented `getLookResultInfo()`, enabled bottom-only generation, synced `updateGenerateBtn` with both tops and bottoms, and added auto-clearing of stale garments when switching departments.
  5. **Automated Verification:** Verified via browser subagent across both Female and Male departments that generated images strictly showcase the selected clothes on gender-matched models.
- **Previous Session Footprint (2026-10-11 22:45 IST):**
  1. **Men's Upper / Tops:** Added the 5 user-provided images prominently at the start of the Men's Upper collection (*Coffee Contrast Zip Polo*, *Navy Stripe Polo Sweatshirt*, *Mauve Half-Zip Street Polo*, *Ivory Racing Stripe Polo*, *Rust Open-Collar Resort Polo*).
  2. **Image Loading CORS Fix:** Removed unnecessary `crossorigin="anonymous"` attribute on garment thumbnails in `showcase-engine.js`.
  1. **Female Upper / Tops:** Refined to exactly the top 7 curated tops. Moved the 8th top (*Midnight Satin Drape Shirt*) into the Men's upper section.
  2. **Female Lowers / Bottoms:** Retained the 4th option (*Washed Flare Denim*) and added the user's high-fashion denim and suiting collection (*Cuffed Barrel Leg Denim*, *Sky Wash Flare Denim*, *Relaxed Turn-Up Denim*, *Vintage Wide-Leg Denim*, *Cross-Waist Stone Trousers*).
  3. **Male Lowers / Bottoms:** Moved previous female bottoms (*Stone Tailored Trousers*, *Light Wide-Leg Denim*, *Olive Utility Cargos*, *Ivory Minimal Joggers*, *Navy Pinstripe Trousers*) to the Men's lower section along with existing male denim/cargos.
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

