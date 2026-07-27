/**
 * The URL contract for the app, in one place.
 *
 * The location is the source of truth for which view is open, which paint is
 * selected and what was searched for. These are the pure mappings between a
 * location and that state; App wires them to the router.
 *
 * Paths here are public URLs — people bookmark and share them, and search
 * engines index them — so treat changes as breaking.
 */

export type Tab = "match" | "collection" | "stores";

export const TAB_PATH: Record<Tab, string> = {
  match: "/colours",
  collection: "/my-paints",
  stores: "/stores",
};

export const DEFAULT_HEX = "#9a1115";

export function tabFromPath(pathname: string): Tab {
  if (pathname.startsWith("/my-paints")) return "collection";
  if (pathname.startsWith("/stores")) return "stores";
  return "match";
}

/** True for the all-paints index. Guarded so it cannot also match /paint/... */
export function isPaintsIndexPath(pathname: string): boolean {
  return pathname === "/paints" || pathname.startsWith("/paints/");
}

export function modeFromParams(params: URLSearchParams): "name" | "hex" {
  return params.has("hex") ? "hex" : "name";
}

/** Normalises the bare hex in the URL back to a "#rrggbb" value. */
export function hexFromParams(params: URLSearchParams): string {
  const raw = params.get("hex");
  if (!raw) return DEFAULT_HEX;
  const clean = raw.replace(/^#/, "").toLowerCase();
  return /^[0-9a-f]{6}$/.test(clean) ? `#${clean}` : DEFAULT_HEX;
}

export function queryFromParams(params: URLSearchParams): string {
  return params.get("q") ?? "";
}

/** Target for a text search. Empty query drops the parameter entirely. */
export function searchPath(query: string): string {
  return query ? `/colours?q=${encodeURIComponent(query)}` : "/colours";
}

/** Target for colour-picker mode. */
export function hexSearchPath(hex: string): string {
  return `/colours?hex=${hex.replace(/^#/, "")}`;
}
