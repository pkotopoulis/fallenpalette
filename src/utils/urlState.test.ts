import { describe, it, expect } from "vitest";
import {
  TAB_PATH, DEFAULT_HEX, tabFromPath, isPaintsIndexPath,
  modeFromParams, hexFromParams, queryFromParams, searchPath, hexSearchPath, photoSearchPath,
} from "./urlState";

const params = (qs: string) => new URLSearchParams(qs);

describe("tabFromPath", () => {
  it("maps each tab's own path back to that tab", () => {
    for (const [tab, path] of Object.entries(TAB_PATH)) {
      expect(tabFromPath(path)).toBe(tab);
    }
  });

  it("treats the root and paint pages as the match tab", () => {
    expect(tabFromPath("/")).toBe("match");
    expect(tabFromPath("/paint/citadel/mephiston-red")).toBe("match");
    expect(tabFromPath("/paints")).toBe("match");
  });

  it("falls back to the match tab for anything unrecognised", () => {
    expect(tabFromPath("/nonsense")).toBe("match");
    expect(tabFromPath("")).toBe("match");
  });

  it("keeps query strings and trailing segments from confusing it", () => {
    expect(tabFromPath("/stores")).toBe("stores");
    expect(tabFromPath("/my-paints")).toBe("collection");
  });
});

describe("isPaintsIndexPath", () => {
  it("matches the index", () => {
    expect(isPaintsIndexPath("/paints")).toBe(true);
    expect(isPaintsIndexPath("/paints/")).toBe(true);
  });

  it("does not match an individual paint page", () => {
    // /paint/... and /paints differ by one character; a prefix test on
    // "/paint" would wrongly treat every paint page as the index.
    expect(isPaintsIndexPath("/paint/citadel/mephiston-red")).toBe(false);
    expect(isPaintsIndexPath("/paint")).toBe(false);
  });

  it("does not match other views", () => {
    for (const p of ["/", "/colours", "/my-paints", "/stores"]) {
      expect(isPaintsIndexPath(p)).toBe(false);
    }
  });
});

describe("mode and hex from the query string", () => {
  it("is name mode unless a hex is present", () => {
    expect(modeFromParams(params(""))).toBe("name");
    expect(modeFromParams(params("q=red"))).toBe("name");
    expect(modeFromParams(params("hex=9a1115"))).toBe("hex");
  });

  it("recognises photo mode, and prefers it over a leftover hex", () => {
    expect(modeFromParams(params("photo=1"))).toBe("photo");
    // A hex left in the URL must not override an explicit request for the picker.
    expect(modeFromParams(params("hex=9a1115&photo=1"))).toBe("photo");
    expect(photoSearchPath()).toBe("/colours?photo=1");
  });

  it("normalises a bare hex back to #rrggbb", () => {
    expect(hexFromParams(params("hex=9a1115"))).toBe("#9a1115");
    expect(hexFromParams(params("hex=%239a1115"))).toBe("#9a1115");
    expect(hexFromParams(params("hex=9A1115"))).toBe("#9a1115");
  });

  it("falls back to the default for a malformed hex rather than rendering nothing", () => {
    for (const bad of ["hex=", "hex=xyz", "hex=12345", "hex=1234567", "hex=zzzzzz"]) {
      expect(hexFromParams(params(bad))).toBe(DEFAULT_HEX);
    }
  });

  it("reads the search text, defaulting to empty", () => {
    expect(queryFromParams(params(""))).toBe("");
    expect(queryFromParams(params("q=mephiston"))).toBe("mephiston");
    expect(queryFromParams(params("q=bone%20white"))).toBe("bone white");
  });
});

describe("path builders", () => {
  it("encodes the search term", () => {
    expect(searchPath("bone white")).toBe("/colours?q=bone%20white");
    expect(searchPath("72.034")).toBe("/colours?q=72.034");
  });

  it("drops the parameter for an empty search", () => {
    expect(searchPath("")).toBe("/colours");
  });

  it("writes hex without the leading hash", () => {
    expect(hexSearchPath("#9a1115")).toBe("/colours?hex=9a1115");
    expect(hexSearchPath("9a1115")).toBe("/colours?hex=9a1115");
  });

  it("round-trips through the parsers", () => {
    for (const q of ["red", "bone white", "72.034", "Garaghak's Sewer"]) {
      const url = new URL(`https://x${searchPath(q)}`);
      expect(queryFromParams(url.searchParams)).toBe(q);
    }
    for (const hex of ["#9a1115", "#000000", "#ffffff"]) {
      const url = new URL(`https://x${hexSearchPath(hex)}`);
      expect(hexFromParams(url.searchParams)).toBe(hex);
      expect(modeFromParams(url.searchParams)).toBe("hex");
    }
  });
});
