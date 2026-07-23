import { useState, useMemo, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Search, Palette, Layers, Store as StoreIcon, Plus, Check, Download, Upload,
  Trash2, MapPin, Phone, Clock, Globe, ChevronDown, Shuffle, BadgeCheck,
  Navigation, Sparkles, ArrowRight, Droplets,
} from "lucide-react";
import { PAINT_GROUPS } from "./data/paints";
import { BRANDS, BRAND_IDS } from "./data/brands";
import { STORES, DAY_ORDER, DAY_LABEL } from "./data/stores";
import { Paint, Store, DayKey } from "./data/types";
import { colorDistance, luminance, matchLabel, matchBg, matchFg } from "./utils/colors";
import { loadCollection, saveCollection, exportCollection, importCollection } from "./utils/storage";
import FallenIcon from "./FallenIcon";

const pid = (p: Paint) => `${p.brand}::${p.name}`;
const JS_DAY: DayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayKey = (): DayKey => JS_DAY[new Date().getDay()];

// Clean futuristic map marker — glowing node
const makeIcon = (color: string, active: boolean) =>
  L.divIcon({
    className: "",
    html: `<div class="map-pin ${active ? "active" : ""}" style="--pc:${color}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });

// Pans/zooms the map toward the active store
function MapController({ store }: { store: Store | null }) {
  const map = useMap();
  useEffect(() => {
    if (store) map.flyTo([store.lat, store.lng], Math.max(map.getZoom(), 14), { duration: 0.7 });
  }, [store, map]);
  return null;
}

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
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [activeStore, setActiveStore] = useState<number | null>(null);
  const [featSeed, setFeatSeed] = useState(() => Math.floor(Math.random() * 1e9));

  useEffect(() => { saveCollection(collection); }, [collection]);

  const toggleBrand = useCallback((b: string) => {
    setActiveBrands(p => { const n = new Set(p); if (n.has(b)) { if (n.size > 1) n.delete(b); } else n.add(b); return n; });
  }, []);

  const toggleOwned = useCallback((paint: Paint) => {
    setCollection(p => { const n = new Set(p); const id = pid(paint); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const isOwned = (p: Paint) => collection.has(pid(p));

  // ── Paint logic ──
  const allPaints = useMemo(() => PAINT_GROUPS.flatMap(g => g.paints), []);
  const allFlat = useMemo(() =>
    PAINT_GROUPS.flatMap((g, gi) => g.paints.filter(p => activeBrands.has(p.brand)).map(p => ({ ...p, groupIndex: gi, family: g.family })))
  , [activeBrands]);

  const suggestions = useMemo(() => {
    if (!query.trim() || mode !== "name") return [];
    const q = query.toLowerCase();
    return allFlat.filter(p => p.name.toLowerCase().includes(q) || (BRANDS[p.brand] || "").toLowerCase().includes(q)).slice(0, 15);
  }, [allFlat, query, mode]);

  const computeMatches = useCallback((paint: Paint) => {
    const gr = PAINT_GROUPS.find(g => g.paints.some(p => pid(p) === pid(paint)));
    const eq = gr ? gr.paints.filter(p => pid(p) !== pid(paint) && activeBrands.has(p.brand)) : [];
    const ids = new Set([pid(paint), ...eq.map(pid)]);
    const nb = allFlat.filter(p => !ids.has(pid(p))).map(p => ({ ...p, distance: colorDistance(paint.hex, p.hex) })).sort((a, b) => a.distance - b.distance).slice(0, 20);
    return { eq, nb };
  }, [allFlat, activeBrands]);

  const nameResults = useMemo(() => selPaint ? computeMatches(selPaint) : { eq: [], nb: [] }, [selPaint, computeMatches]);

  const hexResults = useMemo(() => {
    if (mode !== "hex" || hexVal.length < 7) return [];
    return allFlat.map(p => ({ ...p, distance: colorDistance(hexVal, p.hex) })).sort((a, b) => a.distance - b.distance).slice(0, 30);
  }, [allFlat, hexVal, mode]);

  // ── Landing data ──
  const families = useMemo(() => {
    const seen = new Set<string>(); const out: { family: string; hex: string }[] = [];
    PAINT_GROUPS.forEach(g => {
      if (!seen.has(g.family)) {
        seen.add(g.family);
        const rep = g.paints.find(p => p.brand === "citadel") || g.paints[0];
        out.push({ family: g.family, hex: rep.hex });
      }
    });
    return out;
  }, []);

  const featured = useMemo(() => allPaints[featSeed % allPaints.length], [featSeed, allPaints]);
  const featuredMatches = useMemo(() => {
    const { eq, nb } = computeMatches(featured);
    return [...eq, ...nb].slice(0, 3);
  }, [featured, computeMatches]);

  const selectPaint = (p: Paint) => { setMode("name"); setSelPaint(p); setQuery(p.name); };

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
  const countries = useMemo(() => Array.from(new Set(STORES.map(s => s.country))).sort(), []);
  const storeResults = useMemo(() => {
    let res = STORES;
    if (storeQ.trim()) {
      const q = storeQ.toLowerCase().trim();
      res = res.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.postal.toLowerCase().replace(/\s/g, "").includes(q.replace(/\s/g, ""))
      );
    }
    if (countryFilter) res = res.filter(s => s.country === countryFilter);
    return res;
  }, [storeQ, countryFilter]);

  const activeStoreObj = useMemo(() => STORES.find(s => s.id === activeStore) || null, [activeStore]);

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
          {isOwned(paint) ? <Check size={16} /> : <Plus size={16} />}
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

  const NAV = [
    { id: "match" as const, Icon: Palette, label: "Colours", badge: null as number | null },
    { id: "collection" as const, Icon: Layers, label: "My Paints", badge: collection.size || null },
    { id: "stores" as const, Icon: StoreIcon, label: "Stores", badge: null as number | null },
  ];

  return (
    <div className="app">
      {/* ═══ HEADER ═══ */}
      <header className="site-header">
        <div className="brand">
          <FallenIcon size={44} />
          <h1 className="wordmark">Fallen&nbsp;Palette</h1>
        </div>
        <p className="tagline">Miniature paint cross-reference · collection · store finder</p>
        <nav className="nav">
          {NAV.map(t => (
            <button key={t.id} className={`nav-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <t.Icon size={17} />
              <span>{t.label}</span>
              {t.badge ? <span className="nav-badge">{t.badge}</span> : null}
            </button>
          ))}
        </nav>
      </header>

      <div className="app-content">
        {/* ═══════════ COLOUR MATCH ═══════════ */}
        {tab === "match" && (<div className="view">
          <div className="mode-row">
            <button className={`mode-btn ${mode === "name" ? "active" : ""}`} onClick={() => { setMode("name"); setSelPaint(null); }}><Search size={14} /> By name</button>
            <button className={`mode-btn ${mode === "hex" ? "active" : ""}`} onClick={() => { setMode("hex"); setSelPaint(null); setQuery(""); }}><Droplets size={14} /> By colour</button>
          </div>

          {mode === "name" && (<>
            <div className="search-wrap">
              <Search size={17} className="search-icon" />
              <input className="search-input" placeholder='Type a paint name, e.g. "Mephiston Red"…' value={query} onChange={e => { setQuery(e.target.value); setSelPaint(null); }} />
            </div>
            <BrandChips />

            {!selPaint && query.trim() && suggestions.length > 0 && (
              <div className="card suggestions">
                <div className="suggest-label">Select a paint</div>
                {suggestions.map((p, i) => <PaintRow key={i} paint={p} showOwn={false} onClick={() => selectPaint(p)} />)}
              </div>
            )}
            {!selPaint && query.trim() && suggestions.length === 0 && <div className="hint">No paints match “{query}”</div>}

            {selPaint && (<>
              <div className="card-hero">
                <div className="card-hero-inner">
                  <Swatch hex={selPaint.hex} size={48} className="swatch-lg" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="hero-name">{selPaint.name}</div>
                    <div className="hero-meta">{BRANDS[selPaint.brand]} · {selPaint.type} · {selPaint.hex}</div>
                  </div>
                  <button className={`own-btn ${isOwned(selPaint) ? "owned" : ""}`} onClick={() => toggleOwned(selPaint)} title={isOwned(selPaint) ? "Remove from my paints" : "Add to my paints"}>
                    {isOwned(selPaint) ? <Check size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>
              {nameResults.eq.length > 0 && (<>
                <div className="section-label">Direct equivalents</div>
                <div className="results-grid">
                  {nameResults.eq.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={colorDistance(selPaint.hex, p.hex)} />} /></div>)}
                </div>
              </>)}
              {nameResults.nb.length > 0 && (<>
                <div className="section-label">Similar colours</div>
                <div className="results-grid">
                  {nameResults.nb.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={(p as any).distance} />} /></div>)}
                </div>
              </>)}
            </>)}

            {/* ─── DYNAMIC LANDING ─── */}
            {!selPaint && !query.trim() && (
              <div className="landing">
                <div className="stats-band">
                  <div className="stat-pill"><Droplets size={18} /><div><b>{allPaints.length}</b><span>paints</span></div></div>
                  <div className="stat-pill"><Palette size={18} /><div><b>{BRAND_IDS.length}</b><span>brands</span></div></div>
                  <div className="stat-pill"><StoreIcon size={18} /><div><b>{STORES.length}</b><span>stores</span></div></div>
                </div>

                <div className="section-head">
                  <div className="section-label"><Sparkles size={14} /> Featured cross-reference</div>
                  <button className="ghost-btn" onClick={() => setFeatSeed(Math.floor(Math.random() * 1e9))}><Shuffle size={13} /> Shuffle</button>
                </div>
                <div className="feature-card" onClick={() => selectPaint(featured)}>
                  <div className="feature-top">
                    <Swatch hex={featured.hex} size={52} className="swatch-lg" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hero-name">{featured.name}</div>
                      <div className="hero-meta">{BRANDS[featured.brand]} · {featured.type}</div>
                    </div>
                    <ArrowRight size={18} className="feature-arrow" />
                  </div>
                  {featuredMatches.length > 0 && (
                    <div className="feature-matches">
                      {featuredMatches.map((p, i) => (
                        <div key={i} className="feature-match">
                          <Swatch hex={p.hex} size={20} />
                          <span className="fm-name">{p.name}</span>
                          <span className="fm-brand">{BRANDS[p.brand]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-label"><Palette size={14} /> Browse by colour family</div>
                <div className="family-grid">
                  {families.map(f => {
                    const rep = (PAINT_GROUPS.find(g => g.family === f.family)?.paints.find(p => activeBrands.has(p.brand))) || null;
                    return (
                      <button key={f.family} className="family-tile" onClick={() => rep && selectPaint(rep)} title={f.family}>
                        <span className="family-swatch" style={{ background: f.hex }} />
                        <span className="family-name">{f.family}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="section-label">How it works</div>
                <div className="how-grid">
                  {[
                    { Icon: Search, t: "Search", d: "Find any paint by name or pick a colour." },
                    { Icon: Palette, t: "Compare", d: "See equivalents across every brand." },
                    { Icon: Layers, t: "Save", d: "Track what you own in your rack." },
                  ].map((s, i) => (
                    <div key={i} className="how-card"><span className="how-icon"><s.Icon size={18} /></span><div className="how-title">{s.t}</div><div className="how-desc">{s.d}</div></div>
                  ))}
                </div>
              </div>
            )}
          </>)}

          {mode === "hex" && (<>
            <div className="hex-picker">
              <input type="color" value={hexVal} onChange={e => setHexVal(e.target.value)} />
              <div style={{ flex: 1 }}>
                <div className="hex-label">Pick a colour or enter hex</div>
                <input className="hex-input" value={hexVal} maxLength={7} onChange={e => { let v = e.target.value; if (!v.startsWith("#")) v = "#" + v; if (v.length <= 7) setHexVal(v); }} />
              </div>
              <Swatch hex={hexVal} size={54} className="hex-preview swatch-lg" />
            </div>
            <BrandChips />
            <div className="count">Top 30 closest matches</div>
            <div className="results-grid">
              {hexResults.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={(p as any).distance} />} /></div>)}
            </div>
          </>)}
        </div>)}

        {/* ═══════════ COLLECTION ═══════════ */}
        {tab === "collection" && (<div className="view">
          {collection.size === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Layers size={40} /></div>
              <div className="empty-title">Your paint rack is empty</div>
              <div className="empty-body">
                Search for a paint in <b>Colours</b>, then hit the <span className="inline-plus"><Plus size={13} /></span> button on any result to save it here.
              </div>
              <button className="cta-btn" onClick={() => setTab("match")}>Browse paints <ArrowRight size={15} /></button>
              <div className="save-note">💾 Your collection is saved locally on this device. Clearing browser data will remove it.</div>
            </div>
          ) : (<>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-num">{collection.size}</div><div className="stat-label">Total</div></div>
              {Object.entries(collStats).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([brand, count]) => (
                <div key={brand} className="stat-card"><div className="stat-num">{count}</div><div className="stat-label">{(BRANDS[brand] || brand).split(" ")[0]}</div></div>
              ))}
            </div>
            <div className="search-wrap">
              <Search size={17} className="search-icon" />
              <input className="search-input" placeholder="Filter your collection…" value={collFilter} onChange={e => setCollFilter(e.target.value)} />
            </div>
            <div className="coll-actions">
              <span className="count" style={{ padding: 0 }}>{collPaints.length} paint{collPaints.length !== 1 ? "s" : ""}</span>
              <div className="coll-buttons">
                <button className="text-btn" onClick={() => exportCollection(collection)} title="Download your collection as a JSON file"><Download size={13} /> Export</button>
                <label className="text-btn" title="Restore collection from a backup file">
                  <Upload size={13} /> Import
                  <input type="file" accept="application/json,.json" style={{ display: "none" }} onChange={async e => {
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
                  }} />
                </label>
                <button className="text-btn danger" onClick={() => { if (confirm("Clear all paints from your collection?")) setCollection(new Set()); }}><Trash2 size={13} /> Clear</button>
              </div>
            </div>
            <div className="results-grid">
              {collPaints.map((p, i) => <div key={i} className="card"><PaintRow paint={p} /></div>)}
            </div>
          </>)}
        </div>)}

        {/* ═══════════ STORES ═══════════ */}
        {tab === "stores" && (<div className="view">
          <div className="search-wrap">
            <Search size={17} className="search-icon" />
            <input className="search-input" placeholder="Search by city, postal code, or store name…" value={storeQ} onChange={e => { setStoreQ(e.target.value); }} />
          </div>
          <div className="chips">
            <button className={`chip ${!countryFilter ? "active" : ""}`} onClick={() => setCountryFilter(null)}>All</button>
            {countries.map(c => <button key={c} className={`chip ${countryFilter === c ? "active" : ""}`} onClick={() => setCountryFilter(countryFilter === c ? null : c)}>{c}</button>)}
          </div>
          <div className="count">{storeResults.length} store{storeResults.length !== 1 ? "s" : ""}</div>

          <div className="store-layout">
            <div className="store-list">
              {storeResults.length === 0 ? <div className="hint">No stores match your search.</div> :
                storeResults.map(s => {
                  const open = activeStore === s.id;
                  const th = s.hours[todayKey()];
                  return (
                    <div key={s.id} className={`store-card ${open ? "open" : ""}`} style={open ? { borderColor: s.color } : {}}>
                      <div className="store-head" onClick={() => setActiveStore(open ? null : s.id)}>
                        <span className="store-dot" style={{ background: s.color }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="store-name">{s.name}{s.verified && <BadgeCheck size={14} className="store-verified" />}</div>
                          <div className="store-addr">{s.address} · {s.city}</div>
                        </div>
                        <div className="store-today">
                          <span className={th === "Closed" ? "closed" : "openhrs"}>{th === "Closed" ? "Closed today" : th}</span>
                        </div>
                        <ChevronDown size={16} className="store-chev" />
                      </div>
                      {open && (
                        <div className="store-detail">
                          <a className="detail-row" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name + " " + s.address + " " + s.city)}`} target="_blank" rel="noreferrer">
                            <MapPin size={15} /><span>{s.address}, {s.postal} · {s.city}, {s.country}</span>
                          </a>
                          {s.phone && <a className="detail-row" href={`tel:${s.phone.replace(/\s/g, "")}`}><Phone size={15} /><span>{s.phone}</span></a>}
                          {s.website && <a className="detail-row" href={s.website} target="_blank" rel="noreferrer"><Globe size={15} /><span>{s.website.replace(/^https?:\/\//, "")}</span></a>}
                          <div className="detail-row hours-head"><Clock size={15} /><span>Opening hours</span></div>
                          <div className="hours-table">
                            {DAY_ORDER.map(d => (
                              <div key={d} className={`hours-line ${d === todayKey() ? "today" : ""}`}>
                                <span>{DAY_LABEL[d]}</span>
                                <span className={s.hours[d] === "Closed" ? "closed" : ""}>{s.hours[d]}</span>
                              </div>
                            ))}
                          </div>
                          <a className="directions-btn" href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`} target="_blank" rel="noreferrer"><Navigation size={14} /> Directions</a>
                        </div>
                      )}
                    </div>
                  );
                })
              }
            </div>

            {storeResults.length > 0 && (
              <div className="map-container">
                <MapContainer
                  key={storeResults.map(s => s.id).join(",")}
                  bounds={storeResults.map(s => [s.lat, s.lng] as [number, number])}
                  boundsOptions={{ padding: [50, 50], maxZoom: 13 }}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    attribution='&copy; OpenStreetMap &copy; CARTO'
                  />
                  <MapController store={activeStoreObj} />
                  {storeResults.map(s => (
                    <Marker key={s.id} position={[s.lat, s.lng]} icon={makeIcon(s.color, activeStore === s.id)}
                      eventHandlers={{ click: () => setActiveStore(s.id) }}>
                      <Popup><b>{s.name}</b><br />{s.city}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        </div>)}

        <footer className="footer"><FallenIcon size={16} /> Fallen Palette · Data is approximate — always test swatches</footer>
      </div>
    </div>
  );
}
