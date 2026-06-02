# Design Intent & Prompt History

## 🎨 Frutiger Aero Aesthetics
Frutiger Aero (popularized between 2004 and 2013) is characterised by:
- Shiny, glossy texture gradients (resembling glass spheres or wet pebbles).
- Vibrant organic color palettes (sky blue, lime green, bright pink, pristine white).
- Liquid and bubble motifs (water droplets, floating spheres, auroras).
- Glassmorphism (semi-transparent backdrops with strong blurs).

We leveraged this design language by using:
1. **Mouse Bubble Trails:** Adding instant interactivity directly under the cursor.
2. **Globular Navigation:** Constructing 3D-like glass bubble cards that react to mouse hover.
3. **Smooth Zoom Effects:** Expanding the bubble into the viewport to mask the navigation delay.

---

## 🎟️ eGift Card & 3D Flipping Design
To make the e-gift experience memorable and premium, we created a digital "Golden Ticket":
- **Front Side:** Uses warm golden radial gradients (`from-yellow-300 via-amber-400 to-amber-600`), card gloss reflections, and large clean labels to look like a physical luxury voucher.
- **Back Side:** Mimics a high-tech holographic boarding pass (`from-indigo-900 via-purple-900 to-pink-900`) showing the voucher code, custom claim instructions, and a rendered vector barcode.
- **3D Flip Effect:** Programmed via CSS 3D transforms:
  ```css
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
  ```

---

## ⚙️ TOML Config Separation Architecture
To enable easy annual updates, we separated static parameters and code:
- **`config.toml`**: Houses all yearly messages, card identifiers, claim codes, and the list of gifts.
- **`parser.ts`**: Interprets the configuration.
- **`config.ts`**: Aggregates properties and exposes helper methods (like calculating current age or checking birth dates).
