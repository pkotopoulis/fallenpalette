import { Paint } from "../data/types";
import { paintId } from "../data/paints";
import { hexToOklab, luminance } from "./colors";

/**
 * Suggests a shade and a highlight for a paint, drawn from the catalog.
 *
 * The idea a painter works from is a value ramp in one hue: the recess gets a
 * darker version of the same colour, the edge a lighter one. In Oklab that is
 * a straightforward search — hold a and b (hue and chroma), move along L.
 *
 * Chroma error is weighted well above lightness error. A highlight that is a
 * little lighter or darker than ideal is still usable; one that drifts to a
 * different hue is simply the wrong paint, and looks it on the model.
 */

/** Ideal Oklab lightness step to a shade or a highlight. */
const STEP = 0.15;

/** Any closer in lightness and it reads as the same paint, not a step. */
const MIN_GAP = 0.045;

/**
 * Minimum gap in plain sRGB value, on top of the Oklab lightness gap.
 *
 * Oklab's cube-root transfer stretches the dark end hard: #000000 sits at
 * L=0.000 and #0a0a0a at L=0.145, so by lightness alone one near-black looks
 * like a legitimate 15% step up from another. As pigment on a model they are
 * the same colour. Without this guard, asking for a highlight for Abaddon
 * Black returned a second black.
 */
const MIN_VALUE_GAP = 0.06;

/**
 * Hard limit on hue/chroma drift, in Oklab a/b units. Beyond this the
 * candidate is a different colour rather than a darker or lighter version of
 * this one, and no suggestion is better than a misleading one.
 */
const MAX_CHROMA_DRIFT = 0.075;

const CHROMA_WEIGHT = 2.5;

export interface Triad {
  shade: Paint[];
  highlight: Paint[];
}

export function findTriad(base: Paint, pool: Paint[], count = 2): Triad {
  const b = hexToOklab(base.hex);
  const baseValue = luminance(base.hex);
  const baseId = paintId(base);

  const pick = (direction: -1 | 1): Paint[] => {
    const targetL = Math.min(1, Math.max(0, b.L + direction * STEP));

    return pool
      .filter(p => paintId(p) !== baseId)
      .map(p => ({
        paint: p,
        o: hexToOklab(p.hex),
        value: luminance(p.hex),
        drift: Math.hypot(hexToOklab(p.hex).a - b.a, hexToOklab(p.hex).b - b.b),
      }))
      .filter(({ o, value, drift }) =>
        drift <= MAX_CHROMA_DRIFT &&
        Math.abs(value - baseValue) >= MIN_VALUE_GAP &&
        (direction < 0
          ? o.L <= b.L - MIN_GAP && value < baseValue
          : o.L >= b.L + MIN_GAP && value > baseValue))
      .map(c => ({ paint: c.paint, score: c.drift * CHROMA_WEIGHT + Math.abs(c.o.L - targetL) }))
      .sort((x, y) => x.score - y.score)
      .slice(0, count)
      .map(c => c.paint);
  };

  return { shade: pick(-1), highlight: pick(1) };
}
