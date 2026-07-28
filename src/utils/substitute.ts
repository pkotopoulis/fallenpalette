import { Paint } from "../data/types";
import { paintId, equivalentsOf } from "../data/paints";
import { colorDistance } from "./colors";

/**
 * The closest paint you already own to one you don't.
 *
 * The question at the desk is not "what else exists in this colour" — the
 * cross-reference already answers that — but "can I paint this tonight with what
 * is on the shelf".
 */
export interface Substitute {
  paint: Paint;
  /** Perceptual distance from the target, so the UI can badge it. */
  distance: number;
  /**
   * True when the target's own equivalence group vouches for this paint, rather
   * than it merely being the nearest thing by colour. A curated match is a
   * stronger claim than a measured one, and worth saying so.
   */
  curated: boolean;
}

/**
 * Ranks owned paints by how well they stand in for the target.
 *
 * Curated equivalents come first regardless of distance: the groups are
 * hand-authored, and a painter's judgement that two paints interchange beats a
 * colour measurement that says one is marginally closer. Within each tier the
 * ordering is by perceptual distance.
 *
 * Returns nothing when the target is already owned — there is nothing to
 * substitute — and nothing for owned paints that are too far away to be a
 * believable stand-in.
 */
export function findSubstitutes(
  target: Paint,
  owned: Paint[],
  limit = 3,
  maxDistance = 14,
): Substitute[] {
  const targetId = paintId(target);
  if (owned.some(p => paintId(p) === targetId)) return [];

  const curatedIds = new Set(equivalentsOf(target).map(paintId));

  return owned
    .filter(p => paintId(p) !== targetId)
    .map(p => ({
      paint: p,
      distance: colorDistance(target.hex, p.hex),
      curated: curatedIds.has(paintId(p)),
    }))
    // A curated equivalent is kept whatever its distance, since the group is a
    // deliberate statement about the pair. Everything else has to be close
    // enough to be worth suggesting at all.
    .filter(s => s.curated || s.distance <= maxDistance)
    .sort((a, b) =>
      a.curated !== b.curated ? (a.curated ? -1 : 1) : a.distance - b.distance)
    .slice(0, limit);
}
