import { Paint } from "./types";
import { BRANDS } from "./brands";

/**
 * Affiliate "where to buy" links.
 *
 * With 620 paints there is no practical way to hold a product URL per paint per
 * retailer, so every link points at the retailer's own search for the paint.
 * That works across the whole catalog and stays correct as retailers restock.
 *
 * ───────────────────────────────────────────────────────────────────────────
 *  FILL IN THE IDS BELOW. A retailer with a blank ID is skipped entirely, so
 *  the "where to buy" block shows only the programmes actually configured and
 *  disappears when none are. Nothing is live until a real value is pasted in —
 *  a placeholder ID would produce links that look like they work while
 *  earning nothing.
 * ───────────────────────────────────────────────────────────────────────────
 */

/**
 * Amazon Associates tag, per marketplace. The tag must match the marketplace:
 * "-21" tags belong to the European stores, "-20" to amazon.com. A mismatched
 * tag is silently untracked.
 */
const AMAZON_MARKETPLACES: { label: string; host: string; tag: string }[] = [
  { label: "Amazon UK", host: "www.amazon.co.uk", tag: "fallenpalette-21" },
  { label: "Amazon DE", host: "www.amazon.de", tag: "" },     // separate account and tag; ships to most of the EU
];

/** Awin publisher ID, from your Awin dashboard. Shared by every Awin advertiser. */
const AWIN_PUBLISHER_ID = "";

/** Awin advertiser (merchant) ID for Wayland Games, from their programme page. */
const WAYLAND_AWIN_ADVERTISER_ID = "";

/**
 * Element Games affiliate parameter.
 *
 * Their scheme pays 5% and tracks returning visitors, but the link format is
 * not published — take it from the affiliate dashboard after signing up at
 * elementgames.co.uk/affiliation and set this to match. Their terms restrict
 * the scheme to content creators rather than aggregator sites, so confirm
 * eligibility before relying on it.
 */
const ELEMENT_GAMES_PARAM = { name: "d", value: "" };

export interface AffiliateLink {
  /** Stable key for lists and tests. */
  id: string;
  name: string;
  href: string;
}

/**
 * Search term for a paint. Carries the brand so a retailer's search does not
 * return another manufacturer's identically-named colour, and keeps the
 * product code — for Vallejo and AK it is the most reliable identifier — but
 * drops the brackets, which some search engines treat as syntax.
 */
export function searchTermFor(paint: Paint): string {
  const name = paint.name.replace(/[()]/g, " ").replace(/\s+/g, " ").trim();
  return `${BRANDS[paint.brand] ?? paint.brand} ${name}`.trim();
}

/** Wraps a destination URL in an Awin tracked link. */
function awinLink(advertiserId: string, destination: string): string {
  const params = new URLSearchParams({
    awinmid: advertiserId,
    awinaffid: AWIN_PUBLISHER_ID,
    ued: destination,
  });
  return `https://www.awin1.com/cread.php?${params}`;
}

export function affiliateLinksFor(paint: Paint): AffiliateLink[] {
  const term = searchTermFor(paint);
  const links: AffiliateLink[] = [];

  for (const m of AMAZON_MARKETPLACES) {
    if (!m.tag) continue;
    links.push({
      id: m.host,
      name: m.label,
      href: `https://${m.host}/s?${new URLSearchParams({ k: term, tag: m.tag })}`,
    });
  }

  if (AWIN_PUBLISHER_ID && WAYLAND_AWIN_ADVERTISER_ID) {
    links.push({
      id: "wayland",
      name: "Wayland Games",
      href: awinLink(
        WAYLAND_AWIN_ADVERTISER_ID,
        `https://www.waylandgames.co.uk/search?q=${encodeURIComponent(term)}`,
      ),
    });
  }

  if (ELEMENT_GAMES_PARAM.value) {
    const url = new URL("https://elementgames.co.uk/search");
    url.searchParams.set("q", term);
    url.searchParams.set(ELEMENT_GAMES_PARAM.name, ELEMENT_GAMES_PARAM.value);
    links.push({ id: "element", name: "Element Games", href: url.toString() });
  }

  return links;
}

/** True when at least one programme is configured, so the UI can stay hidden. */
export const AFFILIATES_ENABLED =
  AMAZON_MARKETPLACES.some(m => m.tag) ||
  Boolean(AWIN_PUBLISHER_ID && WAYLAND_AWIN_ADVERTISER_ID) ||
  Boolean(ELEMENT_GAMES_PARAM.value);

/** True when any Amazon marketplace is live, which triggers its own disclosure. */
export const AMAZON_ENABLED = AMAZON_MARKETPLACES.some(m => m.tag);

/**
 * Amazon's prescribed disclosure, quoted verbatim from section 5 of the
 * Associates Programme Operating Agreement, which requires this exact sentence
 * (or a previously-allowed equivalent) "clearly and prominently" on the site.
 *
 * Deliberately not translated and not reworded: compliance checks look for this
 * string, and a paraphrase risks the account. The generic affiliate note in the
 * dictionaries covers the localised explanation alongside it.
 */
export const AMAZON_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";
