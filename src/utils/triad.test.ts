import { describe, it, expect } from "vitest";
import { findTriad } from "./triad";
import { hexToOklab, luminance } from "./colors";
import { ALL_PAINTS, paintId } from "../data/paints";

const byName = (name: string) => {
  const p = ALL_PAINTS.find(x => x.name === name);
  if (!p) throw new Error(`fixture paint "${name}" is missing from the catalog`);
  return p;
};

describe("findTriad", () => {
  it("returns shades darker and highlights lighter than the base, always", () => {
    for (const base of ALL_PAINTS) {
      const { shade, highlight } = findTriad(base, ALL_PAINTS);
      const v = luminance(base.hex);
      for (const s of shade) expect(luminance(s.hex), `${s.name} is not darker than ${base.name}`).toBeLessThan(v);
      for (const h of highlight) expect(luminance(h.hex), `${h.name} is not lighter than ${base.name}`).toBeGreaterThan(v);
    }
  });

  it("never suggests the base paint as its own shade or highlight", () => {
    for (const base of ALL_PAINTS) {
      const { shade, highlight } = findTriad(base, ALL_PAINTS);
      for (const p of [...shade, ...highlight]) expect(paintId(p)).not.toBe(paintId(base));
    }
  });

  it("keeps suggestions within the hue/chroma drift limit", () => {
    for (const base of ALL_PAINTS) {
      const b = hexToOklab(base.hex);
      const { shade, highlight } = findTriad(base, ALL_PAINTS);
      for (const p of [...shade, ...highlight]) {
        const o = hexToOklab(p.hex);
        expect(Math.hypot(o.a - b.a, o.b - b.b), `${p.name} drifts too far from ${base.name}`)
          .toBeLessThanOrEqual(0.0751);
      }
    }
  });

  it("keeps every suggestion a visible step in value", () => {
    // Regression guard. Oklab's cube root stretches the dark end, so by
    // lightness alone #0a0a0a looks like a 15% step up from #000000 while
    // being the same colour as pigment. Asking for a highlight for Abaddon
    // Black used to return another black.
    for (const base of ALL_PAINTS) {
      const { shade, highlight } = findTriad(base, ALL_PAINTS);
      for (const p of [...shade, ...highlight]) {
        expect(Math.abs(luminance(p.hex) - luminance(base.hex)),
          `${p.name} is not a visible step from ${base.name}`).toBeGreaterThanOrEqual(0.06);
      }
    }
  });

  it("respects the requested count", () => {
    const base = byName("Mephiston Red");
    expect(findTriad(base, ALL_PAINTS, 1).shade.length).toBe(1);
    expect(findTriad(base, ALL_PAINTS, 3).shade.length).toBe(3);
  });

  it("offers no shade for pure black and no highlight for pure white", () => {
    expect(findTriad(byName("Abaddon Black"), ALL_PAINTS).shade).toEqual([]);
    expect(findTriad(byName("Corax White"), ALL_PAINTS).highlight).toEqual([]);
  });

  it("produces at least one usable role for every paint in the catalog", () => {
    for (const base of ALL_PAINTS) {
      const { shade, highlight } = findTriad(base, ALL_PAINTS);
      expect(shade.length + highlight.length, `no triad at all for ${base.name}`).toBeGreaterThan(0);
    }
  });

  it("finds the pairings Games Workshop publishes for its own paints", () => {
    // Independent check that the maths recovers real relationships rather than
    // merely self-consistent ones: these are GW's own recommended steps.
    const blue = findTriad(byName("Macragge Blue"), ALL_PAINTS, 3);
    expect(blue.shade.map(p => p.name)).toContain("Kantor Blue");

    const grey = findTriad(byName("Mechanicus Standard Grey"), ALL_PAINTS, 3);
    expect(grey.highlight.map(p => p.name)).toContain("Dawnstone");
  });

  it("honours a restricted pool", () => {
    const base = byName("Mephiston Red");
    const citadelOnly = ALL_PAINTS.filter(p => p.brand === "citadel");
    const { shade, highlight } = findTriad(base, citadelOnly);
    for (const p of [...shade, ...highlight]) expect(p.brand).toBe("citadel");
  });

  it("returns nothing when the pool holds only the base paint", () => {
    const base = byName("Mephiston Red");
    expect(findTriad(base, [base])).toEqual({ shade: [], highlight: [] });
  });
});
