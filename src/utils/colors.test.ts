import { describe, it, expect } from "vitest";
import {
  hexToRgb, hexToOklab, colorDistance, luminance,
  matchTier, matchLabel, matchBg, matchFg, MATCH_EXACT, MATCH_CLOSE,
} from "./colors";
import { PAINT_GROUPS, ALL_PAINTS, paintId } from "../data/paints";

describe("hexToRgb", () => {
  it("parses channels", () => {
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#d1da38")).toEqual({ r: 209, g: 218, b: 56 });
  });
});

describe("hexToOklab", () => {
  it("puts black at L=0 and white at L=1 on the neutral axis", () => {
    const black = hexToOklab("#000000");
    expect(black.L).toBeCloseTo(0, 5);
    expect(black.a).toBeCloseTo(0, 5);
    expect(black.b).toBeCloseTo(0, 5);

    const white = hexToOklab("#ffffff");
    expect(white.L).toBeCloseTo(1, 3);
    expect(white.a).toBeCloseTo(0, 3);
    expect(white.b).toBeCloseTo(0, 3);
  });

  it("keeps greys achromatic", () => {
    for (const hex of ["#333333", "#808080", "#cccccc"]) {
      const { a, b } = hexToOklab(hex);
      expect(Math.hypot(a, b)).toBeLessThan(0.001);
    }
  });

  it("orders lightness monotonically for a grey ramp", () => {
    const ramp = ["#000000", "#333333", "#808080", "#cccccc", "#ffffff"].map(h => hexToOklab(h).L);
    for (let i = 1; i < ramp.length; i++) expect(ramp[i]).toBeGreaterThan(ramp[i - 1]);
  });

  it("gives the documented reference values (Ottosson coefficients)", () => {
    // Guards against a transcription slip in the LMS matrices.
    const red = hexToOklab("#ff0000");
    expect(red.L).toBeCloseTo(0.6279, 3);
    expect(red.a).toBeCloseTo(0.2249, 3);
    expect(red.b).toBeCloseTo(0.1258, 3);
  });

  it("returns stable results when memoised", () => {
    const a = hexToOklab("#9a1115");
    const b = hexToOklab("#9a1115");
    expect(a).toEqual(b);
  });
});

describe("colorDistance", () => {
  it("is zero for identical colours", () => {
    expect(colorDistance("#123456", "#123456")).toBe(0);
  });

  it("is symmetric", () => {
    expect(colorDistance("#ff0000", "#00ff00")).toBeCloseTo(colorDistance("#00ff00", "#ff0000"), 10);
  });

  it("scales black-to-white by the lightness weight", () => {
    // ΔL = 1, chroma unchanged, so the result is 100 x LIGHTNESS_WEIGHT.
    expect(colorDistance("#000000", "#ffffff")).toBeCloseTo(80, 1);
  });

  it("ranks a near-identical colour below an unrelated one", () => {
    const near = colorDistance("#9a1115", "#9c1418");
    const far = colorDistance("#9a1115", "#1a6ab4");
    expect(near).toBeLessThan(far);
    expect(near).toBeLessThan(MATCH_EXACT);
  });
});

describe("lightness weighting", () => {
  // The weight is a deliberate 0.8, not 1.0 and not lower. Both directions are
  // pinned: too high loses the domain fit, too low starts calling visibly
  // different neutrals equivalent, because for a grey lightness is the only
  // signal available. See the rationale in colors.ts.
  it("keeps two clearly different greys out of the Exact tier", () => {
    expect(matchTier(colorDistance("#808080", "#999999"))).toBe("close");
  });

  it("keeps a wider grey gap out of the Close tier", () => {
    expect(matchTier(colorDistance("#666666", "#999999"))).toBe("approx");
  });

  it("discounts lightness relative to chroma by the documented ratio", () => {
    // Equal raw Oklab displacement, one along L and one across chroma.
    const L = hexToOklab("#808080").L;
    const lightnessOnly = colorDistance("#808080", "#999999");
    const dL = Math.abs(hexToOklab("#999999").L - L);
    expect(lightnessOnly).toBeCloseTo(dL * 0.8 * 100, 6);
  });
});

