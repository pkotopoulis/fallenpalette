/**
 * Groups the catalog's 23 paint ranges into a handful of kinds users actually
 * filter by.
 *
 * Twenty-three chips would be unusable, and the distinction that matters at the
 * bench is not "Layer vs Base" but "will this cover, or is it a transparent
 * shading paint". The speed-paint ranges in particular behave nothing like an
 * opaque base coat and are the ones people want out of the way when matching
 * one solid colour to another.
 */

export type RangeKind = "opaque" | "speed" | "wash" | "metallic" | "technical";

export const RANGE_KIND_IDS: RangeKind[] = ["opaque", "speed", "wash", "metallic", "technical"];

const KIND_BY_TYPE: Record<string, RangeKind> = {
  // Opaque — normal covering paints, whatever each brand calls its tiers
  "Base": "opaque",
  "Layer": "opaque",
  "Dry": "opaque",
  "Game Color": "opaque",
  "Model Color": "opaque",
  "Fanatic": "opaque",
  "3rd Gen": "opaque",
  "Scalecolor": "opaque",
  "Base Set": "opaque",
  "Expansion": "opaque",
  "Shadow": "opaque",
  "Midtone": "opaque",
  "Highlight": "opaque",

  // Speed paints — transparent, one-coat, only work over a light undercoat
  "Contrast": "speed",
  "Xpress Color": "speed",
  "Speedpaint": "speed",
  "Instant Color": "speed",

  // Washes and shades — for recesses, over an existing base coat
  "Shade": "wash",
  "Game Wash": "wash",
  "Quickshade Wash": "wash",

  "Metallic": "metallic",
  "Scalecolor Metal": "metallic",

  "Technical": "technical",
};

/**
 * Kind for a paint's range. Unknown ranges fall back to "opaque" so a newly
 * added range is never invisible: it shows under the default-on filter until
 * classified here.
 */
export const rangeKindOf = (type: string): RangeKind => KIND_BY_TYPE[type] ?? "opaque";
