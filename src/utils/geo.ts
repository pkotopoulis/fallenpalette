/** Mean Earth radius in kilometres, per IUGG. */
const EARTH_RADIUS_KM = 6371.0088;

const toRad = (deg: number) => (deg * Math.PI) / 180;

export interface Coords { lat: number; lng: number }

/**
 * Great-circle distance in kilometres between two points.
 *
 * Haversine, which is accurate enough at the scale that matters here — the
 * error against a proper ellipsoidal calculation is a few tenths of a percent
 * across Europe, far below the precision of "12 km away".
 */
export function distanceKm(a: Coords, b: Coords): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Distance for display. Metres below a kilometre, one decimal under 10 km, whole
 * kilometres above that — a shop is not 12.7 km away in any useful sense once
 * you are driving to it.
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/**
 * Sorts by distance from a point, nearest first.
 *
 * Anything without coordinates keeps its relative order and goes last: it is not
 * infinitely far away, it is unknown, and dropping it would hide a real shop.
 */
export function sortByDistance<T extends { lat?: number; lng?: number }>(
  items: T[],
  from: Coords,
): (T & { distanceKm?: number })[] {
  // Annotated rather than inferred: the two branches below produce a union, and
  // without this the sort callback cannot see distanceKm on either side.
  const measured: (T & { distanceKm?: number })[] = items.map(item =>
    item.lat != null && item.lng != null
      ? { ...item, distanceKm: distanceKm(from, { lat: item.lat, lng: item.lng }) }
      : { ...item });

  return measured
    .sort((a, b) => {
      if (a.distanceKm == null && b.distanceKm == null) return 0;
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });
}