describe("match tiers", () => {
  it("uses the documented cutoffs", () => {
    expect(MATCH_EXACT).toBe(4.0);
    expect(MATCH_CLOSE).toBe(9.5);
  });

  it("classifies at the boundaries", () => {
    expect(matchTier(0)).toBe("exact");
    expect(matchTier(MATCH_EXACT - 0.01)).toBe("exact");
    expect(matchTier(MATCH_EXACT)).toBe("close");
    expect(matchTier(MATCH_CLOSE - 0.01)).toBe("close");
    expect(matchTier(MATCH_CLOSE)).toBe("approx");
    expect(matchTier(999)).toBe("approx");
  });

  it("keeps label and colours in step with the tier", () => {
    // These used to be able to disagree: App.tsx carried its own inline
    // 15/35 ternary alongside matchLabel(). Everything derives from
    // matchTier() now, and this asserts they cannot drift apart again.
    for (const d of [0, 1, 3.9, 4, 6, 9.4, 9.5, 20, 90]) {
      const tier = matchTier(d);
      expect(matchLabel(d).toLowerCase()).toBe(tier);
      const bg = { exact: "#22C55E20", close: "#F4A02420", approx: "#EF444420" }[tier];
      const fg = { exact: "#4ADE80", close: "#FBB040", approx: "#F87171" }[tier];
      expect(matchBg(d)).toBe(bg);
      expect(matchFg(d)).toBe(fg);
    }
  });
});

describe("luminance", () => {
  it("spans 0..1 and is ordered", () => {
    expect(luminance("#000000")).toBeCloseTo(0, 5);
    expect(luminance("#ffffff")).toBeCloseTo(1, 5);
    expect(luminance("#ffffff")).toBeGreaterThan(luminance("#808080"));
  });

  it("still trips the near-white swatch border threshold", () => {
    // The swatch border uses > 0.85; keep that reachable for pale paints.
    expect(luminance("#ffffff")).toBeGreaterThan(0.85);
    expect(luminance("#161920")).toBeLessThan(0.85);
  });
});

describe("calibration against the curated equivalence groups", () => {
  // The groups are hand-authored ground truth: paints placed together are
  // ones a painter considers interchangeable. These bounds are what justify
  // the thresholds, so a data edit that quietly wrecks them should fail here
  // rather than ship.
  const positives: number[] = [];
  for (const g of PAINT_GROUPS) {
    for (let i = 0; i < g.paints.length; i++) {
      for (let j = i + 1; j < g.paints.length; j++) {
        if (g.paints[i].brand === g.paints[j].brand) continue;
        positives.push(colorDistance(g.paints[i].hex, g.paints[j].hex));
      }
    }
  }

  it("has a meaningful sample to calibrate on", () => {
    expect(positives.length).toBeGreaterThan(1000);
  });

  it("puts at least 90% of curated equivalents within Close", () => {
    const within = positives.filter(d => d < MATCH_CLOSE).length / positives.length;
    expect(within).toBeGreaterThan(0.9);
  });

  it("puts a majority of curated equivalents in Exact", () => {
    const exact = positives.filter(d => d < MATCH_EXACT).length / positives.length;
    expect(exact).toBeGreaterThan(0.55);
  });

  it("keeps unrelated paints outside Close", () => {
    // Deterministic sampling: fixed-stride pairs rather than a RNG.
    const groupOf = new Map<string, number>();
    PAINT_GROUPS.forEach((g, gi) => g.paints.forEach(p => {
      if (!groupOf.has(paintId(p))) groupOf.set(paintId(p), gi);
    }));
    const negatives: number[] = [];
    for (let i = 0; i < ALL_PAINTS.length; i++) {
      for (let step = 7; step < 60; step += 13) {
        const j = (i + step) % ALL_PAINTS.length;
        const a = ALL_PAINTS[i], b = ALL_PAINTS[j];
        if (groupOf.get(paintId(a)) === groupOf.get(paintId(b))) continue;
        negatives.push(colorDistance(a.hex, b.hex));
      }
    }
    expect(negatives.length).toBeGreaterThan(1000);
    const falsePositive = negatives.filter(d => d < MATCH_CLOSE).length / negatives.length;
    expect(falsePositive).toBeLessThan(0.15);
  });
});
