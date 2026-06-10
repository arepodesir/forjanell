/**
 * Letter & text animation utilities.
 * Generalizable, pure, reusable across components (Hadacard letter cascades, future pretext/open effects, etc.).
 * IIPS: small, elegant, no side-effects, perfect for Solid For + inline style delays.
 */

/** Splits text into an array of {char, delay} for the letter-block animation. */
export function splitToLetterBlocks(text: string, baseDelay: number = 30) {
  const letters: { char: string; delay: number }[] = [];
  let idx = 0;
  for (const char of text) {
    letters.push({ char, delay: idx * baseDelay });
    idx++;
  }
  return letters;
}
