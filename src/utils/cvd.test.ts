import { describe, it, expect } from "vitest";
import {
  simulateCvd, cvdDistance, isConfusable, confusablePairs,
  CVD_TYPES, CONFUSABLE, DISTINCT_NORMALLY, type CvdType,
} from "./cvd";
import { colorDistance, hexToRgb, hexToOklab } from "./colors";
import { ALL_PAINTS } from "../data/paints";

const DEFICIENCIES = CVD_TYPES.filter(t => t !== "none") as Exclude<CvdType, "none">[];

/**
 * Distance in the a/b (hue and chroma) plane only, ignoring lightness.
 *
 * Needed because a red-green deficiency is a loss of *hue* discrimination, and
 * for saturated primaries protanopia simultaneously *widens* the lightness gap:
 * red loses most of its luminance, so #ff0000 darkens while #00ff00 brightens.
 * Total distance therefore stays large even though the two hues have merged,
 * and only the chromatic plane shows the collapse.
 */
const chromaGap = (a: string, b: string) => {
  const A = hexToOklab(a), B = hexToOklab(b);
  return Math.hypot(A.a - B.a, A.b - B.b) * 100;
};

// The matrices were written from memory, so they are checked by what they DO,
// not by reading the numbers back. Each property below fails on a transcription
// slip in a different row.
describe("simulateCvd matrices", () => {
  it("leaves greys grey, for every deficiency", () => {
    // Each row must sum to ~1. If it does not, neutrals gain a colour cast —
    // the single most visible symptom of a mistyped coefficient.
    for (const type of DEFICIENCIES) {
      for (const grey of ["#000000", "#404040", "#808080", "#c0c0c0", "#ffffff"]) {
        const out = simulateCvd(grey, type);
        const { r, g, b } = hexToRgb(out);
        const spread = Math.max(r, g, b) - Math.min(r, g, b);
        expect(spread, `${type} tints ${grey} -> ${out}`).toBeLessThanOrEqual(3);
      }
    }
  });

  it("preserves black and white exactly", () => {
    for (const type of DEFICIENCIES) {
      expect(simulateCvd("#000000", type)).toBe("#000000");
      expect(simulateCvd("#ffffff", type)).toBe("#ffffff");
    }
  });

  it("roughly preserves lightness", () => {
    // A deficiency loses hue discrimination, not brightness. If a row's
    // coefficients are wrong the result usually goes conspicuously dark.
    for (const type of DEFICIENCIES) {
      for (const hex of ["#ff0000", "#00ff00", "#0000ff", "#ff8800", "#8844cc"]) {
        const before = hexToRgb(hex), after = hexToRgb(simulateCvd(hex, type));
        const lum = (c: { r: number; g: number; b: number }) => 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
        expect(Math.abs(lum(after) - lum(before)), `${type} on ${hex}`).toBeLessThan(90);
      }
    }
  });

  it("merges the hue of red into green under protanopia and deuteranopia", () => {
    // The defining symptom, measured where it actually shows: pure red and pure
    // green sit 46 apart in the chromatic plane and must end up sharing a hue.
    const normal = chromaGap("#ff0000", "#00ff00");
    expect(normal).toBeGreaterThan(40);
    for (const type of ["protanopia", "deuteranopia"] as const) {
      const after = chromaGap(simulateCvd("#ff0000", type), simulateCvd("#00ff00", type));
      expect(after, `${type} left a ${after.toFixed(1)} hue gap`).toBeLessThan(normal / 4);
    }
  });

  it("collapses lightness-matched reds against greens outright", () => {
    // The case the feature exists for: paints of similar value but opposing hue,
    // where no lightness cue survives to rescue the difference. Unlike the
    // saturated primaries above, total distance really does collapse here.
    for (const [a, b] of [["#c04a3a", "#6a7a35"], ["#8a3324", "#4f6228"], ["#b02020", "#2f7a2f"]]) {
      const normal = colorDistance(a, b);
      expect(normal, `${a}/${b} should start far apart`).toBeGreaterThan(10);
      // Deuteranopia merges them to within the "same colour" threshold.
      expect(cvdDistance(a, b, "deuteranopia"), `${a}/${b} deutan`).toBeLessThan(CONFUSABLE);
      // Protanopia retains a partial lightness cue, so it only roughly halves
      // them. Asserting the same bound for both would overstate protanopia.
      expect(cvdDistance(a, b, "protanopia"), `${a}/${b} protan`).toBeLessThan(normal * 0.6);
    }
  });

  it("keeps blue distinguishable from yellow under red-green deficiencies", () => {
    // The blue-yellow axis is served by a different cone and survives. If it
    // collapsed too, the matrix would be desaturating rather than simulating.
    for (const type of ["protanopia", "deuteranopia"] as const) {
      expect(cvdDistance("#0000ff", "#ffff00", type), type).toBeGreaterThan(50);
    }
  });

  it("collapses blue against green under tritanopia, and spares red against green", () => {
    // Tritanopia is the mirror case, so it also proves the three matrices are
    // not copies of one another. Blue against teal rather than against a mint
    // green: mint keeps enough lightness contrast to survive the collapse, which
    // would test the wrong thing.
    expect(cvdDistance("#0000ff", "#008888", "tritanopia")).toBeLessThan(
      colorDistance("#0000ff", "#008888") / 2);
    expect(cvdDistance("#ff0000", "#00ff00", "tritanopia")).toBeGreaterThan(40);
  });

  it("gives each deficiency a distinct result", () => {
    const seen = DEFICIENCIES.map(t => simulateCvd("#c04030", t));
    expect(new Set(seen).size).toBe(DEFICIENCIES.length);
  });

  it("is idempotent: simulating twice changes little more than once", () => {
    // A dichromat's response is already collapsed onto one axis, so projecting
    // again should be near a no-op. A matrix that is not a projection drifts.
    for (const type of DEFICIENCIES) {
      const once = simulateCvd("#b03a2e", type);
      expect(colorDistance(simulateCvd(once, type), once), type).toBeLessThan(6);
    }
  });
});

