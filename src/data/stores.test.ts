import { describe, it, expect } from "vitest";
import { STORES, DAY_ORDER } from "./stores";

/** Rough bounding boxes, generous enough to allow for a country's real extent
 *  but tight enough to catch a swapped or mistyped coordinate. */
const BOUNDS: Record<string, [number, number, number, number]> = {
  // country: [minLat, maxLat, minLng, maxLng]
  "Greece": [34.5, 41.8, 19.3, 29.8],
  "United Kingdom": [49.8, 61.0, -8.7, 2.0],
  "Germany": [47.2, 55.1, 5.8, 15.1],
  "Spain": [35.9, 43.9, -9.4, 4.4],
  "Italy": [35.4, 47.1, 6.6, 18.6],
  "Austria": [46.3, 49.1, 9.5, 17.2],
  "France": [41.3, 51.2, -5.2, 9.6],
  "Belgium": [49.4, 51.6, 2.5, 6.5],
  "Netherlands": [50.7, 53.6, 3.3, 7.3],
  "Ireland": [51.4, 55.5, -10.6, -5.9],
  "Denmark": [54.5, 57.8, 8.0, 15.2],
  "Sweden": [55.3, 69.1, 11.0, 24.2],
  "Norway": [57.9, 71.2, 4.6, 31.2],
  "Finland": [59.7, 70.1, 20.5, 31.6],
  "Poland": [49.0, 54.9, 14.1, 24.2],
  "Czechia": [48.5, 51.1, 12.0, 18.9],
};

describe("store data", () => {
  it("has unique ids", () => {
    const ids = STORES.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a name, city and country on every store", () => {
    for (const s of STORES) {
      expect(s.name.trim(), `store ${s.id} has no name`).toBeTruthy();
      expect(s.city.trim(), `${s.name} has no city`).toBeTruthy();
      expect(s.country.trim(), `${s.name} has no country`).toBeTruthy();
    }
  });

  it("places every coordinate inside its own country", () => {
    // The Directions button navigates straight to lat/lng, so a coordinate in
    // the wrong country would send someone a long way wrong. A swapped lat/lng
    // pair is the usual way this happens and this catches it.
    for (const s of STORES) {
      if (s.lat == null || s.lng == null) continue;
      const box = BOUNDS[s.country];
      expect(box, `no bounding box defined for ${s.country}`).toBeTruthy();
      const [minLat, maxLat, minLng, maxLng] = box;
      expect(s.lat, `${s.name}: latitude ${s.lat} is outside ${s.country}`)
        .toBeGreaterThanOrEqual(minLat);
      expect(s.lat, `${s.name}: latitude ${s.lat} is outside ${s.country}`)
        .toBeLessThanOrEqual(maxLat);
      expect(s.lng, `${s.name}: longitude ${s.lng} is outside ${s.country}`)
        .toBeGreaterThanOrEqual(minLng);
      expect(s.lng, `${s.name}: longitude ${s.lng} is outside ${s.country}`)
        .toBeLessThanOrEqual(maxLng);
    }
  });

  it("gives latitude and longitude together or not at all", () => {
    // One without the other renders no pin but reads as though it should.
    for (const s of STORES) {
      expect((s.lat == null) === (s.lng == null), `${s.name} has only one half of its coordinate`).toBe(true);
    }
  });

  it("keeps almost every store on the map", () => {
    // 6 of 53 were invisible before geocoding. Only GameVille in Volos is
    // knowingly left off, because OpenStreetMap's match for its address
    // disagrees with the postcode on record.
    const unmapped = STORES.filter(s => s.lat == null || s.lng == null);
    expect(unmapped.length, `unmapped: ${unmapped.map(s => s.name).join(", ")}`).toBeLessThanOrEqual(1);
  });

  it("uses only known day keys, with a value or an empty string", () => {
    for (const s of STORES) {
      expect(Object.keys(s.hours).sort()).toEqual([...DAY_ORDER].sort());
      for (const d of DAY_ORDER) expect(typeof s.hours[d]).toBe("string");
    }
  });

  it("gives every store a colour for its map pin", () => {
    for (const s of STORES) {
      expect(s.color, `${s.name} has no pin colour`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("uses a plausible url when a website is listed", () => {
    for (const s of STORES) {
      if (!s.website) continue;
      expect(() => new URL(s.website!), `${s.name} has an unparseable website`).not.toThrow();
      expect(s.website).toMatch(/^https?:\/\//);
    }
  });
});
