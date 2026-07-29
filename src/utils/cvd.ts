import { hexToRgb, srgbToLinear, linearToSrgb, colorDistance } from "./colors";

/**
 * Colour-vision-deficiency simulation, and the more useful question behind it:
 * which paints a given viewer cannot tell apart.
 *
 * Worth being clear who each half is for. Someone with a deficiency already sees
 * the world this way, so showing them a simulation tells them nothing — what helps
 * is being warned that two paints they are about to buy, or two pots on the shelf,
 * are indistinguishable to them. The simulation is what makes that computable, and
 * separately lets a normal-sighted person understand what is being lost.
 *
 * Roughly 8% of men have some red-green deficiency, and this entire app
 * communicates through colour.
 */

export type CvdType = "none" | "protanopia" | "deuteranopia" | "tritanopia";

export const CVD_TYPES: CvdType[] = ["none", "protanopia", "deuteranopia", "tritanopia"];

/**
 * Machado, Oliveira & Fernandes (2009) severity-1.0 matrices, applied in linear
 * RGB. Chosen over a naive channel swap because they model the actual shift in
 * cone response rather than deleting a channel, which would also destroy
 * lightness.
 *
 * The coefficients are validated behaviourally in the tests rather than taken on
 * trust: greys must stay grey, protan and deutan must collapse red against green
 * while leaving blue against yellow largely intact, and tritan the reverse. A
 * transcription slip in any row breaks at least one of those.
 */
const MATRICES: Record<Exclude<CvdType, "none">, number[][]> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.011820, 0.042940, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.303900],
  ],
};

const channel = (v: number) =>
  Math.round(Math.max(0, Math.min(1, linearToSrgb(v))) * 255)
    .toString(16).padStart(2, "0");

/** How a colour appears to a viewer with the given deficiency. */
export function simulateCvd(hex: string, type: CvdType): string {
  if (type === "none") return hex.toLowerCase();
  const m = MATRICES[type];
  const { r, g, b } = hexToRgb(hex);
  const lr = srgbToLinear(r / 255), lg = srgbToLinear(g / 255), lb = srgbToLinear(b / 255);
  return "#" +
    channel(m[0][0] * lr + m[0][1] * lg + m[0][2] * lb) +
    channel(m[1][0] * lr + m[1][1] * lg + m[1][2] * lb) +
    channel(m[2][0] * lr + m[2][1] * lg + m[2][2] * lb);
}

/**
 * Perceptual distance as the given viewer would experience it.
 *
 * Simulating both colours and then measuring in Oklab is the point: two paints
 * 30 units apart normally can be under 2 apart to a deuteranope, and that is
 * exactly the pair worth warning about.
 */
export function cvdDistance(a: string, b: string, type: CvdType): number {
  return colorDistance(simulateCvd(a, type), simulateCvd(b, type));
}

/** Below this, two simulated colours are treated as the same colour. */
export const CONFUSABLE = 3;

/** Above this normally, a pair is one a normal-sighted person tells apart easily. */
export const DISTINCT_NORMALLY = 8;

/**
 * True when a pair is clearly different to most people but not to this viewer.
 *
 * Both halves matter. Without the normal-vision check, near-identical paints
 * would be reported as a confusion caused by the deficiency, when in fact nobody
 * can tell them apart and the warning would be noise.
 */
export function isConfusable(a: string, b: string, type: CvdType): boolean {
  if (type === "none") return false;
  return colorDistance(a, b) >= DISTINCT_NORMALLY && cvdDistance(a, b, type) < CONFUSABLE;
}

export interface ConfusablePair<T> {
  a: T;
  b: T;
  /** Oklab distance to a normal-sighted viewer. */
  normal: number;
  /** Oklab distance as this viewer sees it. */
  seen: number;
}

/**
 * Every pair in a set that this viewer cannot tell apart — the shelf question.
 *
 * Quadratic, so the simulation is hoisted out of the inner loop: a collection of
 * 300 paints is 45,000 pairs but only 300 simulations. Doing it per-pair would
 * repeat each one 300 times and allocate a hex string for every repeat.
 *
 * Ordered by how different the pair looks to everyone else, because that is the
 * ranking of surprise: two paints a shop displays as obviously distinct are the
 * ones most likely to be picked up by mistake.
 */
export function confusablePairs<T extends { hex: string }>(
  items: T[],
  type: CvdType,
  limit = 24,
): ConfusablePair<T>[] {
  if (type === "none" || items.length < 2) return [];

  const sim = items.map(i => simulateCvd(i.hex, type));
  const out: ConfusablePair<T>[] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      // Cheap test first: most pairs fail the "distinct normally" gate, and
      // skipping them avoids the second distance computation entirely.
      const normal = colorDistance(items[i].hex, items[j].hex);
      if (normal < DISTINCT_NORMALLY) continue;
      const seen = colorDistance(sim[i], sim[j]);
      if (seen < CONFUSABLE) out.push({ a: items[i], b: items[j], normal, seen });
    }
  }

  return out.sort((x, y) => y.normal - x.normal).slice(0, limit);
}
