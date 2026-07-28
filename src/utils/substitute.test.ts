import { describe, it, expect } from "vitest";
import { findSubstitutes } from "./substitute";
import { ALL_PAINTS, paintId, equivalentsOf } from "../data/paints";
import { colorDistance } from "./colors";

const byName = (name: string) => {
  const p = ALL_PAINTS.find(x => x.name === name);
  if (!p) throw new Error(`fixture paint "${name}" is missing`);
  return p;
};

describe("findSubstitutes", () => {
  it("returns nothing when the paint is already owned", () => {
    // There is nothing to substitute for a paint on the shelf.
    const target = byName("Mephiston Red");
    expect(findSubstitutes(target, [target])).toEqual([]);
  });

  it("returns nothing when the collection is empty", () => {
    expect(findSubstitutes(byName("Mephiston Red"), [])).toEqual([]);
  });

  it("never suggests the target itself", () => {
    const target = byName("Mephiston Red");
    const owned = ALL_PAINTS.filter(p => p.brand === "vallejo_gc");
    for (const s of findSubstitutes(target, owned, 10)) {
      expect(paintId(s.paint)).not.toBe(paintId(target));
    }
  });

  it("puts a curated equivalent ahead of a marginally closer colour", () => {
    // The groups are hand-authored, so a painter has already said these two
    // interchange. That beats a measurement saying something else is 0.5 nearer.
    const target = byName("Mephiston Red");
    const curated = equivalentsOf(target).find(p => p.brand === "vallejo_gc")!;
    // Something almost exactly the target colour, but not in its group.
    const nearImpostor: typeof target = {
      brand: "proacryl", name: "Not A Real Paint", hex: target.hex, type: "Base Set",
    };
    const out = findSubstitutes(target, [nearImpostor, curated], 2);
    expect(out[0].curated).toBe(true);
    expect(paintId(out[0].paint)).toBe(paintId(curated));
    expect(out[1].distance).toBeLessThan(out[0].distance);
  });

  it("orders by distance within the same tier", () => {
    const target = byName("Mephiston Red");
    const owned = ALL_PAINTS.filter(p => p.brand !== "citadel");
    const out = findSubstitutes(target, owned, 8);
    for (let i = 1; i < out.length; i++) {
      if (out[i].curated === out[i - 1].curated) {
        expect(out[i].distance).toBeGreaterThanOrEqual(out[i - 1].distance);
      }
    }
  });

  it("marks curated results honestly", () => {
    const target = byName("Macragge Blue");
    const curatedIds = new Set(equivalentsOf(target).map(paintId));
    for (const s of findSubstitutes(target, ALL_PAINTS, 10)) {
      expect(s.curated).toBe(curatedIds.has(paintId(s.paint)));
    }
  });

  it("does not offer a colour nobody would accept as a stand-in", () => {
    // A collection of only yellows should yield no substitute for a dark blue,
    // rather than the least-bad yellow.
    const target = byName("Kantor Blue");
    const curatedIds = new Set(equivalentsOf(target).map(paintId));
    const yellows = ALL_PAINTS.filter(p =>
      /yellow/i.test(p.name) && !curatedIds.has(paintId(p)));

    expect(yellows.length).toBeGreaterThan(10);
    // None of them is a curated equivalent, so all must clear the distance bar —
    // and no yellow is within 14 of a dark blue, so nothing should be offered.
    expect(findSubstitutes(target, yellows)).toEqual([]);
  });

  it("respects the requested limit", () => {
    const target = byName("Mephiston Red");
    expect(findSubstitutes(target, ALL_PAINTS, 1).length).toBeLessThanOrEqual(1);
    expect(findSubstitutes(target, ALL_PAINTS, 5).length).toBeLessThanOrEqual(5);
  });

  it("reports a distance consistent with the colour maths", () => {
    const target = byName("Mephiston Red");
    for (const s of findSubstitutes(target, ALL_PAINTS, 5)) {
      expect(s.distance).toBeCloseTo(colorDistance(target.hex, s.paint.hex), 6);
    }
  });

  it("finds a usable substitute for most paints given a broad collection", () => {
    // Sanity check on the threshold: with a large collection the feature should
    // answer for the great majority of paints, or it is set too tight to be
    // useful.
    const owned = ALL_PAINTS.filter((_, i) => i % 3 === 0);
    const ownedIds = new Set(owned.map(paintId));
    const wanted = ALL_PAINTS.filter(p => !ownedIds.has(paintId(p)));
    const answered = wanted.filter(p => findSubstitutes(p, owned).length > 0);
    expect(answered.length / wanted.length).toBeGreaterThan(0.8);
  });
});
