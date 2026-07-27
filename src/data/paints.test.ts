import { describe, it, expect } from "vitest";
import { PAINT_GROUPS, ALL_PAINTS, equivalentsOf, paintId } from "./paints";
import { BRANDS } from "./brands";

const rawEntries = PAINT_GROUPS.flatMap(g => g.paints);

describe("catalog shape", () => {
  it("has groups, and every group has paints", () => {
    expect(PAINT_GROUPS.length).toBeGreaterThan(100);
    for (const g of PAINT_GROUPS) {
      expect(g.family).toBeTruthy();
      expect(g.paints.length).toBeGreaterThan(0);
    }
  });

  it("uses only known brands", () => {
    for (const p of rawEntries) {
      expect(BRANDS[p.brand], `unknown brand "${p.brand}" on "${p.name}"`).toBeTruthy();
    }
  });

  it("has a well-formed 6-digit hex on every paint", () => {
    for (const p of rawEntries) {
      expect(p.hex, `bad hex on ${p.brand} "${p.name}"`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("has a non-empty name and range on every paint", () => {
    for (const p of rawEntries) {
      expect(p.name.trim()).toBeTruthy();
      expect(p.type.trim()).toBeTruthy();
    }
  });
});

describe("paint identity", () => {
  it("ALL_PAINTS contains each paint exactly once", () => {
    const ids = ALL_PAINTS.map(paintId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ALL_PAINTS covers every paint in the groups", () => {
    expect(new Set(ALL_PAINTS.map(paintId))).toEqual(new Set(rawEntries.map(paintId)));
  });

  it("never records one paint with two different hex values", () => {
    // Regression guard. Seven paints used to carry a different colour in each
    // group they appeared in, so the same paint rendered two different
    // swatches with two different match badges in one result list.
    const hexes = new Map<string, Set<string>>();
    for (const p of rawEntries) {
      const id = paintId(p);
      if (!hexes.has(id)) hexes.set(id, new Set());
      hexes.get(id)!.add(p.hex.toLowerCase());
    }
    const conflicts = [...hexes.entries()].filter(([, s]) => s.size > 1);
    expect(conflicts.map(([id, s]) => `${id}: ${[...s].join(" vs ")}`)).toEqual([]);
  });

  it("never records one product code under two different names", () => {
    // Vallejo 72.034 was present as both "Bone White" and "Bonewhite" with
    // different hexes, i.e. one physical paint stored as two paints.
    const byCode = new Map<string, Set<string>>();
    for (const p of ALL_PAINTS) {
      const code = p.name.match(/\(([^)]+)\)\s*$/)?.[1];
      if (!code) continue;
      const k = `${p.brand}|${code}`;
      if (!byCode.has(k)) byCode.set(k, new Set());
      byCode.get(k)!.add(p.name);
    }
    const dups = [...byCode.entries()].filter(([, s]) => s.size > 1);
    expect(dups.map(([k, s]) => `${k}: ${[...s].join(" / ")}`)).toEqual([]);
  });
});

describe("equivalentsOf", () => {
  it("never returns the paint itself", () => {
    for (const p of ALL_PAINTS) {
      expect(equivalentsOf(p).some(e => paintId(e) === paintId(p)), `${paintId(p)} lists itself`).toBe(false);
    }
  });

  it("never returns duplicates", () => {
    for (const p of ALL_PAINTS) {
      const ids = equivalentsOf(p).map(paintId);
      expect(new Set(ids).size, `duplicate equivalents for ${paintId(p)}`).toBe(ids.length);
    }
  });

  it("is symmetric", () => {
    // If A is offered as an equivalent of B, B must be offered for A.
    for (const p of ALL_PAINTS) {
      for (const e of equivalentsOf(p)) {
        expect(
          equivalentsOf(e).some(x => paintId(x) === paintId(p)),
          `${paintId(p)} -> ${paintId(e)} but not back`,
        ).toBe(true);
      }
    }
  });

  it("unions across every group a paint belongs to", () => {
    // Previously the lookup took the first matching group only, silently
    // hiding the rest. Citadel Ushabti Bone sits in a White group and a Bone
    // group and showed only the White partners.
    const multiGroup = ALL_PAINTS.filter(p =>
      PAINT_GROUPS.filter(g => g.paints.some(q => paintId(q) === paintId(p))).length > 1);

    expect(multiGroup.length).toBeGreaterThan(0);

    for (const p of multiGroup) {
      const first = PAINT_GROUPS.find(g => g.paints.some(q => paintId(q) === paintId(p)))!;
      const firstOnly = first.paints.filter(q => paintId(q) !== paintId(p)).length;
      expect(
        equivalentsOf(p).length,
        `${paintId(p)} should see more than its first group's ${firstOnly}`,
      ).toBeGreaterThan(firstOnly);
    }
  });

  it("returns equivalents from other brands", () => {
    // The whole point is cross-brand substitution; a group of one brand only
    // would make the feature useless.
    const withCrossBrand = ALL_PAINTS.filter(p =>
      equivalentsOf(p).some(e => e.brand !== p.brand));
    expect(withCrossBrand.length / ALL_PAINTS.length).toBeGreaterThan(0.5);
  });
});
