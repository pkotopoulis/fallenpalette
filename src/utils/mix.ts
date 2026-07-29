import { Paint } from "../data/types";
import { paintId } from "../data/paints";
import { hexToOklab, oklabToHex, colorDistance, chromaOf, hueDistance } from "./colors";

/**
 * Two-paint mixes from a collection, for when no single paint you own is close.
 *
 * ─── What this can and cannot predict ───
 *
 * Interpolating in Oklab approximates optical blending, not pigment chemistry.
 * Real paint mixes subtractively and predicting it properly needs per-pigment
 * spectral data (Kubelka–Munk); a single sRGB triple per paint cannot support
 * that. Checked against mixes whose outcome is not in dispute:
 *
 *   red + magenta    34° apart   predicted within 1.0 of the real result
 *   red + yellow     66°                              1.7
 *   green + blue    121°                              3.3
 *   red + blue      122°                              8.1
 *   yellow + blue   172°                             17.2   <-- useless
 *   anything + white/black                       1.6 - 8.0
 *
 * Yellow and blue make green in every paint set ever sold, and interpolation
 * says grey-blue. The error is not a rounding problem, it is the wrong colour.
 * So near-complementary pairs are refused outright rather than answered badly.
 *
 * Tints and shades — mixing with a white, black or grey — predict well, because
 * lightening and darkening is roughly what interpolation does.
 *
 * The gate is calibrated on a handful of uncontroversial cases rather than
 * measured spectra, so it is set conservatively. Every result still wants a
 * swatch test before it goes near a model.
 */

/** Above this hue separation, interpolation stops describing paint. */
const MAX_HUE_SPREAD = 140;

/** Below this chroma a paint is effectively neutral, and hue does not apply. */
const NEUTRAL_CHROMA = 0.02;

/**
 * Ratios a painter can actually measure by eye, as the proportion of the second
 * paint. Finer steps would imply a precision that neither the prediction nor a
 * wet palette supports.
 */
const RATIOS = [0.25, 1 / 3, 0.5, 2 / 3, 0.75];

/** How close a mix must land to be worth suggesting at all. */
const MAX_MIX_DISTANCE = 6;

export interface MixSuggestion {
  a: Paint;
  b: Paint;
  /** Proportion of b in the mix. */
  ratio: number;
  /** Human-readable parts, e.g. "2 : 1". */
  parts: string;
  /** Predicted colour of the mix. */
  hex: string;
  /** Predicted distance from the target. */
  distance: number;
}

/** True when interpolation is a defensible model for mixing these two. */
export function mixIsPredictable(x: Paint, y: Paint): boolean {
  const ox = hexToOklab(x.hex), oy = hexToOklab(y.hex);
  // A neutral partner is a tint or a shade, which behaves.
  if (chromaOf(ox) < NEUTRAL_CHROMA || chromaOf(oy) < NEUTRAL_CHROMA) return true;
  return hueDistance(ox, oy) <= MAX_HUE_SPREAD;
}

/** Predicted colour of mixing b into a at the given proportion of b. */
export function mixHex(a: Paint, b: Paint, ratio: number): string {
  const A = hexToOklab(a.hex), B = hexToOklab(b.hex);
  return oklabToHex({
    L: A.L + (B.L - A.L) * ratio,
    a: A.a + (B.a - A.a) * ratio,
    b: A.b + (B.b - A.b) * ratio,
  });
}

const asParts = (ratio: number): string => {
  const table: [number, string][] = [
    [0.25, "3 : 1"], [1 / 3, "2 : 1"], [0.5, "1 : 1"], [2 / 3, "1 : 2"], [0.75, "1 : 3"],
  ];
  return table.reduce((best, cur) =>
    Math.abs(cur[0] - ratio) < Math.abs(best[0] - ratio) ? cur : best)[1];
};

/**
 * Best mixes of two owned paints for a target.
 *
 * `bestSingle` is the distance of the closest single owned paint. A mix has to
 * beat it, or the honest answer is "just use that one" — suggesting a two-paint
 * mix that is no better than a paint already on the shelf wastes the painter's
 * time and misrepresents the tool's confidence.
 */
export function findMixes(
  target: Paint,
  owned: Paint[],
  bestSingle: number,
  limit = 2,
): MixSuggestion[] {
  const targetId = paintId(target);
  const pool = owned.filter(p => paintId(p) !== targetId);
  const out: MixSuggestion[] = [];

  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const a = pool[i], b = pool[j];
      if (!mixIsPredictable(a, b)) continue;

      for (const ratio of RATIOS) {
        const hex = mixHex(a, b, ratio);
        const distance = colorDistance(target.hex, hex);
        if (distance > MAX_MIX_DISTANCE || distance >= bestSingle) continue;
        out.push({ a, b, ratio, parts: asParts(ratio), hex, distance });
      }
    }
  }

  // Keep only the best ratio per pair, so one pairing does not fill the list.
  const bestPerPair = new Map<string, MixSuggestion>();
  for (const m of out) {
    const key = [paintId(m.a), paintId(m.b)].sort().join("|");
    const seen = bestPerPair.get(key);
    if (!seen || m.distance < seen.distance) bestPerPair.set(key, m);
  }

  return [...bestPerPair.values()].sort((x, y) => x.distance - y.distance).slice(0, limit);
}
