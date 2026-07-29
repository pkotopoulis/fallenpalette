import { describe, it, expect } from "vitest";
import { extractPalette, sampleSize, SAMPLE_EDGE } from "./palette";
import { colorDistance } from "./colors";

/** Builds RGBA pixel data from a list of [hex, count] pairs. */
function pixels(spec: [string, number][], alpha = 255): Uint8ClampedArray {
  const total = spec.reduce((n, [, c]) => n + c, 0);
  const out = new Uint8ClampedArray(total * 4);
  let i = 0;
  for (const [hex, count] of spec) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    for (let n = 0; n < count; n++) {
      out[i++] = r; out[i++] = g; out[i++] = b; out[i++] = alpha;
    }
  }
  return out;
}

describe("extractPalette", () => {
  it("returns nothing for no pixels", () => {
    expect(extractPalette(new Uint8ClampedArray(0))).toEqual([]);
  });

  it("finds a single colour in a flat image", () => {
    const out = extractPalette(pixels([["#c81a1a", 100]]), 6);
    expect(out.length).toBe(1);
    expect(colorDistance(out[0].hex, "#c81a1a")).toBeLessThan(1);
    expect(out[0].share).toBeCloseTo(1, 6);
  });

  it("separates two distinct colours and reports their shares", () => {
    const out = extractPalette(pixels([["#c81a1a", 75], ["#1a3ac8", 25]]), 6);
    expect(out.length).toBe(2);
    // Ordered by share, so red first.
    expect(colorDistance(out[0].hex, "#c81a1a")).toBeLessThan(1);
    expect(out[0].share).toBeCloseTo(0.75, 2);
    expect(colorDistance(out[1].hex, "#1a3ac8")).toBeLessThan(1);
    expect(out[1].share).toBeCloseTo(0.25, 2);
  });

  it("finds all of a handful of well-separated colours", () => {
    const wanted = ["#c81a1a", "#1a8c2a", "#1a3ac8", "#ffd400", "#ffffff", "#000000"];
    const out = extractPalette(pixels(wanted.map(h => [h, 40] as [string, number])), 6);
    expect(out.length).toBe(6);
    for (const w of wanted) {
      const nearest = Math.min(...out.map(o => colorDistance(o.hex, w)));
      expect(nearest, `no cluster found near ${w}`).toBeLessThan(3);
    }
  });

  it("shares sum to one", () => {
    const out = extractPalette(pixels([["#c81a1a", 30], ["#1a3ac8", 45], ["#ffd400", 25]]), 6);
    expect(out.reduce((n, e) => n + e.share, 0)).toBeCloseTo(1, 6);
  });

  it("never returns more clusters than asked for, or than there are pixels", () => {
    expect(extractPalette(pixels([["#c81a1a", 50], ["#1a3ac8", 50]]), 2).length).toBeLessThanOrEqual(2);
    expect(extractPalette(pixels([["#c81a1a", 1]]), 6).length).toBe(1);
  });

  it("is deterministic", () => {
    // A palette that shifted between runs would look broken to anyone who
    // re-dropped the same photo, and could not be tested.
    const data = pixels([["#c81a1a", 33], ["#1a8c2a", 21], ["#1a3ac8", 46]]);
    const a = extractPalette(data, 5);
    const b = extractPalette(data, 5);
    expect(a).toEqual(b);
  });

  it("ignores transparent pixels rather than counting them as black", () => {
    const opaque = pixels([["#c81a1a", 50]]);
    const transparent = pixels([["#000000", 50]], 0);
    const both = new Uint8ClampedArray(opaque.length + transparent.length);
    both.set(opaque, 0);
    both.set(transparent, opaque.length);

    const out = extractPalette(both, 6);
    expect(out.length).toBe(1);
    expect(colorDistance(out[0].hex, "#c81a1a")).toBeLessThan(1);
    expect(out[0].share).toBeCloseTo(1, 6);
  });

  it("returns nothing when every pixel is transparent", () => {
    expect(extractPalette(pixels([["#123456", 40]], 0))).toEqual([]);
  });

  it("emits well-formed hex", () => {
    const out = extractPalette(pixels([["#c81a1a", 20], ["#ffd400", 20], ["#1a3ac8", 20]]), 4);
    for (const e of out) expect(e.hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("orders by share, largest first", () => {
    const out = extractPalette(pixels([["#c81a1a", 10], ["#1a3ac8", 60], ["#ffd400", 30]]), 6);
    for (let i = 1; i < out.length; i++) {
      expect(out[i].share).toBeLessThanOrEqual(out[i - 1].share);
    }
  });
});

describe("sampleSize", () => {
  it("leaves a small image alone", () => {
    expect(sampleSize(80, 60)).toEqual({ width: 80, height: 60 });
  });

  it("fits the longest edge and preserves aspect ratio", () => {
    const out = sampleSize(4000, 3000);
    expect(Math.max(out.width, out.height)).toBe(SAMPLE_EDGE);
    expect(out.width / out.height).toBeCloseTo(4000 / 3000, 1);
  });

  it("handles portrait and extreme aspect ratios without collapsing to zero", () => {
    const tall = sampleSize(1000, 4000);
    expect(Math.max(tall.width, tall.height)).toBe(SAMPLE_EDGE);
    expect(tall.width).toBeGreaterThanOrEqual(1);

    const sliver = sampleSize(5000, 3);
    expect(sliver.height).toBeGreaterThanOrEqual(1);
    expect(sliver.width).toBe(SAMPLE_EDGE);
  });
});
