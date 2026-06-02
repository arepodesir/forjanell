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

## 🖼️ AI Portrait Prompt Used
For generating the flattering recipient portrait, the following prompt was executed:
```text
A highly flattering portrait of a beautiful smiling young woman with warm eyes, glowing skin, and lovely hair, set against a soft-focus vibrant green nature background, sunny lighting, perfect for a high-quality birthday card profile photo.
```
This image was saved as `/web/public/resources/img/janell.png`.

---

## 🎧 Audio Assets Triggering
- **Switch SFX:** Triggers when turning lights on in Scene 1.
- **Door Creak SFX:** Triggers when going outside in Scene 2 and transitioning inside in Scene 3.
- **Mystic Haunted SFX:** Loops inside the dark hallway in Scene 3.
- **Blast SFX:** Triggers when opening the gift in Scene 4 and popping floating bubbles on `/wishes`.
- **HBD BGM:** Loops on the final card reveal in `/gifts`.
