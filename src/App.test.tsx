// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { AFFILIATES_ENABLED, AMAZON_ENABLED, AMAZON_DISCLOSURE } from "./data/affiliates";

// Leaflet needs a real layout engine, which happy-dom does not provide, and the
// map is irrelevant to routing. Stub the pieces App imports.
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }: any) => <div>{children}</div>,
  Popup: ({ children }: any) => <div>{children}</div>,
  useMap: () => ({ flyTo: () => {}, getZoom: () => 10 }),
}));
vi.mock("leaflet", () => ({ default: { divIcon: () => ({}) } }));

/** Mounts the app at a URL, with the same route table as main.tsx. */
const at = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/colours" element={<App />} />
        <Route path="/paint/:brand/:slug" element={<App />} />
        <Route path="/paints" element={<App />} />
        <Route path="/my-paints" element={<App />} />
        <Route path="/stores" element={<App />} />
        <Route path="*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );

// Node does not expose a working bare localStorage global here, and the app
// reads it unqualified, so without a stub every collection is empty and the
// saved-paints view cannot be tested at all.
if (!globalThis.localStorage) {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => { store.set(k, String(v)); },
      removeItem: (k: string) => { store.delete(k); },
      clear: () => { store.clear(); },
      key: (i: number) => [...store.keys()][i] ?? null,
      get length() { return store.size; },
    },
  });
}

beforeEach(() => { try { localStorage.clear(); } catch {} });
afterEach(cleanup);

