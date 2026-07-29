import { describe, it, expect } from "vitest";
import { findMixes, mixIsPredictable, mixHex } from "./mix";
import { colorDistance, oklabToHex, hexToOklab } from "./colors";
import { ALL_PAINTS, paintId } from "../data/paints";
import { Paint } from "../data/types";

const p = (name: string, hex: string, brand = "citadel"): Paint =>
  ({ brand, name, hex, type: "Base" });

const WHITE = p("W", "#ffffff");
const BLACK = p("K", "#000000");
const RED = p("R", "#c81a1a");
const YELLOW = p("Y", "#ffd400");
const BLUE = p("B", "#1a3ac8");
const MAGENTA = p("M", "#c81a7a");
const GREEN = p("G", "#1a8c2a");

describe("oklabToHex", () => {
  it("round-trips a hex through Oklab", () => {
    for (const hex of ["#000000", "#ffffff", "#c81a1a", "#1a3ac8", "#9a1115", "#8cc276"]) {
      expect(oklabToHex(hexToOklab(hex)).toLowerCase()).toBe(hex.toLowerCase());
    }
  });

  it("clamps out-of-gamut values instead of emitting nonsense", () => {
    const hex = oklabToHex({ L: 1.4, a: 0.5, b: -0.5 });
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("mixIsPredictable", () => {
  it("allows tints and shades, where interpolation behaves", () => {
    expect(mixIsPredictable(RED, WHITE)).toBe(true);
    expect(mixIsPredictable(YELLOW, BLACK)).toBe(true);
    expect(mixIsPredictable(BLUE, WHITE)).toBe(true);
  });

  it("allows neighbouring hues", () => {
    expect(mixIsPredictable(RED, MAGENTA)).toBe(true);
    expect(mixIsPredictable(RED, YELLOW)).toBe(true);
    expect(mixIsPredictable(GREEN, BLUE)).toBe(true);
  });

  it("refuses near-complementary pairs", () => {
    // The case the whole gate exists for: interpolation says grey-blue, paint
    // says green, and the error is the wrong colour rather than a near miss.
    expect(mixIsPredictable(YELLOW, BLUE)).toBe(false);
  });

  it("is symmetric", () => {
    for (const [x, y] of [[YELLOW, BLUE], [RED, WHITE], [GREEN, BLUE]] as const) {
      expect(mixIsPredictable(x, y)).toBe(mixIsPredictable(y, x));
    }
  });
});

describe("mixHex", () => {
  it("returns the endpoints at the extremes", () => {
    expect(mixHex(RED, WHITE, 0).toLowerCase()).toBe(RED.hex);
    expect(mixHex(RED, WHITE, 1).toLowerCase()).toBe(WHITE.hex);
  });

  it("predicts a tint close to the real result", () => {
    // White into red gives pink; checked against the outcome no painter disputes.
    expect(colorDistance(mixHex(RED, WHITE, 0.5), "#e88d8d")).toBeLessThan(5);
  });

  it("predicts an adjacent-hue mix close to the real result", () => {
    // Red and yellow give orange.
    expect(colorDistance(mixHex(RED, YELLOW, 0.5), "#e87a10")).toBeLessThan(5);
  });

  it("is monotonic in the ratio", () => {
    let prev = 0;
    for (const t of [0.2, 0.4, 0.6, 0.8, 1]) {
      const d = colorDistance(RED.hex, mixHex(RED, WHITE, t));
      expect(d).toBeGreaterThan(prev);
      prev = d;
    }
  });
});

describe("findMixes", () => {
  it("never proposes a mix no better than a paint already owned", () => {
    // If the shelf already answers it, a two-paint mix is a waste of time and
    // overstates what the tool knows.
    const target = p("target", "#e88d8d");
    const owned = [RED, WHITE, YELLOW];
    const veryClose = 0.5;
    expect(findMixes(target, owned, veryClose)).toEqual([]);
  });

  it("proposes a tint when nothing owned is close on its own", () => {
    const target = p("target", "#e88d8d");           // pink
    const owned = [RED, WHITE, BLUE];                 // no pink on the shelf
    const bestSingle = Math.min(...owned.map(o => colorDistance(target.hex, o.hex)));
    const mixes = findMixes(target, owned, bestSingle);

    expect(mixes.length).toBeGreaterThan(0);
    expect(mixes[0].distance).toBeLessThan(bestSingle);
    const names = [mixes[0].a.name, mixes[0].b.name].sort();
    expect(names).toEqual(["R", "W"]);
  });

  it("never proposes a refused pair, whatever the numbers say", () => {
    // Green sits between yellow and blue by interpolation, so without the gate
    // this is exactly the mix that would be offered — and it would be wrong.
    const target = p("target", "#84959f");
    const mixes = findMixes(target, [YELLOW, BLUE], 99);
    for (const m of mixes) {
      expect(mixIsPredictable(m.a, m.b)).toBe(true);
    }
    expect(mixes.every(m =>
      !([m.a.name, m.b.name].sort().join() === "B,Y"))).toBe(true);
  });

  it("reports parts a painter can measure", () => {
    const target = p("target", "#e88d8d");
    const owned = [RED, WHITE, BLUE];
    const bestSingle = Math.min(...owned.map(o => colorDistance(target.hex, o.hex)));
    for (const m of findMixes(target, owned, bestSingle, 5)) {
      expect(m.parts).toMatch(/^\d+ : \d+$/);
      expect(m.ratio).toBeGreaterThan(0);
      expect(m.ratio).toBeLessThan(1);
    }
  });

  it("returns one entry per pair, not one per ratio", () => {
    const target = p("target", "#e88d8d");
    const owned = [RED, WHITE, BLUE, MAGENTA];
    const mixes = findMixes(target, owned, 99, 20);
    const pairs = mixes.map(m => [paintId(m.a), paintId(m.b)].sort().join("|"));
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it("orders by predicted closeness and respects the limit", () => {
    const target = p("target", "#e88d8d");
    const owned = [RED, WHITE, BLUE, MAGENTA, YELLOW];
    const mixes = findMixes(target, owned, 99, 3);
    expect(mixes.length).toBeLessThanOrEqual(3);
    for (let i = 1; i < mixes.length; i++) {
      expect(mixes[i].distance).toBeGreaterThanOrEqual(mixes[i - 1].distance);
    }
  });

  it("never mixes the target with itself", () => {
    const target = ALL_PAINTS.find(x => x.name === "Mephiston Red")!;
    for (const m of findMixes(target, ALL_PAINTS.slice(0, 60), 99, 5)) {
      expect(paintId(m.a)).not.toBe(paintId(target));
      expect(paintId(m.b)).not.toBe(paintId(target));
    }
  });

  it("reports a predicted colour consistent with its own ratio", () => {
    const target = p("target", "#e88d8d");
    const owned = [RED, WHITE, BLUE];
    for (const m of findMixes(target, owned, 99, 5)) {
      expect(m.hex).toBe(mixHex(m.a, m.b, m.ratio));
      expect(m.distance).toBeCloseTo(colorDistance(target.hex, m.hex), 6);
    }
  });
});