describe("simulateCvd output", () => {
  it("returns an in-gamut lowercase hex for every paint and deficiency", () => {
    for (const p of ALL_PAINTS) {
      for (const type of CVD_TYPES) {
        const out = simulateCvd(p.hex, type);
        expect(out, `${p.name} / ${type}`).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("passes colours through unchanged when type is none", () => {
    for (const p of ALL_PAINTS.slice(0, 50)) {
      expect(simulateCvd(p.hex, "none")).toBe(p.hex.toLowerCase());
    }
  });

  it("normalises case so results compare equal", () => {
    expect(simulateCvd("#AABBCC", "deuteranopia")).toBe(simulateCvd("#aabbcc", "deuteranopia"));
    expect(simulateCvd("#AABBCC", "none")).toBe("#aabbcc");
  });
});

describe("isConfusable", () => {
  it("is never true when no deficiency is selected", () => {
    expect(isConfusable("#ff0000", "#00ff00", "none")).toBe(false);
  });

  it("flags a red/green pair that a deuteranope cannot separate", () => {
    const pair = ["#8a3324", "#4f6228"];
    expect(colorDistance(pair[0], pair[1])).toBeGreaterThan(8);
    expect(isConfusable(pair[0], pair[1], "deuteranopia")).toBe(true);
  });

  it("does not flag a pair that nobody can tell apart", () => {
    // Two near-identical hexes are confusable for everyone. Reporting that as
    // caused by the deficiency would be noise, and would swamp the real hits.
    expect(colorDistance("#804030", "#814131")).toBeLessThan(8);
    expect(isConfusable("#804030", "#814131", "deuteranopia")).toBe(false);
  });

  it("does not flag a pair that survives the deficiency", () => {
    expect(isConfusable("#0000ff", "#ffff00", "deuteranopia")).toBe(false);
  });

  it("is symmetric", () => {
    for (const type of DEFICIENCIES) {
      for (const [a, b] of [["#8a3324", "#4f6228"], ["#0000ff", "#ffff00"], ["#123456", "#654321"]]) {
        expect(isConfusable(a, b, type)).toBe(isConfusable(b, a, type));
      }
    }
  });

  it("finds real confusable pairs in the catalog, but not most of it", () => {
    // The feature is only worth shipping if it says something. Equally, if a
    // large share of pairs were flagged the warning would be meaningless, which
    // is what a broken CONFUSABLE threshold would produce.
    const sample = ALL_PAINTS.slice(0, 220);
    let hits = 0, pairs = 0;
    for (let i = 0; i < sample.length; i++)
      for (let j = i + 1; j < sample.length; j++) {
        pairs++;
        if (isConfusable(sample[i].hex, sample[j].hex, "deuteranopia")) hits++;
      }
    expect(hits).toBeGreaterThan(0);
    expect(hits / pairs).toBeLessThan(0.05);
  });

  it("holds CONFUSABLE below the exact-match cutoff", () => {
    // If it were looser than "Exact", pairs the app already calls the same
    // colour would be reported as a deficiency-specific problem.
    expect(CONFUSABLE).toBeLessThan(4.0);
  });
});

describe("confusablePairs", () => {
  const SHELF = [
    { hex: "#8a3324", name: "brick" },
    { hex: "#4f6228", name: "olive" },
    { hex: "#0000ff", name: "blue" },
    { hex: "#ffffff", name: "white" },
  ];

  it("returns nothing when no deficiency is selected", () => {
    expect(confusablePairs(SHELF, "none")).toEqual([]);
  });

  it("returns nothing for a set too small to have a pair", () => {
    for (const type of DEFICIENCIES) {
      expect(confusablePairs([SHELF[0]], type)).toEqual([]);
      expect(confusablePairs([], type)).toEqual([]);
    }
  });

  it("finds the brick/olive pair for a deuteranope and nothing else", () => {
    const pairs = confusablePairs(SHELF, "deuteranopia");
    expect(pairs).toHaveLength(1);
    const names = [pairs[0].a.name, pairs[0].b.name].sort();
    expect(names).toEqual(["brick", "olive"]);
  });

  it("reports both distances, and they bracket the thresholds", () => {
    // The two numbers are what justify showing the warning at all, so a caller
    // rendering them must be able to trust the pairing.
    for (const p of confusablePairs(ALL_PAINTS.slice(0, 300), "deuteranopia")) {
      expect(p.normal).toBeGreaterThanOrEqual(DISTINCT_NORMALLY);
      expect(p.seen).toBeLessThan(CONFUSABLE);
      expect(p.normal).toBeCloseTo(colorDistance(p.a.hex, p.b.hex), 6);
      expect(p.seen).toBeCloseTo(cvdDistance(p.a.hex, p.b.hex, "deuteranopia"), 6);
    }
  });

  it("agrees with isConfusable on every pair it returns", () => {
    // The list and the single-pair predicate must not drift apart — they are two
    // entry points to the same rule.
    for (const type of DEFICIENCIES) {
      for (const p of confusablePairs(ALL_PAINTS.slice(0, 200), type)) {
        expect(isConfusable(p.a.hex, p.b.hex, type), `${p.a.hex}/${p.b.hex} ${type}`).toBe(true);
      }
    }
  });

  it("finds every confusable pair a brute-force scan finds", () => {
    // Guards the hoisted simulation and the early-continue: an off-by-one in the
    // inner loop, or reusing the wrong simulated hex, would silently drop pairs.
    const sample = ALL_PAINTS.slice(0, 160);
    const expected: string[] = [];
    for (let i = 0; i < sample.length; i++)
      for (let j = i + 1; j < sample.length; j++)
        if (isConfusable(sample[i].hex, sample[j].hex, "protanopia")) expected.push(`${i}-${j}`);

    const got = confusablePairs(sample, "protanopia", Infinity)
      .map(p => `${sample.indexOf(p.a)}-${sample.indexOf(p.b)}`);
    expect(got.sort()).toEqual(expected.sort());
  });

  it("orders the most normally-distinct pair first", () => {
    const pairs = confusablePairs(ALL_PAINTS.slice(0, 300), "deuteranopia");
    expect(pairs.length).toBeGreaterThan(1);
    for (let i = 1; i < pairs.length; i++) {
      expect(pairs[i - 1].normal).toBeGreaterThanOrEqual(pairs[i].normal);
    }
  });

  it("honours the limit", () => {
    const all = confusablePairs(ALL_PAINTS.slice(0, 300), "deuteranopia", Infinity);
    expect(all.length).toBeGreaterThan(3);
    const capped = confusablePairs(ALL_PAINTS.slice(0, 300), "deuteranopia", 3);
    expect(capped).toHaveLength(3);
    // Capping must keep the top of the ranking, not an arbitrary slice.
    expect(capped.map(p => p.normal)).toEqual(all.slice(0, 3).map(p => p.normal));
  });

  it("never pairs a paint with itself", () => {
    for (const type of DEFICIENCIES) {
      for (const p of confusablePairs(ALL_PAINTS.slice(0, 200), type)) {
        expect(p.a).not.toBe(p.b);
      }
    }
  });
});
