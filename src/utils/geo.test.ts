import { describe, it, expect } from "vitest";
import { distanceKm, formatDistance, sortByDistance } from "./geo";
import { STORES } from "../data/stores";

// Reference points with distances that can be checked independently.
const ATHENS = { lat: 37.9838, lng: 23.7275 };
const THESSALONIKI = { lat: 40.6401, lng: 22.9444 };
const LONDON = { lat: 51.5074, lng: -0.1278 };

describe("distanceKm", () => {
  it("is zero for the same point", () => {
    expect(distanceKm(ATHENS, ATHENS)).toBeCloseTo(0, 9);
  });

  it("is symmetric", () => {
    expect(distanceKm(ATHENS, LONDON)).toBeCloseTo(distanceKm(LONDON, ATHENS), 9);
  });

  it("matches known distances", () => {
    // Athens to Thessaloniki is about 302 km great-circle, Athens to London
    // about 2400 km. Tolerances are wide enough to allow for the exact
    // coordinates used but tight enough to catch a wrong formula or unit.
    expect(distanceKm(ATHENS, THESSALONIKI)).toBeGreaterThan(290);
    expect(distanceKm(ATHENS, THESSALONIKI)).toBeLessThan(315);
    expect(distanceKm(ATHENS, LONDON)).toBeGreaterThan(2350);
    expect(distanceKm(ATHENS, LONDON)).toBeLessThan(2450);
  });

  it("handles antipodal and equatorial extremes without NaN", () => {
    // sqrt of a value rounding just above 1 would produce NaN via asin.
    expect(distanceKm({ lat: 0, lng: 0 }, { lat: 0, lng: 180 })).toBeCloseTo(20015, 0);
    expect(distanceKm({ lat: 90, lng: 0 }, { lat: -90, lng: 0 })).toBeCloseTo(20015, 0);
    expect(Number.isNaN(distanceKm({ lat: 90, lng: 0 }, { lat: -90, lng: 180 }))).toBe(false);
  });

  it("crosses the antimeridian by the short way", () => {
    const near = distanceKm({ lat: 0, lng: 179.5 }, { lat: 0, lng: -179.5 });
    expect(near).toBeLessThan(120);
  });
});

describe("formatDistance", () => {
  it("uses metres under a kilometre", () => {
    expect(formatDistance(0.4)).toBe("400 m");
    expect(formatDistance(0.999)).toBe("999 m");
  });

  it("uses one decimal under ten kilometres", () => {
    expect(formatDistance(1)).toBe("1.0 km");
    expect(formatDistance(9.94)).toBe("9.9 km");
  });

  it("rounds to whole kilometres above ten", () => {
    expect(formatDistance(12.7)).toBe("13 km");
    expect(formatDistance(302.4)).toBe("302 km");
  });
});

describe("sortByDistance", () => {
  it("puts the nearest first", () => {
    const sorted = sortByDistance(STORES, THESSALONIKI);
    const withCoords = sorted.filter(s => s.distanceKm != null);
    for (let i = 1; i < withCoords.length; i++) {
      expect(withCoords[i].distanceKm!).toBeGreaterThanOrEqual(withCoords[i - 1].distanceKm!);
    }
    // Sanity: from Thessaloniki, the nearest shop should be in or near it.
    expect(["Thessaloniki", "Kalamaria"]).toContain(withCoords[0].city);
  });

  it("keeps every store, and puts unmapped ones last", () => {
    const sorted = sortByDistance(STORES, ATHENS);
    expect(sorted.length).toBe(STORES.length);

    const firstUnmapped = sorted.findIndex(s => s.distanceKm == null);
    if (firstUnmapped !== -1) {
      // Nothing with a distance may appear after the first without one. A store
      // whose position is unknown is not infinitely far away, and dropping it
      // would hide a real shop.
      expect(sorted.slice(firstUnmapped).every(s => s.distanceKm == null)).toBe(true);
    }
  });

  it("does not mutate the input", () => {
    const before = STORES.map(s => s.id);
    sortByDistance(STORES, LONDON);
    expect(STORES.map(s => s.id)).toEqual(before);
  });

  it("gives every mapped store a distance", () => {
    const sorted = sortByDistance(STORES, ATHENS);
    const mapped = STORES.filter(s => s.lat != null && s.lng != null).length;
    expect(sorted.filter(s => s.distanceKm != null).length).toBe(mapped);
  });
});
