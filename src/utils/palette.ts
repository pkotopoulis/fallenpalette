import { hexToOklab, oklabToHex, Oklab } from "./colors";

/**
 * Pulls the dominant colours out of an image's pixels.
 *
 * k-means, clustered in Oklab rather than RGB: the point of the space is that
 * equal distances look equally different, which is exactly the property a
 * clustering algorithm needs if the groups are to match what a person sees.
 * Clustering in RGB tends to split bright greens hard while lumping several
 * distinguishable dark tones together.
 *
 * Deterministic by construction — centroids are seeded from evenly spaced
 * lightness quantiles rather than at random, so the same image always yields the
 * same palette. A palette that shifted between runs would be untestable and
 * would look broken to anyone who re-dropped the same photo.
 *
 * Takes raw RGBA, not an image or a canvas, so the algorithm is testable without
 * a DOM and the caller decides how to downscale.
 */

export interface PaletteEntry {
  hex: string;
  /** Fraction of counted pixels in this cluster, 0..1. */
  share: number;
}

/** Alpha below this is treated as absent rather than as a dark colour. */
const MIN_ALPHA = 128;

export function extractPalette(rgba: Uint8ClampedArray, k = 6, iterations = 12): PaletteEntry[] {
  const points: Oklab[] = [];
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i + 3] < MIN_ALPHA) continue;
    const hex = "#" +
      rgba[i].toString(16).padStart(2, "0") +
      rgba[i + 1].toString(16).padStart(2, "0") +
      rgba[i + 2].toString(16).padStart(2, "0");
    points.push(hexToOklab(hex));
  }
  if (points.length === 0) return [];

  const clusters = Math.max(1, Math.min(k, points.length));

  // Seed on lightness quantiles: spread across the image's actual tonal range,
  // and identical for identical input.
  const byLightness = [...points].sort((a, b) => a.L - b.L);
  let centroids: Oklab[] = Array.from({ length: clusters }, (_, i) => {
    const idx = Math.floor(((i + 0.5) / clusters) * byLightness.length);
    return { ...byLightness[Math.min(idx, byLightness.length - 1)] };
  });

  let assignment = new Array<number>(points.length).fill(0);

  for (let pass = 0; pass < iterations; pass++) {
    let moved = false;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < centroids.length; c++) {
        const q = centroids[c];
        const d = (p.L - q.L) ** 2 + (p.a - q.a) ** 2 + (p.b - q.b) ** 2;
        if (d < bestD) { bestD = d; best = c; }
      }
      if (assignment[i] !== best) { assignment[i] = best; moved = true; }
    }

    const sums = centroids.map(() => ({ L: 0, a: 0, b: 0, n: 0 }));
    for (let i = 0; i < points.length; i++) {
      const s = sums[assignment[i]];
      s.L += points[i].L; s.a += points[i].a; s.b += points[i].b; s.n++;
    }
    // An empty cluster keeps its previous position rather than being reseeded,
    // which would reintroduce nondeterminism for no benefit.
    centroids = centroids.map((c, i) =>
      sums[i].n === 0 ? c : { L: sums[i].L / sums[i].n, a: sums[i].a / sums[i].n, b: sums[i].b / sums[i].n });

    if (!moved) break;
  }

  const counts = centroids.map(() => 0);
  for (const a of assignment) counts[a]++;

  return centroids
    .map((c, i) => ({ hex: oklabToHex(c), share: counts[i] / points.length }))
    .filter(e => e.share > 0)
    .sort((x, y) => y.share - x.share);
}

/**
 * Longest edge to downscale an image to before extracting.
 *
 * Clustering every pixel of a phone photo is millions of points for a result
 * that six swatches cannot express; a small sample gives the same palette in a
 * fraction of the time.
 */
export const SAMPLE_EDGE = 160;

/** Dimensions that fit the longest edge into SAMPLE_EDGE, preserving aspect. */
export function sampleSize(width: number, height: number): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= SAMPLE_EDGE) return { width: Math.max(1, width), height: Math.max(1, height) };
  const scale = SAMPLE_EDGE / longest;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}
