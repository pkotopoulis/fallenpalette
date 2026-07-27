import { describe, it, expect } from "vitest";
import { affiliateLinksFor, searchTermFor, AFFILIATES_ENABLED } from "./affiliates";
import { ALL_PAINTS } from "./paints";
import { BRANDS } from "./brands";

const byName = (name: string) => {
  const p = ALL_PAINTS.find(x => x.name === name);
  if (!p) throw new Error(`fixture paint "${name}" is missing`);
  return p;
};

describe("searchTermFor", () => {
  it("leads with the brand so another maker's same-named colour is not matched", () => {
    expect(searchTermFor(byName("Mephiston Red"))).toBe("Citadel Mephiston Red");
  });

  it("keeps the product code but drops the brackets", () => {
    // For Vallejo and AK the code is the most reliable identifier, but
    // parentheses are treated as syntax by some search engines.
    expect(searchTermFor(byName("Bone White (72.034)")))
      .toBe("Vallejo Game Color Bone White 72.034");
  });

  it("produces a clean single-spaced term for every paint", () => {
    for (const p of ALL_PAINTS) {
      const term = searchTermFor(p);
      expect(term, `empty term for ${p.name}`).toBeTruthy();
      expect(term).not.toMatch(/[()]/);
      expect(term).not.toMatch(/\s{2,}/);
      expect(term).toBe(term.trim());
      expect(term.startsWith(BRANDS[p.brand])).toBe(true);
    }
  });
});

describe("affiliateLinksFor", () => {
  it("returns nothing while no programme is configured", () => {
    // The whole feature is gated on real IDs. Shipping placeholder links would
    // look functional to a visitor while tracking nothing, so the default must
    // be silence rather than a broken link.
    if (!AFFILIATES_ENABLED) {
      expect(affiliateLinksFor(byName("Mephiston Red"))).toEqual([]);
    }
  });

  it("emits only absolute https links, whatever is configured", () => {
    for (const p of ALL_PAINTS.slice(0, 40)) {
      for (const l of affiliateLinksFor(p)) {
        expect(l.href.startsWith("https://"), `${l.name} is not https`).toBe(true);
        expect(() => new URL(l.href)).not.toThrow();
      }
    }
  });

  it("gives every link a unique id and a name", () => {
    for (const p of ALL_PAINTS.slice(0, 40)) {
      const links = affiliateLinksFor(p);
      const ids = links.map(l => l.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const l of links) expect(l.name).toBeTruthy();
    }
  });

  it("URL-encodes the search term rather than splicing it in raw", () => {
    // "Garaghak's Sewer" carries an apostrophe and spaces; unencoded they would
    // produce a malformed or truncated query.
    const links = affiliateLinksFor(byName("Garaghak's Sewer"));
    for (const l of links) {
      expect(l.href).not.toMatch(/ /);
      expect(() => new URL(l.href)).not.toThrow();
    }
  });

  it("gives each Amazon marketplace its own tag", () => {
    // Amazon issues a separate Associates ID per marketplace and a tag used on
    // the wrong store is silently untracked, so copy-pasting one tag across
    // marketplaces earns nothing while looking correct.
    const amazon = affiliateLinksFor(byName("Mephiston Red"))
      .filter(l => l.href.includes("amazon."));
    const tags = amazon.map(l => new URL(l.href).searchParams.get("tag"));
    for (const tag of tags) expect(tag, "Amazon link without a tag").toBeTruthy();
    expect(new Set(tags).size, `tag reused across marketplaces: ${tags.join(", ")}`).toBe(tags.length);
  });

  it("uses a European tag suffix on European marketplaces", () => {
    // "-21" is the European suffix; "-20" belongs to amazon.com and would not
    // track on these stores.
    for (const l of affiliateLinksFor(byName("Mephiston Red"))) {
      const url = new URL(l.href);
      if (!/amazon\.(co\.uk|de|es|it|fr|nl|se|pl)$/.test(url.host.replace(/^www\./, ""))) continue;
      expect(url.searchParams.get("tag"), `${url.host} tag is not a -21 tag`).toMatch(/-21$/);
    }
  });

  it("keeps AFFILIATES_ENABLED consistent with whether links are produced", () => {
    const links = affiliateLinksFor(byName("Mephiston Red"));
    expect(links.length > 0).toBe(AFFILIATES_ENABLED);
  });
});