describe("routing", () => {
  it("mounts at the root without throwing", () => {
    at("/");
    expect(screen.getByRole("banner")).toBeTruthy();
  });

  it("opens a paint from its own URL", () => {
    at("/paint/citadel/mephiston-red");
    // The selected paint is shown in the hero card, and its curated
    // equivalents alongside it.
    expect(screen.getAllByTitle("Mephiston Red").length).toBeGreaterThan(0);
    expect(screen.getByText("Direct equivalents")).toBeTruthy();
  });

  it("puts the paint name in the document title and description", () => {
    at("/paint/citadel/mephiston-red");
    expect(document.title).toContain("Mephiston Red");
    const desc = document.head.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    expect(desc).toContain("Mephiston Red");
    const canonical = document.head.querySelector('link[rel="canonical"]')?.getAttribute("href");
    expect(canonical).toBe("https://fallenpalette.com/paint/citadel/mephiston-red");
  });

  it("shows the shading triad on a paint page", () => {
    at("/paint/citadel/macragge-blue");
    expect(screen.getByText("Shading triad")).toBeTruthy();
    // Kantor Blue is the shade the maths picks for Macragge Blue.
    expect(screen.getAllByTitle(/Kantor Blue/).length).toBeGreaterThan(0);
  });

  it("falls back to the search view for an unknown paint URL", () => {
    // A stale or mistyped link must not render a blank page.
    at("/paint/citadel/no-such-paint");
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.queryByText("Direct equivalents")).toBeNull();
    expect(document.querySelector(".search-input")).toBeTruthy();
    expect(document.title).not.toContain("undefined");
  });

  it("restores the search text from the URL", () => {
    at("/colours?q=mephiston");
    expect((document.querySelector(".search-input") as HTMLInputElement).value).toBe("mephiston");
  });

  it("opens colour-picker mode from a hex in the URL", () => {
    at("/colours?hex=1a6ab4");
    expect((document.querySelector(".hex-input") as HTMLInputElement).value).toBe("#1a6ab4");
  });

  it("renders the collection tab at its own URL", () => {
    at("/my-paints");
    expect(document.title).toContain("Fallen Palette");
    expect(document.querySelector(".hex-input")).toBeNull();
  });

  it("renders the stores tab at its own URL", () => {
    at("/stores");
    expect(screen.getByTestId("map")).toBeTruthy();
  });

  it("lists every paint on the index, as real links", () => {
    at("/paints");
    const links = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="/paint/"]')];
    // One anchor per paint, so a crawler can reach all of them without JS
    // driving the search box.
    expect(links.length).toBeGreaterThan(600);
    expect(links.some(a => a.getAttribute("href") === "/paint/citadel/mephiston-red")).toBe(true);
    expect(document.title).toContain("paints");
  });

  it("filters the paints index", () => {
    at("/paints");
    const rows = () => document.querySelectorAll('a[href^="/paint/"]').length;
    const all = rows();
    expect(all).toBeGreaterThan(600);

    fireEvent.change(document.querySelector(".index-hint")!.parentElement!.querySelector(".search-input")!,
      { target: { value: "mephiston" } });
    expect(rows()).toBeLessThan(all);
    expect(rows()).toBeGreaterThan(0);
    expect(document.body.textContent).toContain("Mephiston Red");
  });

  it("says so when the index filter matches nothing", () => {
    at("/paints");
    fireEvent.change(document.querySelector(".search-input")!, { target: { value: "zzzznotapaint" } });
    expect(document.querySelectorAll('a[href^="/paint/"]').length).toBe(0);
    expect(document.body.textContent).toMatch(/No paints match/i);
  });

  it("does not ask for location until told to", () => {
    // An unprompted location prompt on a paint website is hostile, so the
    // geolocation API must not be touched on load.
    const getCurrentPosition = vi.fn();
    vi.stubGlobal("navigator", { ...navigator, geolocation: { getCurrentPosition } });
    at("/stores");
    expect(getCurrentPosition).not.toHaveBeenCalled();
    expect(document.querySelector(".near-btn")).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it("sorts stores nearest first once a location is granted", () => {
    // Thessaloniki: the nearest shops should be the ones in and around it.
    const getCurrentPosition = vi.fn(ok =>
      ok({ coords: { latitude: 40.6401, longitude: 22.9444 } }));
    vi.stubGlobal("navigator", { ...navigator, geolocation: { getCurrentPosition } });

    at("/stores");
    fireEvent.click(document.querySelector(".near-btn")!);
    expect(getCurrentPosition).toHaveBeenCalled();

    const cities = [...document.querySelectorAll(".store-addr")].map(el => el.textContent ?? "");
    expect(cities[0]).toMatch(/Thessaloniki|Kalamaria/);
    // Distances are shown, and the unmapped store says so rather than claiming 0.
    expect(document.body.textContent).toMatch(/\d+(\.\d)? ?(m|km)/);
    expect(document.body.textContent).toContain("location not mapped");
    vi.unstubAllGlobals();
  });

  it("keeps the usual order and explains itself when location is refused", () => {
    const getCurrentPosition = vi.fn((_ok, fail) =>
      fail({ code: 1, PERMISSION_DENIED: 1 }));
    vi.stubGlobal("navigator", { ...navigator, geolocation: { getCurrentPosition } });

    at("/stores");
    const before = [...document.querySelectorAll(".store-addr")].map(el => el.textContent);
    fireEvent.click(document.querySelector(".near-btn")!);

    expect(document.body.textContent).toMatch(/permission was declined/i);
    const after = [...document.querySelectorAll(".store-addr")].map(el => el.textContent);
    expect(after).toEqual(before);
    vi.unstubAllGlobals();
  });

  it("copes with a browser that has no geolocation at all", () => {
    vi.stubGlobal("navigator", { ...navigator, geolocation: undefined });
    at("/stores");
    fireEvent.click(document.querySelector(".near-btn")!);
    expect(document.body.textContent).toMatch(/could not provide a location/i);
    vi.unstubAllGlobals();
  });

  it("puts every top-level view in the nav as a real link", () => {
    // The paint index used to be reachable only from the footer. In the nav it
    // is findable, and links rather than buttons mean a crawler can follow them.
    at("/");
    const nav = document.querySelector("nav")!;
    const hrefs = [...nav.querySelectorAll<HTMLAnchorElement>("a.nav-btn")]
      .map(a => a.getAttribute("href"));
    expect(hrefs).toEqual(["/colours", "/paints", "/my-paints", "/stores"]);
  });

  it("marks the nav item for the open view as active, one at a time", () => {
    for (const [url, expected] of [
      ["/colours", "/colours"],
      ["/paints", "/paints"],
      ["/my-paints", "/my-paints"],
      ["/stores", "/stores"],
      // A paint page is still part of the colour-search section.
      ["/paint/citadel/mephiston-red", "/colours"],
    ] as const) {
      at(url);
      const active = [...document.querySelectorAll<HTMLAnchorElement>("a.nav-btn.active")];
      expect(active.length, `expected exactly one active nav item at ${url}`).toBe(1);
      expect(active[0].getAttribute("href"), `wrong nav item active at ${url}`).toBe(expected);
      cleanup();
    }
  });

  it("shows the buy block above the results, not buried under them", () => {
    // It was originally after the equivalents grid, which on a wide screen put
    // it off-screen; the report was simply "I don't see any dropdown".
    at("/paint/citadel/mephiston-red");
    const buy = document.querySelector(".buy-block");
    const firstGrid = document.querySelector(".results-grid");
    if (buy && firstGrid) {
      expect(buy.compareDocumentPosition(firstGrid) & Node.DOCUMENT_POSITION_FOLLOWING,
        "buy block should come before the first results grid").toBeTruthy();
    }
  });

  it("filters speed paints out of results when their chip is switched off", () => {
    // The point of the feature: 318 transparent paints were competing in every
    // opaque-paint search with no way to exclude them.
    at("/colours?hex=9a1115");
    const speedTypes = ["Contrast", "Xpress Color", "Speedpaint", "Instant Color"];
    const rangesShown = () =>
      [...document.querySelectorAll(".range-badge")].map(el => el.textContent ?? "");

    expect(rangesShown().some(r => speedTypes.includes(r)), "expected speed paints by default").toBe(true);

    const chip = [...document.querySelectorAll<HTMLButtonElement>(".chips-range .chip")]
      .find(b => b.textContent?.includes("Speed paints"))!;
    expect(chip).toBeTruthy();
    fireEvent.click(chip);

    expect(rangesShown().some(r => speedTypes.includes(r))).toBe(false);
    expect(rangesShown().length, "other paints should still be listed").toBeGreaterThan(0);
  });

  it("refuses to switch off the last range, which would empty the page", () => {
    at("/colours?hex=9a1115");
    const chips = () => [...document.querySelectorAll<HTMLButtonElement>(".chips-range .chip")];
    // Re-query every iteration: React replaces these nodes on each re-render,
    // so a list captured up front goes stale after the first click.
    for (let i = 0; i < chips().length + 1; i++) {
      const next = chips().find(c => c.className.includes("active"));
      if (!next) break;
      fireEvent.click(next);
    }
    const stillOn = chips().filter(c => c.className.includes("active"));
    expect(stillOn.length).toBe(1);
    expect(document.querySelectorAll(".range-badge").length).toBeGreaterThan(0);
  });

  it("shows affiliate markup exactly when a programme is configured", () => {
    // Stated as an equivalence rather than pinned to today's config, so it holds
    // whether programmes are live or not. An empty "where to buy" heading, or a
    // commission disclosure for links that do not exist, would both be wrong.
    at("/paint/citadel/mephiston-red");
    expect(document.querySelector(".buy-block") !== null).toBe(AFFILIATES_ENABLED);
    expect(screen.queryByText(/where to buy/i) !== null).toBe(AFFILIATES_ENABLED);
    // queryAll, not query: the commission wording is deliberately in two places
    // — beside the links and in the footer — and the singular query throws on
    // multiple matches. Matched on wording unique to the affiliate note, since a
    // looser /affiliate/i also hits the GW disclaimer's "not affiliated with".
    expect(screen.queryAllByText(/may earn a commission/i).length > 0).toBe(AFFILIATES_ENABLED);
    expect(screen.queryByText(/not affiliated with/i), "GW disclaimer must remain").toBeTruthy();
  });

  it("puts several shops behind one menu, keeping them real links", () => {
    at("/paint/citadel/mephiston-red");
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".buy-block a.buy-link")];
    const menu = document.querySelector("details.buy-menu");

    // A menu only when there is a choice to make.
    expect(menu !== null).toBe(links.length > 1);

    if (menu) {
      // Every shop lives inside the menu, and each stays an anchor rather than
      // an option routed through script — that is what preserves rel and keeps
      // middle-click and "open in new tab" working.
      expect(menu.querySelectorAll("a.buy-link").length).toBe(links.length);
      expect(menu.querySelector("summary")).toBeTruthy();
      expect(document.querySelector(".buy-block select")).toBeNull();
    }

    // The disclosures must not be hidden behind the toggle.
    const disclosure = document.querySelector(".buy-disclosure");
    expect(disclosure?.closest("details")).toBeNull();
    expect(document.querySelector(".buy-hint")?.closest("details")).toBeNull();
  });

  it("suggests an owned paint as a substitute, above the buy links", () => {
    // Gory Red is a curated equivalent of Mephiston Red, so owning it should
    // answer "can I paint this tonight" without buying anything.
    localStorage.setItem("paintxref_collection", JSON.stringify(["vallejo_gc::Gory Red (72.011)"]));
    at("/paint/citadel/mephiston-red");

    const block = document.querySelector(".sub-block");
    expect(block, "expected a From your paints block").toBeTruthy();
    expect(block!.textContent).toContain("Gory Red");
    // Flagged as a curated match rather than merely a near colour.
    expect(block!.querySelector(".sub-curated")).toBeTruthy();

    // The shelf comes before the shop.
    const buy = document.querySelector(".buy-block");
    if (buy) {
      expect(block!.compareDocumentPosition(buy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  it("says so plainly when nothing owned is close", () => {
    localStorage.setItem("paintxref_collection", JSON.stringify(["citadel::Averland Sunset"]));
    at("/paint/citadel/kantor-blue");
    const block = document.querySelector(".sub-block");
    expect(block).toBeTruthy();
    expect(block!.querySelector(".sub-empty")).toBeTruthy();
    // No suggestion cards, rather than a yellow offered for a dark blue.
    expect(block!.querySelectorAll(".card").length).toBe(0);
  });

  it("hides the substitute block with an empty collection or an owned paint", () => {
    at("/paint/citadel/mephiston-red");
    expect(document.querySelector(".sub-block"), "no collection, nothing to say").toBeNull();
    cleanup();

    localStorage.setItem("paintxref_collection", JSON.stringify(["citadel::Mephiston Red"]));
    at("/paint/citadel/mephiston-red");
    expect(document.querySelector(".sub-block"), "already owned, nothing to substitute").toBeNull();
  });

  it("offers the same choice of shops in the collection as on a paint page", () => {
    // The collection row used to link only to the first configured shop, with
    // no way to reach the others — the reported "still no dropdown".
    const paint = "citadel::Mephiston Red";
    localStorage.setItem("paintxref_collection", JSON.stringify([paint]));

    at("/paint/citadel/mephiston-red");
    const onPage = document.querySelectorAll(".buy-block a.buy-link").length;
    cleanup();

    at("/my-paints");
    const row = document.querySelector(".paint-row");
    expect(row, "the saved paint should be listed").toBeTruthy();
    expect(row!.querySelectorAll("a.buy-link").length).toBe(onPage);

    if (onPage > 1) {
      expect(row!.querySelector("details.buy-menu")).toBeTruthy();
      // A card that clips its children would hide the menu the moment it opens.
      expect(row!.closest(".card")?.classList.contains("card-open")).toBe(true);
    }
  });

  it("carries Amazon's prescribed disclosure verbatim wherever its links appear", () => {
    // Section 5 of the Associates Operating Agreement requires this exact
    // sentence, clearly and prominently. A paraphrase or a translation risks
    // the account, so it is asserted character-for-character.
    at("/paint/citadel/mephiston-red");
    const bodyText = document.body.textContent ?? "";
    expect(bodyText.includes(AMAZON_DISCLOSURE)).toBe(AMAZON_ENABLED);

    if (AMAZON_ENABLED) {
      // Beside the links and in the footer, not one or the other.
      expect(document.querySelector(".buy-disclosure")?.textContent).toContain(AMAZON_DISCLOSURE);
      expect(document.querySelector("footer")?.textContent).toContain(AMAZON_DISCLOSURE);
      // Amazon tags are marketplace-specific; a European tag is "-21".
      for (const a of document.querySelectorAll<HTMLAnchorElement>("a.buy-link")) {
        if (!a.href.includes("amazon.")) continue;
        expect(new URL(a.href).searchParams.get("tag")).toBeTruthy();
      }
    }
  });

  it("marks every outbound shop link sponsored and safe, whenever one exists", () => {
    // Google treats unmarked affiliate links as a link scheme, which would
    // undercut the whole point of the paint pages. target=_blank also needs
    // noopener. This holds vacuously today and starts biting the moment an ID
    // is filled in.
    at("/paint/citadel/mephiston-red");
    // Keeps the assertions below from passing vacuously: with a programme
    // configured there must actually be links on a paint page to check.
    const onPaintPage = document.querySelectorAll("a.buy-link").length;
    expect(onPaintPage > 0).toBe(AFFILIATES_ENABLED);
    cleanup();

    for (const url of ["/paint/citadel/mephiston-red", "/my-paints"]) {
      at(url);
      for (const a of document.querySelectorAll<HTMLAnchorElement>("a.buy-link, a.row-buy")) {
        const rel = (a.getAttribute("rel") ?? "").split(/\s+/);
        expect(rel, `${a.href} missing rel=sponsored`).toContain("sponsored");
        expect(rel).toContain("nofollow");
        expect(rel).toContain("noopener");
        expect(a.getAttribute("target")).toBe("_blank");
        expect(a.getAttribute("href")?.startsWith("https://")).toBe(true);
      }
      cleanup();
    }
  });

  it("navigates to a paint's URL when it is picked from search results", () => {
    at("/colours?q=mephiston");
    const suggestion = screen.getAllByTitle("Mephiston Red")[0];
    fireEvent.click(suggestion.closest(".paint-row") ?? suggestion);
    expect(document.title).toContain("Mephiston Red");
  });
});
