import { useState, useMemo, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { PAINT_GROUPS } from "./data/paints";
import { BRANDS, BRAND_IDS } from "./data/brands";
import { STORES, GAME_SYSTEMS } from "./data/stores";
import { Paint, Store } from "./data/types";
import { colorDistance, luminance, matchLabel, matchBg, matchFg } from "./utils/colors";
import { loadCollection, saveCollection, exportCollection, importCollection } from "./utils/storage";

const pid = (p: Paint) => `${p.brand}::${p.name}`;

// Custom map marker
const makeIcon = (color: string, emoji: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:32px;height:32px;border-radius:8px;background:${color};display:flex;align-items:center;justify-content:center;font-size:15px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4)">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

export default function App() {
  const [tab, setTab] = useState<"match" | "collection" | "stores">("match");
  const [activeBrands, setActiveBrands] = useState<Set<string>>(new Set(BRAND_IDS));
  const [mode, setMode] = useState<"name" | "hex">("name");
  const [query, setQuery] = useState("");
  const [hexVal, setHexVal] = useState("#9a1115");
  const [selPaint, setSelPaint] = useState<Paint | null>(null);
  const [collection, setCollection] = useState<Set<string>>(loadCollection);
  const [collFilter, setCollFilter] = useState("");
  const [storeQ, setStoreQ] = useState("");
  const [gameFilter, setGameFilter] = useState<string | null>(null);
  const [storeDetail, setStoreDetail] = useState<Store | null>(null);
  const [hlStore, setHlStore] = useState<number | null>(null);

  useEffect(() => { saveCollection(collection); }, [collection]);

  const toggleBrand = useCallback((b: string) => {
    setActiveBrands(p => { const n = new Set(p); if (n.has(b)) { if (n.size > 1) n.delete(b); } else n.add(b); return n; });
  }, []);

  const toggleOwned = useCallback((paint: Paint) => {
    setCollection(p => { const n = new Set(p); const id = pid(paint); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const isOwned = (p: Paint) => collection.has(pid(p));

  // ── Paint logic ──
  const allFlat = useMemo(() =>
    PAINT_GROUPS.flatMap((g, gi) => g.paints.filter(p => activeBrands.has(p.brand)).map(p => ({ ...p, groupIndex: gi, family: g.family })))
  , [activeBrands]);

  const suggestions = useMemo(() => {
    if (!query.trim() || mode !== "name") return [];
    const q = query.toLowerCase();
    return allFlat.filter(p => p.name.toLowerCase().includes(q) || (BRANDS[p.brand] || "").toLowerCase().includes(q)).slice(0, 15);
  }, [allFlat, query, mode]);

  const nameResults = useMemo(() => {
    if (!selPaint) return { eq: [], nb: [] };
    const gr = PAINT_GROUPS.find(g => g.paints.some(p => pid(p) === pid(selPaint)));
    const eq = gr ? gr.paints.filter(p => pid(p) !== pid(selPaint) && activeBrands.has(p.brand)) : [];
    const ids = new Set([pid(selPaint), ...eq.map(pid)]);
    const nb = allFlat.filter(p => !ids.has(pid(p))).map(p => ({ ...p, distance: colorDistance(selPaint.hex, p.hex) })).sort((a, b) => a.distance - b.distance).slice(0, 20);
    return { eq, nb };
  }, [selPaint, allFlat, activeBrands]);

  const hexResults = useMemo(() => {
    if (mode !== "hex" || hexVal.length < 7) return [];
    return allFlat.map(p => ({ ...p, distance: colorDistance(hexVal, p.hex) })).sort((a, b) => a.distance - b.distance).slice(0, 30);
  }, [allFlat, hexVal, mode]);

  // ── Collection logic ──
  const collPaints = useMemo(() => {
    const all = PAINT_GROUPS.flatMap(g => g.paints.filter(p => collection.has(pid(p))));
    if (!collFilter.trim()) return all;
    const q = collFilter.toLowerCase();
    return all.filter(p => p.name.toLowerCase().includes(q) || (BRANDS[p.brand] || "").toLowerCase().includes(q));
  }, [collection, collFilter]);

  const collStats = useMemo(() => {
    const byBrand: Record<string, number> = {};
    PAINT_GROUPS.flatMap(g => g.paints).filter(p => collection.has(pid(p))).forEach(p => {
      byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
    });
    return byBrand;
  }, [collection]);

  // ── Store logic ──
  const hasStoreSearch = storeQ.trim().length > 0 || gameFilter !== null;
  const storeResults = useMemo(() => {
    let res = STORES;
    if (storeQ.trim()) {
      const q = storeQ.toLowerCase().trim();
      res = res.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        // Postal code: match full or partial (first 2-5 digits)
        s.postal.toLowerCase().replace(/\s/g, "").includes(q.replace(/\s/g, ""))
      );
    }
    if (gameFilter) res = res.filter(s => s.games.includes(gameFilter));
    return res;
  }, [storeQ, gameFilter]);

  // ── Shared components ──
  const Swatch = ({ hex, size = 28, className = "" }: { hex: string; size?: number; className?: string }) => (
    <div className={`swatch ${className}`} style={{ width: size, height: size, background: hex, border: luminance(hex) > 0.85 ? "1px solid #3A3D42" : "1px solid transparent" }} />
  );

  const MatchBadge = ({ d }: { d: number }) => (
    <span className="match-badge" style={{ background: matchBg(d), color: matchFg(d) }}>{matchLabel(d)}</span>
  );

  const PaintRow = ({ paint, showOwn = true, extra, onClick }: { paint: Paint; showOwn?: boolean; extra?: React.ReactNode; onClick?: () => void }) => (
    <div className={`paint-row ${onClick ? "clickable" : ""}`} onClick={onClick}>
      <Swatch hex={paint.hex} />
      <div className="paint-info">
        <div className="paint-name">{paint.name}</div>
        <div className="paint-meta">{BRANDS[paint.brand]} · {paint.type}</div>
      </div>
      {extra}
      <span className="brand-badge">{BRANDS[paint.brand]}</span>
      {showOwn && (
        <button
          className={`own-btn ${isOwned(paint) ? "owned" : ""}`}
          onClick={e => { e.stopPropagation(); toggleOwned(paint); }}
          title={isOwned(paint) ? "Remove from my paints" : "Add to my paints"}
          aria-label={isOwned(paint) ? "Remove from collection" : "Add to collection"}
        >
          {isOwned(paint) ? "✓" : "+"}
        </button>
      )}
    </div>
  );

  const BrandChips = () => (
    <div className="chips">
      {BRAND_IDS.map(id => (
        <button key={id} className={`chip ${activeBrands.has(id) ? "active" : ""}`} onClick={() => toggleBrand(id)}>{BRANDS[id]}</button>
      ))}
    </div>
  );

  // ── Store detail view ──
  if (storeDetail) {
    const s = storeDetail;
    return (
      <div className="app">
        <div className="app-content">
          <div style={{ padding: 16 }}>
            <button className="detail-back" onClick={() => setStoreDetail(null)}>← Back</button>
          </div>
          <div className="detail-header">
            <div className="store-icon" style={{ width: 46, height: 46, background: s.color, fontSize: 20 }}>{s.emoji}</div>
            <div>
              <div className="detail-name">{s.name}</div>
              <div className="detail-sub">{s.city}, {s.country}{s.verified ? " · ✓ Verified" : ""}</div>
            </div>
          </div>
          {[{ i: "📍", l: "Address", v: s.address }, { i: "📞", l: "Phone", v: s.phone }, { i: "🕐", l: "Hours", v: s.hours }, { i: "🎲", l: "Tables", v: `${s.tables} gaming table${s.tables !== 1 ? "s" : ""}` }].map((r, i) => (
            <div key={i} className="detail-info"><span className="detail-info-icon">{r.i}</span><div><div className="detail-info-label">{r.l}</div><div className="detail-info-value">{r.v}</div></div></div>
          ))}
          <div className="section-label">Game systems</div>
          <div className="tag-row">{s.games.map(g => <span key={g} className="tag-game">{g}</span>)}</div>
          <div className="section-label">Paint brands stocked</div>
          <div className="tag-row">{s.paintBrands.map(b => <span key={b} className="tag-paint">{b}</span>)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-logo">PX</div>
        <div>
          <div className="header-title">PaintXRef</div>
          <div className="header-sub">Paint conversion · Collection · Store finder</div>
        </div>
      </div>

      <div className="app-content">
        {/* ═══ COLOUR MATCH ═══ */}
        {tab === "match" && (<>
          <div className="mode-row">
            <button className={`mode-btn ${mode === "name" ? "active" : ""}`} onClick={() => { setMode("name"); setSelPaint(null); }}>Search by Name</button>
            <button className={`mode-btn ${mode === "hex" ? "active" : ""}`} onClick={() => { setMode("hex"); setSelPaint(null); setQuery(""); }}>Search by Colour</button>
          </div>

          {mode === "name" && (<>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder='Type a paint name, e.g. "Mephiston Red"...' value={query} onChange={e => { setQuery(e.target.value); setSelPaint(null); }} />
            </div>
            <BrandChips />

            {!selPaint && query.trim() && suggestions.length > 0 && (
              <div className="card">
                <div style={{ padding: "8px 14px 4px", fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>Select a paint</div>
                {suggestions.map((p, i) => <PaintRow key={i} paint={p} showOwn={false} onClick={() => { setSelPaint(p); setQuery(p.name); }} />)}
              </div>
            )}
            {!selPaint && query.trim() && suggestions.length === 0 && <div className="hint">No paints match "{query}"</div>}

            {selPaint && (<>
              <div className="card-hero">
                <div className="card-hero-inner">
                  <Swatch hex={selPaint.hex} size={44} className="swatch-lg" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--bright)" }}>{selPaint.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{BRANDS[selPaint.brand]} · {selPaint.type} · {selPaint.hex}</div>
                  </div>
                  <button
                    className={`own-btn ${isOwned(selPaint) ? "owned" : ""}`}
                    onClick={() => toggleOwned(selPaint)}
                    title={isOwned(selPaint) ? "Remove from my paints" : "Add to my paints"}
                  >
                    {isOwned(selPaint) ? "✓" : "+"}
                  </button>
                </div>
              </div>
              {nameResults.eq.length > 0 && (<>
                <div className="section-label">Direct equivalents</div>
                {nameResults.eq.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={colorDistance(selPaint.hex, p.hex)} />} /></div>)}
              </>)}
              {nameResults.nb.length > 0 && (<>
                <div className="section-label">Similar colours</div>
                {nameResults.nb.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={(p as any).distance} />} /></div>)}
              </>)}
            </>)}

            {!selPaint && !query.trim() && (
              <div className="empty">
                <div className="empty-icon">🔍</div>
                <div className="empty-body">Search for any paint by name to find its equivalents across all brands</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>{activeBrands.size} brands loaded</div>
              </div>
            )}
          </>)}

          {mode === "hex" && (<>
            <div className="hex-picker">
              <input type="color" value={hexVal} onChange={e => setHexVal(e.target.value)} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5 }}>Pick a colour or enter hex</div>
                <input className="hex-input" value={hexVal} maxLength={7} onChange={e => { let v = e.target.value; if (!v.startsWith("#")) v = "#" + v; if (v.length <= 7) setHexVal(v); }} />
              </div>
              <Swatch hex={hexVal} size={52} className="hex-preview swatch-lg" />
            </div>
            <BrandChips />
            <div className="count">Top 30 closest matches</div>
            {hexResults.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={(p as any).distance} />} /></div>)}
          </>)}
        </>)}

        {/* ═══ COLLECTION ═══ */}
        {tab === "collection" && (<>
          {collection.size === 0 ? (
            <div className="empty">
              <div className="empty-icon">🎨</div>
              <div className="empty-title">Your paint rack is empty</div>
              <div className="empty-body">
                Search for a paint in <b>Colours</b>, then tap the <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 5, background: "rgba(255,255,255,0.05)", color: "#4B5563", fontSize: 13, fontWeight: 600, verticalAlign: "middle", margin: "0 4px", border: "1px solid var(--border)" }}>+</span> button on any result to save it here.
              </div>
              <button
                onClick={() => setTab("match")}
                style={{
                  marginTop: 20,
                  padding: "10px 20px",
                  background: "var(--accent)",
                  color: "var(--bg)",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Browse paints →
              </button>
              <div style={{ marginTop: 24, padding: "12px 20px", background: "var(--card-alt)", borderRadius: 8, fontSize: 11, color: "var(--muted)", lineHeight: 1.5, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
                💾 Your collection is saved locally on this device.
                Clearing your browser data will remove it.
              </div>
            </div>
          ) : (<>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-num">{collection.size}</div><div className="stat-label">Total</div></div>
              {Object.entries(collStats).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([brand, count]) => (
                <div key={brand} className="stat-card"><div className="stat-num">{count}</div><div className="stat-label">{(BRANDS[brand] || brand).split(" ")[0]}</div></div>
              ))}
            </div>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Filter your collection..." value={collFilter} onChange={e => setCollFilter(e.target.value)} />
            </div>
            <div style={{ padding: "0 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="count" style={{ padding: 0 }}>{collPaints.length} paint{collPaints.length !== 1 ? "s" : ""}</span>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  style={{ fontSize: 11, color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => exportCollection(collection)}
                  title="Download your collection as a JSON file"
                >⤓ Export</button>
                <label style={{ fontSize: 11, color: "var(--muted)", cursor: "pointer" }} title="Restore collection from a backup file">
                  ⤒ Import
                  <input
                    type="file"
                    accept="application/json,.json"
                    style={{ display: "none" }}
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const imported = await importCollection(file);
                        if (confirm(`Import ${imported.size} paints? This will merge with your current collection.`)) {
                          setCollection(prev => new Set([...prev, ...imported]));
                        }
                      } catch (err) {
                        alert("Failed to import: " + (err instanceof Error ? err.message : "unknown error"));
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  style={{ fontSize: 11, color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => {
                    if (confirm("Clear all paints from your collection?")) setCollection(new Set());
                  }}
                >Clear all</button>
              </div>
            </div>
            {collPaints.map((p, i) => <div key={i} className="card"><PaintRow paint={p} /></div>)}
          </>)}
        </>)}

        {/* ═══ STORES ═══ */}
        {tab === "stores" && (<>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search by city, postal code, or store name..." value={storeQ} onChange={e => { setStoreQ(e.target.value); setHlStore(null); }} />
          </div>
          <div className="chips">
            <button className={`chip ${!gameFilter ? "active" : ""}`} onClick={() => setGameFilter(null)}>All</button>
            {GAME_SYSTEMS.map(g => <button key={g} className={`chip ${gameFilter === g ? "active" : ""}`} onClick={() => setGameFilter(gameFilter === g ? null : g)}>{g}</button>)}
          </div>
          <div className="count">{storeResults.length} store{storeResults.length !== 1 ? "s" : ""} found</div>

          <div className={`store-list ${hasStoreSearch && storeResults.length > 0 ? "with-map" : ""}`} style={hasStoreSearch ? { maxHeight: "calc(50vh - 140px)", overflowY: "auto" } : {}}>
            {storeResults.length === 0 ? <div className="hint">No stores match your search.</div> :
              storeResults.map(s => (
                <div key={s.id} className={`store-row ${hlStore === s.id ? "highlighted" : ""}`}
                  style={hlStore === s.id ? { borderLeftColor: s.color, background: s.color + "12" } : {}}
                  onClick={() => setHlStore(hlStore === s.id ? null : s.id)}
                  onDoubleClick={() => setStoreDetail(s)}>
                  <div className="store-icon" style={{ width: 30, height: 30, background: s.color, fontSize: 13 }}>{s.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="store-name">{s.name}{s.verified && <span className="store-verified">✓</span>}</div>
                    <div className="store-addr">{s.address}, {s.postal}</div>
                  </div>
                  <div className="store-meta">
                    <div className="store-tables">🎲 {s.tables}</div>
                    <div className="store-city">{s.city}</div>
                  </div>
                </div>
              ))
            }
          </div>

          {hasStoreSearch && storeResults.length > 0 && (
            <div className="map-container">
              <MapContainer
                key={storeResults.map(s => s.id).join(",")}
                bounds={storeResults.length > 0 ? storeResults.map(s => [s.lat, s.lng] as [number, number]) : undefined}
                boundsOptions={{ padding: [40, 40] }}
                center={storeResults.length === 1 ? [storeResults[0].lat, storeResults[0].lng] : [38, 23]}
                zoom={storeResults.length === 1 ? 14 : 6}
                scrollWheelZoom={true}
                style={{ height: "calc(100% - 28px)", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                {storeResults.map(s => (
                  <Marker key={s.id} position={[s.lat, s.lng]} icon={makeIcon(s.color, s.emoji)}
                    eventHandlers={{ click: () => setStoreDetail(s) }}>
                    <Popup><b>{s.name}</b><br />{s.city} · {s.tables} tables</Popup>
                  </Marker>
                ))}
              </MapContainer>
              <div className="map-hint">Tap a pin for details · {storeResults.length} location{storeResults.length !== 1 ? "s" : ""}</div>
            </div>
          )}

          {!hasStoreSearch && <div className="hint">Search by city or postal code to see stores on the map</div>}
        </>)}

        <div className="footer">PaintXRef · Data is approximate — always test swatches</div>
      </div>

      {/* Bottom tabs */}
      <div className="tabs">
        {([
          { id: "match" as const, icon: "🎯", label: "Colours" },
          { id: "collection" as const, icon: "🗂", label: `My Paints`, badge: collection.size || null },
          { id: "stores" as const, icon: "🏪", label: "Stores" },
        ]).map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)} style={{ position: "relative" }}>
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
            {t.badge ? <span className="tab-badge">{t.badge}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
