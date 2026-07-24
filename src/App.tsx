import { useState, useMemo, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Search, Palette, Layers, Store as StoreIcon, Plus, Check, Download, Upload,
  Trash2, MapPin, Phone, Clock, Globe, ChevronDown, Shuffle, BadgeCheck,
  Navigation, Sparkles, ArrowRight, Droplets, Mail,
} from "lucide-react";
import { PAINT_GROUPS } from "./data/paints";
import { BRANDS, BRAND_IDS } from "./data/brands";
import { STORES, DAY_ORDER, DAY_LABEL } from "./data/stores";
import { Paint, Store, DayKey } from "./data/types";
import { colorDistance, luminance, matchLabel, matchBg, matchFg } from "./utils/colors";
import { loadCollection, saveCollection, exportCollection, importCollection } from "./utils/storage";
import { I18N, Lang } from "./i18n";
import FallenIcon from "./FallenIcon";

const pid = (p: Paint) => `${p.brand}::${p.name}`;

// Feedback destination — update the address once domain email is set up (see README).
const FEEDBACK_EMAIL = "feedback@fallenpalette.com";
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
    if (store && store.lat != null && store.lng != null) {
      map.flyTo([store.lat, store.lng], Math.max(map.getZoom(), 14), { duration: 0.7 });
    }
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
  const [lang, setLang] = useState<Lang>(() => {
    try { const s = localStorage.getItem("fp_lang"); if (s === "en" || s === "el") return s; } catch {}
    return (navigator.language || "").toLowerCase().startsWith("el") ? "el" : "en";
  });
  const t = I18N[lang];

  useEffect(() => { saveCollection(collection); }, [collection]);
  useEffect(() => {
    try { localStorage.setItem("fp_lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

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
  const mapStores = useMemo(() => storeResults.filter(s => s.lat != null && s.lng != null), [storeResults]);

  // Group results by country (Greece pinned first, then alphabetical)
  const groupedStores = useMemo(() => {
    const m = new Map<string, Store[]>();
    storeResults.forEach(s => { if (!m.has(s.country)) m.set(s.country, []); m.get(s.country)!.push(s); });
    const rank = (c: string) => (c === "Greece" ? 0 : 1);
    return [...m.entries()].sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]));
  }, [storeResults]);
  const showGroups = groupedStores.length > 1;

  // ── Shared components ──
  const Swatch = ({ hex, size = 28, className = "" }: { hex: string; size?: number; className?: string }) => (
    <div className={`swatch ${className}`} style={{ width: size, height: size, background: hex, border: luminance(hex) > 0.85 ? "1px solid #3A3D42" : "1px solid transparent" }} />
  );

  const MatchBadge = ({ d }: { d: number }) => (
    <span className="match-badge" style={{ background: matchBg(d), color: matchFg(d) }}>{d < 15 ? t.matchExact : d < 35 ? t.matchClose : t.matchApprox}</span>
  );

  const PaintRow = ({ paint, showOwn = true, extra, onClick }: { paint: Paint; showOwn?: boolean; extra?: React.ReactNode; onClick?: () => void }) => (
    <div className={`paint-row ${onClick ? "clickable" : ""}`} onClick={onClick}>
      <Swatch hex={paint.hex} />
      <div className="paint-info">
        <div className="paint-name" title={paint.name}>{paint.name}</div>
        <div className="paint-meta" title={`${BRANDS[paint.brand]} · ${paint.type}`}>{BRANDS[paint.brand]} · {paint.type}</div>
      </div>
      {extra}
      <span className="brand-badge">{BRANDS[paint.brand]}</span>
      {showOwn && (
        <button
          className={`own-btn ${isOwned(paint) ? "owned" : ""}`}
          onClick={e => { e.stopPropagation(); toggleOwned(paint); }}
          title={isOwned(paint) ? t.removePaint : t.addPaint}
          aria-label={isOwned(paint) ? t.removePaint : t.addPaint}
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
    { id: "match" as const, Icon: Palette, label: t.navMatch, badge: null as number | null },
    { id: "collection" as const, Icon: Layers, label: t.navCollection, badge: collection.size || null },
    { id: "stores" as const, Icon: StoreIcon, label: t.navStores, badge: null as number | null },
  ];

  // Collapsed-card summary: collapse split "11:00–13:00, 14:00–19:00" to "11:00–19:00"
  const summaryHours = (th: string) => {
    if (th === "Closed") return "Closed";
    if (th.includes(",")) {
      const parts = th.split(",").map(x => x.trim());
      const start = parts[0].split("–")[0];
      const end = parts[parts.length - 1].split("–")[1];
      if (start && end) return `${start}–${end}`;
    }
    return th;
  };

  const renderStore = (s: Store) => {
    const open = activeStore === s.id;
    const th = s.hours[todayKey()];
    const hasHours = DAY_ORDER.some(d => s.hours[d]);
    const hasCoords = s.lat != null && s.lng != null;
    return (
      <div key={s.id} className={`store-card ${open ? "open" : ""}`} style={open ? { borderColor: s.color } : {}}>
        <div className="store-head" onClick={() => setActiveStore(open ? null : s.id)}>
          <span className="store-dot" style={{ background: s.color }} />
          <div className="store-main">
            <div className="store-name-row">
              <span className="store-name" title={s.name}>{s.name}</span>
              {s.verified && <BadgeCheck size={14} className="store-verified" />}
            </div>
            <div className="store-addr" title={`${s.address}, ${s.city}`}>{s.address ? `${s.address} · ` : ""}{s.city}</div>
          </div>
          <div className="store-right">
            <span className={th === "Closed" ? "closed" : th ? "openhrs" : "noinfo"}>{th === "Closed" ? t.closed : th ? summaryHours(th) : "—"}</span>
            <ChevronDown size={16} className="store-chev" />
          </div>
        </div>
        {open && (
          <div className="store-detail">
            <a className="detail-row" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name + " " + s.address + " " + s.city)}`} target="_blank" rel="noreferrer">
              <MapPin size={15} /><span>{[s.address, s.postal].filter(Boolean).join(", ")}{s.address || s.postal ? " · " : ""}{s.city}, {t.countries[s.country] || s.country}</span>
            </a>
            {s.phone && <a className="detail-row" href={`tel:${s.phone.replace(/\s/g, "")}`}><Phone size={15} /><span>{s.phone}</span></a>}
            {s.website && <a className="detail-row" href={s.website} target="_blank" rel="noreferrer"><Globe size={15} /><span>{s.website.replace(/^https?:\/\//, "")}</span></a>}
            <div className="detail-row hours-head"><Clock size={15} /><span>{t.openingHours}</span></div>
            {hasHours ? (
              <div className="hours-table">
                {DAY_ORDER.map(d => (
                  <div key={d} className={`hours-line ${d === todayKey() ? "today" : ""}`}>
                    <span>{t.days[d]}</span>
                    <span className={s.hours[d] === "Closed" ? "closed" : s.hours[d] ? "" : "noinfo"}>{s.hours[d] === "Closed" ? t.closed : (s.hours[d] || "—")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="hours-empty">{t.hoursNotListed}</div>
            )}
            {hasCoords && (
              <a className="directions-btn" href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`} target="_blank" rel="noreferrer"><Navigation size={14} /> {t.directions}</a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      {/* ═══ HEADER ═══ */}
      <header className="site-header">
        <div className="header-left">
          <div className="brand">
            <FallenIcon size={68} />
            <h1 className="wordmark">Fallen&nbsp;Palette</h1>
          </div>
          <p className="tagline">{t.tagline}</p>
        </div>
        <div className="header-right">
          <nav className="nav">
            {NAV.map(n => (
              <button key={n.id} className={`nav-btn ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <n.Icon size={17} />
                <span>{n.label}</span>
                {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
              </button>
            ))}
          </nav>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
            <button className={lang === "el" ? "active" : ""} onClick={() => setLang("el")} aria-pressed={lang === "el"}>GR</button>
          </div>
        </div>
      </header>

      <div className="app-content">
        {/* ═══════════ COLOUR MATCH ═══════════ */}
        {tab === "match" && (<div className="view">
          <div className="mode-row">
            <button className={`mode-btn ${mode === "name" ? "active" : ""}`} onClick={() => { setMode("name"); setSelPaint(null); }}><Search size={14} /> {t.byName}</button>
            <button className={`mode-btn ${mode === "hex" ? "active" : ""}`} onClick={() => { setMode("hex"); setSelPaint(null); setQuery(""); }}><Droplets size={14} /> {t.byColour}</button>
          </div>

          {mode === "name" && (<>
            <div className="search-wrap">
              <Search size={17} className="search-icon" />
              <input className="search-input" placeholder={t.searchNamePh} value={query} onChange={e => { setQuery(e.target.value); setSelPaint(null); }} />
            </div>
            <BrandChips />

            {!selPaint && query.trim() && suggestions.length > 0 && (
              <div className="card suggestions">
                <div className="suggest-label">{t.selectPaint}</div>
                {suggestions.map((p, i) => <PaintRow key={i} paint={p} showOwn={false} onClick={() => selectPaint(p)} />)}
              </div>
            )}
            {!selPaint && query.trim() && suggestions.length === 0 && <div className="hint">{t.noPaintMatch.replace("{q}", query)}</div>}

            {selPaint && (<>
              <div className="card-hero">
                <div className="card-hero-inner">
                  <Swatch hex={selPaint.hex} size={48} className="swatch-lg" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="hero-name" title={selPaint.name}>{selPaint.name}</div>
                    <div className="hero-meta">{BRANDS[selPaint.brand]} · {selPaint.type} · {selPaint.hex}</div>
                  </div>
                  <button className={`own-btn ${isOwned(selPaint) ? "owned" : ""}`} onClick={() => toggleOwned(selPaint)} title={isOwned(selPaint) ? t.removePaint : t.addPaint}>
                    {isOwned(selPaint) ? <Check size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>
              {nameResults.eq.length > 0 && (<>
                <div className="section-label">{t.directEquivalents}</div>
                <div className="results-grid">
                  {nameResults.eq.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={colorDistance(selPaint.hex, p.hex)} />} /></div>)}
                </div>
              </>)}
              {nameResults.nb.length > 0 && (<>
                <div className="section-label">{t.similarColours}</div>
                <div className="results-grid">
                  {nameResults.nb.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={(p as any).distance} />} /></div>)}
                </div>
              </>)}
            </>)}

            {/* ─── DYNAMIC LANDING ─── */}
            {!selPaint && !query.trim() && (
              <div className="landing">
                <div className="stats-band">
                  <div className="stat-pill"><Droplets size={18} /><div><b>{allPaints.length}</b><span>{t.statPaints}</span></div></div>
                  <div className="stat-pill"><Palette size={18} /><div><b>{BRAND_IDS.length}</b><span>{t.statBrands}</span></div></div>
                  <div className="stat-pill"><StoreIcon size={18} /><div><b>{STORES.length}</b><span>{t.statStores}</span></div></div>
                </div>

                <div className="section-head">
                  <div className="section-label"><Sparkles size={14} /> {t.featured}</div>
                  <button className="ghost-btn" onClick={() => setFeatSeed(Math.floor(Math.random() * 1e9))}><Shuffle size={13} /> {t.shuffle}</button>
                </div>
                <div className="feature-card" onClick={() => selectPaint(featured)}>
                  <div className="feature-top">
                    <Swatch hex={featured.hex} size={52} className="swatch-lg" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hero-name" title={featured.name}>{featured.name}</div>
                      <div className="hero-meta">{BRANDS[featured.brand]} · {featured.type}</div>
                    </div>
                    <ArrowRight size={18} className="feature-arrow" />
                  </div>
                  {featuredMatches.length > 0 && (
                    <div className="feature-matches">
                      {featuredMatches.map((p, i) => (
                        <div key={i} className="feature-match">
                          <Swatch hex={p.hex} size={20} />
                          <span className="fm-name" title={p.name}>{p.name}</span>
                          <span className="fm-brand">{BRANDS[p.brand]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-label">{t.howItWorks}</div>
                <div className="how-grid">
                  {[
                    { Icon: Search, title: t.howSearchT, d: t.howSearchD },
                    { Icon: Palette, title: t.howCompareT, d: t.howCompareD },
                    { Icon: Layers, title: t.howSaveT, d: t.howSaveD },
                  ].map((s, i) => (
                    <div key={i} className="how-card"><span className="how-icon"><s.Icon size={18} /></span><div className="how-title">{s.title}</div><div className="how-desc">{s.d}</div></div>
                  ))}
                </div>
              </div>
            )}
          </>)}

          {mode === "hex" && (<>
            <div className="hex-panel">
              <div className="hex-intro">
                <div className="hex-intro-title"><Droplets size={16} /> {t.colourTitle}</div>
                <p className="hex-intro-desc">{t.colourDesc}</p>
              </div>
              <div className="hex-picker">
                <label className="color-pick" title={t.pick}>
                  <input type="color" value={hexVal} onChange={e => setHexVal(e.target.value)} />
                  <span>{t.pick}</span>
                </label>
                <div className="hex-field">
                  <label htmlFor="hexInput">{t.hexCode}</label>
                  <input id="hexInput" className="hex-input" value={hexVal} maxLength={7} onChange={e => { let v = e.target.value; if (!v.startsWith("#")) v = "#" + v; if (v.length <= 7) setHexVal(v); }} />
                </div>
                <div className="hex-current">
                  <Swatch hex={hexVal} size={56} className="hex-preview swatch-lg" />
                  <span className="hex-current-val">{hexVal.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="section-label"><Palette size={14} /> {t.filterByBrand}</div>
            <BrandChips />
            <div className="count">{hexResults.length} {t.closestTo} <b style={{ color: "var(--bright)" }}>{hexVal.toUpperCase()}</b></div>
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
              <div className="empty-title">{t.rackEmptyTitle}</div>
              <div className="empty-body">
                {t.rackPre}<b>{t.navMatch}</b>{t.rackMid}<span className="inline-plus"><Plus size={13} /></span>{t.rackPost}
              </div>
              <button className="cta-btn" onClick={() => setTab("match")}>{t.browsePaints} <ArrowRight size={15} /></button>
              <div className="save-note">{t.saveNote}</div>
            </div>
          ) : (<>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-num">{collection.size}</div><div className="stat-label">{t.total}</div></div>
              {Object.entries(collStats).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([brand, count]) => (
                <div key={brand} className="stat-card"><div className="stat-num">{count}</div><div className="stat-label">{(BRANDS[brand] || brand).split(" ")[0]}</div></div>
              ))}
            </div>
            <div className="search-wrap">
              <Search size={17} className="search-icon" />
              <input className="search-input" placeholder={t.filterColl} value={collFilter} onChange={e => setCollFilter(e.target.value)} />
            </div>
            <div className="coll-actions">
              <span className="count" style={{ padding: 0 }}>{collPaints.length} {collPaints.length !== 1 ? t.paintPlur : t.paintSing}</span>
              <div className="coll-buttons">
                <button className="text-btn" onClick={() => exportCollection(collection)} title="JSON"><Download size={13} /> {t.exportL}</button>
                <label className="text-btn" title="JSON">
                  <Upload size={13} /> {t.importL}
                  <input type="file" accept="application/json,.json" style={{ display: "none" }} onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const imported = await importCollection(file);
                      if (confirm(t.importConfirm.replace("{n}", String(imported.size)))) {
                        setCollection(prev => new Set([...prev, ...imported]));
                      }
                    } catch (err) {
                      alert(t.importFail.replace("{msg}", err instanceof Error ? err.message : "unknown error"));
                    }
                    e.target.value = "";
                  }} />
                </label>
                <button className="text-btn danger" onClick={() => { if (confirm(t.clearConfirm)) setCollection(new Set()); }}><Trash2 size={13} /> {t.clearL}</button>
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
            <input className="search-input" placeholder={t.storeSearchPh} value={storeQ} onChange={e => { setStoreQ(e.target.value); }} />
          </div>
          <div className="chips">
            <button className={`chip ${!countryFilter ? "active" : ""}`} onClick={() => setCountryFilter(null)}>{t.all}</button>
            {countries.map(c => <button key={c} className={`chip ${countryFilter === c ? "active" : ""}`} onClick={() => setCountryFilter(countryFilter === c ? null : c)}>{t.countries[c] || c}</button>)}
          </div>
          <div className="count">{storeResults.length} {storeResults.length !== 1 ? t.storePlur : t.storeSing}</div>

          <div className="store-layout">
            <div className="store-list">
              {storeResults.length === 0 ? <div className="hint">{t.noStoresMatch}</div> :
                showGroups ? groupedStores.map(([country, list]) => (
                  <div key={country} className="store-group">
                    <div className="store-group-label"><MapPin size={12} /> {t.countries[country] || country} <span className="store-group-count">{list.length}</span></div>
                    {list.map(renderStore)}
                  </div>
                )) : storeResults.map(renderStore)
              }
            </div>

            {mapStores.length > 0 && (
              <div className="map-container">
                <MapContainer
                  key={mapStores.map(s => s.id).join(",")}
                  bounds={mapStores.map(s => [s.lat as number, s.lng as number] as [number, number])}
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
                  {mapStores.map(s => (
                    <Marker key={s.id} position={[s.lat as number, s.lng as number]} icon={makeIcon(s.color, activeStore === s.id)}
                      eventHandlers={{ click: () => setActiveStore(s.id) }}>
                      <Popup><b>{s.name}</b><br />{s.city}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        </div>)}

        <footer className="footer">
          <div className="footer-brand"><FallenIcon size={20} /> {t.footer}</div>
          <a className="footer-feedback" href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent("Fallen Palette — feedback")}`}>
            <Mail size={13} /> {t.feedback}
          </a>
          <div className="footer-copy">{t.copyright}</div>
          <div className="footer-disclaimer">{t.disclaimer}</div>
        </footer>
      </div>
    </div>
  );
}
