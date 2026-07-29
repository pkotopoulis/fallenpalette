export function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export interface Oklab { L: number; a: number; b: number }

/** sRGB channel (0..1) to linear light. Exported for the CVD simulation, which
 *  must operate on linear values to be physically meaningful. */
export const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

// Converting costs three pow() and three cbrt(). The catalog is ~650 paints and
// every keystroke re-ranks all of them, so results are memoised by hex.
const oklabCache = new Map<string, Oklab>();

/** sRGB hex -> Oklab (Björn Ottosson's perceptual colour space). */
export function hexToOklab(hex: string): Oklab {
  const hit = oklabCache.get(hex);
  if (hit) return hit;

  const { r, g, b } = hexToRgb(hex);
  const R = srgbToLinear(r / 255), G = srgbToLinear(g / 255), B = srgbToLinear(b / 255);

  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);

  const out: Oklab = {
    L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  };
  oklabCache.set(hex, out);
  return out;
}

/** Linear light back to an sRGB channel (0..1). */
export const linearToSrgb = (c: number) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const channel = (v: number) => {
  const n = Math.round(Math.max(0, Math.min(1, linearToSrgb(v))) * 255);
  return n.toString(16).padStart(2, "0");
};

/** Oklab back to an sRGB hex string, clamped into gamut. */
export function oklabToHex({ L, a, b }: Oklab): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;

  return "#" +
    channel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) +
    channel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) +
    channel(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}

/** Distance from the neutral axis: 0 for white, black and any grey. */
export const chromaOf = ({ a, b }: Oklab) => Math.hypot(a, b);

/** Hue angle in degrees, meaningless for anything near the neutral axis. */
export const hueOf = ({ a, b }: Oklab) => (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;

/** Shortest angle between two hues, 0..180. */
export function hueDistance(x: Oklab, y: Oklab): number {
  const d = Math.abs(hueOf(x) - hueOf(y)) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * Lightness carries slightly less weight than hue/chroma.
 *
 * Measured against the curated equivalence groups: paints a painter considers
 * interchangeable differ about twice as much in lightness as in chroma
 * (|ΔL| p75 = 5.2 vs Δchroma p75 = 2.7). A lightness gap is also the more
 * recoverable of the two at the desk — you can thin a paint or highlight over
 * it, but you cannot shift its hue.
 *
 * Held here rather than pushed lower: weights below ~0.7 start calling
 * visibly different neutrals equivalent, since for a grey (a,b ~ 0) lightness
 * is the *only* signal. At 0.8 no same-hue/different-value pair from a
 * different group is mislabelled, and #808080 vs #999999 still reads as a
 * merely "Close" 6.6 rather than an "Exact" 4.2.
 */
const LIGHTNESS_WEIGHT = 0.8;

/**
 * Perceptual distance between two hex colours, scaled ×100 so that typical
 * values land in a readable 0–100 range rather than 0–1.
 *
 * Replaces plain RGB Euclidean distance, which is not perceptually uniform —
 * it over-weights green and ignores how the eye actually reads lightness. On
 * the curated groups it mislabelled a quarter of intended equivalents as poor
 * matches, because their p75 landed exactly on the old "Approx" cutoff.
 */
export function colorDistance(a: string, b: string): number {
  const A = hexToOklab(a), B = hexToOklab(b);
  return Math.hypot((A.L - B.L) * LIGHTNESS_WEIGHT, A.a - B.a, A.b - B.b) * 100;
}

/**
 * Relative brightness, used only to decide whether a near-white swatch needs a
 * visible border. Deliberately left as the cheap sRGB approximation — it is not
 * part of colour matching and its 0.85 cutoff is tuned to this formula.
 */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export type MatchTier = "exact" | "close" | "approx";

/**
 * Tier cutoffs, calibrated against the 142 hand-curated equivalence groups
 * (1,185 cross-brand pairs a painter has already declared equivalent):
 *
 *   < 4.0  "Exact"   — 62% of curated equivalents
 *   < 9.5  "Close"   — 30% more, so 92% fall within this
 *   else   "Approx"  — 8%, down from 26% under the old RGB thresholds
 *
 * Unrelated paints sit far outside: random cross-group pairs average a
 * distance of 23.8, and only 8.0% land inside the Close cutoff.
 *
 * These are the single source of truth for the tiers. Do not re-inline them —
 * the previous 15/35 pair was duplicated in App.tsx and silently disagreed
 * with matchLabel() whenever either changed.
 */
export const MATCH_EXACT = 4.0;
export const MATCH_CLOSE = 9.5;

export function matchTier(d: number): MatchTier {
  return d < MATCH_EXACT ? "exact" : d < MATCH_CLOSE ? "close" : "approx";
}

export function matchLabel(d: number) {
  const tier = matchTier(d);
  return tier === "exact" ? "Exact" : tier === "close" ? "Close" : "Approx";
}

export function matchBg(d: number) {
  const tier = matchTier(d);
  return tier === "exact" ? "#22C55E20" : tier === "close" ? "#F4A02420" : "#EF444420";
}

export function matchFg(d: number) {
  const tier = matchTier(d);
  return tier === "exact" ? "#4ADE80" : tier === "close" ? "#FBB040" : "#F87171";
}
