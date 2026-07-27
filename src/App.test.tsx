// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import App from "./App";

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

// Node does not expose a bare localStorage global here. The app already guards
// every access, so just clear it when the environment happens to provide one.
beforeEach(() => { try { window.localStorage?.clear(); } catch {} });
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

  it("offers the index from the footer on every page", () => {
    for (const url of ["/", "/colours", "/stores", "/paint/citadel/mephiston-red"]) {
      at(url);
      expect(
        document.querySelector('footer a[href="/paints"]'),
        `no footer link to the index at ${url}`,
      ).toBeTruthy();
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
