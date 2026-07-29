import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import {
  Search, Palette, Layers, Store as StoreIcon, Plus, Check, Download, Upload,
  Trash2, MapPin, Phone, Clock, Globe, ChevronDown, Shuffle, BadgeCheck,
  Navigation, Sparkles, ArrowRight, Droplets, Mail, ShoppingCart,
} from "lucide-react";
import { useLocation, useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { ALL_PAINTS, equivalentsOf, paintId as pid, paintPath, findPaintByPath } from "./data/paints";
import { BRANDS, BRAND_IDS } from "./data/brands";
import { RangeKind, RANGE_KIND_IDS, rangeKindOf } from "./data/ranges";
import { affiliateLinksFor, AffiliateLink, AFFILIATES_ENABLED, AMAZON_ENABLED, AMAZON_DISCLOSURE } from "./data/affiliates";
import { STORES, DAY_ORDER, DAY_LABEL } from "./data/stores";
import { Paint, Store, DayKey } from "./data/types";
import { colorDistance, luminance, matchTier, matchBg, matchFg } from "./utils/colors";
import { findTriad } from "./utils/triad";
import { findSubstitutes } from "./utils/substitute";
import { sortByDistance, formatDistance, Coords } from "./utils/geo";
import { findMixes } from "./utils/mix";
import { extractPalette, sampleSize, PaletteEntry } from "./utils/palette";
import {
  Tab, TAB_PATH, tabFromPath, isPaintsIndexPath,
  modeFromParams, hexFromParams, queryFromParams, searchPath, hexSearchPath, photoSearchPath,
  SearchMode,
} from "./utils/urlState";
import { loadCollection, saveCollection, exportCollection, importCollection } from "./utils/storage";
import { I18N, Lang } from "./i18n";
import FallenIcon from "./FallenIcon";

/**
 * Loaded on demand. Leaflet, react-leaflet and the Leaflet stylesheet are only
 * needed by the Stores tab, and were previously downloaded by everyone —
 * including every visitor landing on a paint page from a search result.
 */
const StoreMap = lazy(() => import("./StoreMap"));

// Feedback link — flip FEEDBACK_READY to true and set the real address once
// domain email (Cloudflare Email Routing) is configured. See README.
const FEEDBACK_READY = true;
const FEEDBACK_EMAIL = "feedback@fallenpalette.com";
const JS_DAY: DayKey[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayKey = (): DayKey => JS_DAY[new Date().getDay()];

export default function App() {
  // ── URL-backed state ──
  // The location is the source of truth for which view is open, which paint is
  // selected and what was searched for, so results are shareable, bookmarkable
  // and the back button behaves. Everything else stays as local state.
  const location = useLocation();
  const navigate = useNavigate();
  const { brand: routeBrand, slug: routeSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = tabFromPath(location.pathname);
  const setTab = (id: Tab) => navigate(TAB_PATH[id]);

  const isPaintsIndex = isPaintsIndexPath(location.pathname);

  // An unresolvable /paint/... URL falls back to the search view rather than
  // rendering a blank page, so a stale or mistyped link still lands somewhere.
  const selPaint = findPaintByPath(routeBrand, routeSlug);

  const mode = modeFromParams(searchParams);
  const hexVal = hexFromParams(searchParams);
  const query = selPaint ? selPaint.name : queryFromParams(searchParams);

  const setQuery = (v: string) =>
    // replace, not push: typing a search must not bury the back button under
    // one history entry per keystroke.
    navigate(searchPath(v), { replace: true });
  const setSelPaint = (p: Paint | null) =>
    p ? navigate(paintPath(p)) : navigate("/colours", { replace: true });
  const setMode = (m: SearchMode) =>
    navigate(m === "hex" ? hexSearchPath(hexVal) : m === "photo" ? photoSearchPath() : "/colours");
  const setHexVal = (v: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("hex", v.replace(/^#/, ""));
      return next;
    }, { replace: true });
  };

  const [activeBrands, setActiveBrands] = useState<Set<string>>(new Set(BRAND_IDS));
  // All kinds on by default: hiding a third of the catalog from someone who
  // never asked would be worse than the noise. One click narrows it.
  const [activeRanges, setActiveRanges] = useState<Set<RangeKind>>(new Set(RANGE_KIND_IDS));
  const [collection, setCollection] = useState<Set<string>>(loadCollection);
  const [collFilter, setCollFilter] = useState("");
  const [storeQ, setStoreQ] = useState("");
  // Browse filter for the all-paints index. Deliberately local rather than in the
  // URL: the page is prerendered with a canonical pointing at the unfiltered
  // /paints, and query variants of a page that exists for crawling are not worth
  // making indexable.
  const [indexFilter, setIndexFilter] = useState("");
  // null until the visitor asks. Never requested on load — an unprompted
  // location prompt on a paint website is hostile.
  const [here, setHere] = useState<Coords | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "locating" | "denied" | "unavailable">("idle");
  // Palette pulled from a chosen image. The image itself is never stored beyond a
  // preview URL and never leaves the device.
  const [palette, setPalette] = useState<PaletteEntry[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoState, setPhotoState] = useState<"idle" | "working" | "failed">("idle");
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [activeStore, setActiveStore] = useState<number | null>(null);
  const [featSeed, setFeatSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [lang, setLang] = useState<Lang>(() => {
    try { const s = localStorage.getItem("fp_lang"); if (s === "en" || s === "el") return s; } catch {}
    return (navigator.language || "").toLowerCase().startsWith("el") ? "el" : "en";
  });
  const t = I18N[lang];

  useEffect(() => { saveCollection(collection); }, [collection]);

  // Per-route title, description and canonical link. A crawler that renders the
  // page sees a real description of this specific paint instead of the shell's
  // generic one, and the canonical stops ?q= and ?hex= variants competing with
  // each other for the same content.
  useEffect(() => {
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement(selector.startsWith("link") ? "link" : "meta");
        if (selector.includes("canonical")) el.setAttribute("rel", "canonical");
        else if (selector.includes("og:")) el.setAttribute("property", selector.match(/"([^"]+)"/)![1]);
        else el.setAttribute("name", selector.match(/"([^"]+)"/)![1]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    let title = "Fallen Palette — miniature paint cross-reference";
    let desc = t.metaDefault;
    let path = location.pathname;

    if (selPaint) {
      const brands = [...new Set(equivalentsOf(selPaint).map(p => BRANDS[p.brand]))];
      title = `${selPaint.name} (${BRANDS[selPaint.brand]}) equivalents — Fallen Palette`;
      desc = brands.length
        ? t.metaPaint
            .replace("{name}", selPaint.name)
            .replace("{brand}", BRANDS[selPaint.brand])
            .replace("{hex}", selPaint.hex)
            .replace("{brands}", brands.join(", "))
        : t.metaPaintBare.replace("{name}", selPaint.name).replace("{brand}", BRANDS[selPaint.brand]);
      path = paintPath(selPaint);
    } else if (isPaintsIndex) {
      title = `All ${ALL_PAINTS.length} paints — Fallen Palette`;
      desc = t.metaIndex.replace("{count}", String(ALL_PAINTS.length));
    } else if (tab === "collection") {
      title = `${t.navCollection} — Fallen Palette`;
    } else if (tab === "stores") {
      title = `${t.navStores} — Fallen Palette`;
    }

    document.title = title;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('link[rel="canonical"]', "href", `https://fallenpalette.com${path}`);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
  }, [selPaint, isPaintsIndex, tab, location.pathname, t]);
  useEffect(() => {
    try { localStorage.setItem("fp_lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleBrand = useCallback((b: string) => {
    setActiveBrands(p => { const n = new Set(p); if (n.has(b)) { if (n.size > 1) n.delete(b); } else n.add(b); return n; });
  }, []);

  // Same rule as brands: never let the last one be switched off, since an empty
  // filter yields no results at all and looks like a broken page.
  const toggleRange = useCallback((k: RangeKind) => {
    setActiveRanges(p => { const n = new Set(p); if (n.has(k)) { if (n.size > 1) n.delete(k); } else n.add(k); return n; });
  }, []);

  const toggleOwned = useCallback((paint: Paint) => {
    setCollection(p => { const n = new Set(p); const id = pid(paint); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const isOwned = (p: Paint) => collection.has(pid(p));

  // ── Paint logic ──
  const allPaints = ALL_PAINTS;
  // Single filtered pool feeding suggestions, similar colours, hex search and
  // the triad, so every surface respects both filters consistently.
  const allFlat = useMemo(
    () => ALL_PAINTS.filter(p => activeBrands.has(p.brand) && activeRanges.has(rangeKindOf(p.type))),
    [activeBrands, activeRanges]);

  const suggestions = useMemo(() => {
    if (!query.trim() || mode !== "name") return [];
    const q = query.toLowerCase();
    return allFlat.filter(p => p.name.toLowerCase().includes(q) || (BRANDS[p.brand] || "").toLowerCase().includes(q)).slice(0, 15);
  }, [allFlat, query, mode]);

  const computeMatches = useCallback((paint: Paint) => {
    const eq = equivalentsOf(paint)
      .filter(p => activeBrands.has(p.brand) && activeRanges.has(rangeKindOf(p.type)));
    const ids = new Set([pid(paint), ...eq.map(pid)]);
    const nb = allFlat.filter(p => !ids.has(pid(p))).map(p => ({ ...p, distance: colorDistance(paint.hex, p.hex) })).sort((a, b) => a.distance - b.distance).slice(0, 20);
    return { eq, nb };
  }, [allFlat, activeBrands, activeRanges]);

  const nameResults = useMemo(() => selPaint ? computeMatches(selPaint) : { eq: [], nb: [] }, [selPaint, computeMatches]);

  // Shade/highlight suggestions honour the brand filter, so a Citadel-only
  // painter gets a ramp they can actually buy.
  const triad = useMemo(
    () => selPaint ? findTriad(selPaint, allFlat, 2) : { shade: [], highlight: [] },
    [selPaint, allFlat]);

  const hexResults = useMemo(() => {
    if (mode !== "hex" || hexVal.length < 7) return [];
    return allFlat.map(p => ({ ...p, distance: colorDistance(hexVal, p.hex) })).sort((a, b) => a.distance - b.distance).slice(0, 30);
  }, [allFlat, hexVal, mode]);

  // ── Landing data ──
  /**
   * Featured paints are drawn only from those with a broad cross-reference.
   *
   * Picking uniformly would show three brands or fewer 44% of the time and an
   * empty card for the 34 paints with no equivalent at all — a poor showcase for
   * a section whose whole job is demonstrating coverage. This narrows which
   * example is shown, not what the catalog claims: every row is still a real
   * curated equivalence.
   */
  const featurePool = useMemo(() => {
    const broad = ALL_PAINTS.filter(p =>
      new Set(equivalentsOf(p).filter(e => e.brand !== p.brand).map(e => e.brand)).size >= 4);
    return broad.length ? broad : ALL_PAINTS;
  }, []);

  const featured = useMemo(() => featurePool[featSeed % featurePool.length], [featSeed, featurePool]);
  /**
   * One curated equivalent per brand for the featured paint, in brand order.
   *
   * Showing every brand rather than the first three is the point: it is the
   * clearest demonstration of what the cross-reference actually holds. Only
   * curated equivalents are used — padding the list with nearest-by-colour
   * matches would inflate the apparent coverage of brands that have none.
   */
  const featuredMatches = useMemo(() => {
    const best = new Map<string, Paint>();
    for (const p of equivalentsOf(featured)) {
      if (p.brand === featured.brand || best.has(p.brand)) continue;
      best.set(p.brand, p);
    }
    return BRAND_IDS.filter(b => best.has(b)).map(b => best.get(b)!);
  }, [featured]);

  // Navigating to the paint's own URL is all that's needed now: mode, query and
  // selection are all derived from the location.
  const selectPaint = (p: Paint) => navigate(paintPath(p));

  // ── Collection logic ──
  // Every owned paint, unfiltered — collPaints below narrows by the search box,
  // which must not narrow what a substitute can be drawn from.
  const indexPaints = useMemo(() => {
    const q = indexFilter.trim().toLowerCase();
    if (!q) return ALL_PAINTS;
    return ALL_PAINTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (BRANDS[p.brand] ?? "").toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q));
  }, [indexFilter]);

  const collPaintsAll = useMemo(() => ALL_PAINTS.filter(p => collection.has(pid(p))), [collection]);

  const collPaints = useMemo(() => {
    const all = collPaintsAll;
    if (!collFilter.trim()) return all;
    const q = collFilter.toLowerCase();
    return all.filter(p => p.name.toLowerCase().includes(q) || (BRANDS[p.brand] || "").toLowerCase().includes(q));
  }, [collPaintsAll, collFilter]);

  const collStats = useMemo(() => {
    const byBrand: Record<string, number> = {};
    ALL_PAINTS.filter(p => collection.has(pid(p))).forEach(p => {
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
  // Nearest first once a location is known, otherwise the curated order.
  const storeList = useMemo(
    () => here ? sortByDistance(storeResults, here) : storeResults.map(s => ({ ...s, distanceKm: undefined as number | undefined })),
    [storeResults, here]);

  /**
   * Reads a chosen image and extracts its palette.
   *
   * Everything happens here on the device: the file is decoded to a canvas,
   * downscaled, and clustered. Nothing is uploaded, which is both the honest
   * default for someone’s photos and the reason this needs no backend.
   */
  const handlePhoto = async (file: File) => {
    setPhotoState("working");
    setPalette([]);
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("not an image"));
        img.src = url;
      });

      const { width, height } = sampleSize(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no 2d context");
      ctx.drawImage(img, 0, 0, width, height);

      setPalette(extractPalette(ctx.getImageData(0, 0, width, height).data, 6));
      // Revoke the previous preview rather than leaking it.
      setPhotoUrl(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
      setPhotoState("idle");
    } catch {
      URL.revokeObjectURL(url);
      setPhotoState("failed");
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) { setGeoState("unavailable"); return; }
    setGeoState("locating");
    navigator.geolocation.getCurrentPosition(
      pos => { setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoState("idle"); },
      err => setGeoState(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"),
      { timeout: 10000, maximumAge: 300000 },
    );
  };

  const mapStores = useMemo(() => storeResults.filter(s => s.lat != null && s.lng != null), [storeResults]);

  // Group results by country (Greece pinned first, then alphabetical)
  const groupedStores = useMemo(() => {
    const m = new Map<string, Store[]>();
    storeResults.forEach(s => { if (!m.has(s.country)) m.set(s.country, []); m.get(s.country)!.push(s); });
    const rank = (c: string) => (c === "Greece" ? 0 : 1);
    return [...m.entries()].sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]));
  }, [storeResults]);
  // Grouping by country and sorting by distance are competing orders, and the
  // country headings would break a nearest-first list into meaningless runs. Once
  // a location is known the flat sorted list wins.
  const showGroups = groupedStores.length > 1 && !here;

  // ── Shared components ──
  /**
   * `size` is still given in px at the call sites, but rendered as em against the
   * 14px base so swatches scale with the root font size like everything else. A
   * fixed pixel swatch beside text that grows on a large screen ends up looking
   * undersized.
   */
  const Swatch = ({ hex, size = 28, className = "" }: { hex: string; size?: number; className?: string }) => {
    const em = `${size / 14}em`;
    return (
      <div
        className={`swatch ${className}`}
        style={{
          width: em,
          height: em,
          flexShrink: 0,
          background: hex,
          border: luminance(hex) > 0.85 ? "1px solid #3A3D42" : "1px solid transparent",
        }}
      />
    );
  };

  const MatchBadge = ({ d }: { d: number }) => {
    const tier = matchTier(d);
    return (
      <span className="match-badge" style={{ background: matchBg(d), color: matchFg(d) }}>
        {tier === "exact" ? t.matchExact : tier === "close" ? t.matchClose : t.matchApprox}
      </span>
    );
  };

  const PaintRow = ({ paint, showOwn = true, extra, onClick }: { paint: Paint; showOwn?: boolean; extra?: React.ReactNode; onClick?: () => void }) => (
    <div className={`paint-row ${onClick ? "clickable" : ""}`} onClick={onClick}>
      <Swatch hex={paint.hex} />
      <div className="paint-info">
        <div className="paint-name" title={paint.name}>{paint.name}</div>
        <div className="paint-sub">
          <span className="paint-meta" title={BRANDS[paint.brand]}>{BRANDS[paint.brand]}</span>
          <span className="range-badge" title={paint.type}>{paint.type}</span>
        </div>
      </div>
      {extra}
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

  /**
   * Outbound shop links for a paint.
   *
   * rel="sponsored" is required by Google for paid links; without it these read
   * as a link scheme and can cost the site the ranking the paint pages exist to
   * earn. nofollow is belt-and-braces for older crawlers, noopener closes the
   * window.opener hole on target=_blank. The disclosure is a legal requirement
   * (FTC, ASA/CAP, EU) and has to sit with the links, not only in the footer.
   *
   * Renders nothing at all until a programme is configured in affiliates.ts.
   */
  /**
   * What you could use tonight instead of buying this.
   *
   * Sits above "where to buy" deliberately: the shelf is a better answer than
   * the shop, and putting the affiliate links first would be self-serving.
   * Hidden entirely for a paint you already own, and when the collection is
   * empty, since there is nothing useful to say in either case.
   */
  const FromYourPaints = ({ paint }: { paint: Paint }) => {
    if (!collection.size || isOwned(paint)) return null;
    const subs = findSubstitutes(paint, collPaintsAll, 3);
    // Only worth offering a mix when the shelf does not already answer it, so
    // the cheapest correct advice always comes first.
    const bestSingle = subs.length ? subs[0].distance : Infinity;
    const mixes = bestSingle > 4 ? findMixes(paint, collPaintsAll, bestSingle, 2) : [];
    return (
      <div className="sub-block">
        <div className="sub-head"><Layers size={14} /> {t.fromYourPaints}</div>
        {subs.length === 0 && mixes.length === 0
          ? <div className="sub-empty">{t.ownedNone}</div>
          : (<>
              <div className="results-grid">
                {subs.map(s => (
                  <div key={pid(s.paint)} className="card">
                    <PaintRow
                      paint={s.paint}
                      onClick={() => selectPaint(s.paint)}
                      extra={
                        <>
                          {s.curated && <span className="sub-curated">{t.curatedMatch}</span>}
                          <MatchBadge d={s.distance} />
                        </>
                      }
                    />
                  </div>
                ))}
              </div>
              {subs.length > 0 && <div className="sub-hint">{t.fromYourPaintsHint}</div>}

              {mixes.length > 0 && (<>
                <div className="mix-head">{t.mixIt}</div>
                <div className="results-grid">
                  {mixes.map((m, i) => (
                    <div key={i} className="card mix-card">
                      <div className="mix-row">
                        <Swatch hex={m.hex} size={30} />
                        <div className="mix-info">
                          <div className="mix-recipe">
                            {m.a.name} <span className="mix-plus">+</span> {m.b.name}
                          </div>
                          <div className="mix-meta">{t.mixParts.replace("{parts}", m.parts)}</div>
                        </div>
                        <MatchBadge d={m.distance} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sub-hint">{t.mixHint}</div>
              </>)}
            </>)}
      </div>
    );
  };

  const WhereToBuy = ({ paint }: { paint: Paint }) => {
    if (!affiliateLinksFor(paint).length) return null;
    return (
      <div className="buy-block">
        <div className="buy-head">
          <ShoppingCart size={14} /> {t.whereToBuy}
        </div>

        {/* <details> rather than a <select>: these have to stay real anchors to
            keep rel="sponsored", and routing clicks through JS instead would
            drop it and edge toward the link cloaking Amazon's terms forbid. */}
        <ShopMenu paint={paint} />

        {/* Outside the menu on purpose: Amazon requires its disclosure to be
            clearly and prominently displayed, which it would not be if a click
            were needed to reveal it. */}
        <div className="buy-hint">{t.buyHint}</div>
        <div className="buy-disclosure">
          {t.affiliateNote}
          {AMAZON_ENABLED && <> {AMAZON_DISCLOSURE}</>}
        </div>
      </div>
    );
  };

  /**
   * Single outbound shop link. Kept as one component so the rel and target
   * attributes cannot drift apart between the menu and the single-shop case —
   * losing rel="sponsored" on either would be an SEO and compliance problem.
   */
  const BuyAnchor = ({ link }: { link: AffiliateLink }) => (
    <a
      className="buy-link"
      href={link.href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
    >
      {link.name} <ArrowRight size={13} />
    </a>
  );

  /**
   * The shop chooser, in two sizes.
   *
   * One component for both the paint page and collection rows so they cannot
   * diverge — the row variant used to show only the first shop with no way to
   * reach the others.
   */
  const ShopMenu = ({ paint, compact = false }: { paint: Paint; compact?: boolean }) => {
    const links = affiliateLinksFor(paint);
    if (!links.length) return null;

    // Nothing to choose between: a menu holding one item is just an extra click.
    if (links.length === 1) {
      return compact
        ? <a
            className="row-buy"
            href={links[0].href}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            title={`${t.restock} — ${links[0].name}`}
            onClick={e => e.stopPropagation()}
          >
            <ShoppingCart size={13} /> {t.restock}
          </a>
        : <div className="buy-links"><BuyAnchor link={links[0]} /></div>;
    }

    return (
      <details
        className={`buy-menu ${compact ? "is-compact" : ""}`}
        // Rows can be clickable; opening the menu must not also select the paint.
        onClick={e => e.stopPropagation()}
      >
        <summary className={compact ? "row-buy" : "buy-summary"}>
          {compact ? <ShoppingCart size={13} /> : null}
          <span>{compact ? t.restock : t.buyChoose}</span>
          <ChevronDown size={compact ? 13 : 15} className="buy-chev" />
        </summary>
        <div className="buy-menu-list">
          {links.map(l => <BuyAnchor key={l.id} link={l} />)}
        </div>
      </details>
    );
  };

  const RangeChips = () => (
    <div className="chips chips-range">
      <span className="chips-label">{t.filterByRange}</span>
      {RANGE_KIND_IDS.map(k => {
        const n = ALL_PAINTS.filter(p => rangeKindOf(p.type) === k).length;
        return (
          <button
            key={k}
            className={`chip chip-sm ${activeRanges.has(k) ? "active" : ""}`}
            onClick={() => toggleRange(k)}
            title={`${t.rangeKinds[k]} — ${n}`}
          >
            {t.rangeKinds[k]} <span className="chip-count">{n}</span>
          </button>
        );
      })}
    </div>
  );

  // Keyed on path rather than tab id, so the all-paints index can sit in the
  // nav alongside the tabs. Rendered as real links, which also gives a crawler
  // an href to every top-level view from any page.
  const NAV = [
    { path: "/colours", Icon: Palette, label: t.navMatch, badge: null as number | null, active: tab === "match" && !isPaintsIndex },
    { path: "/paints", Icon: Droplets, label: t.allPaints, badge: ALL_PAINTS.length, active: isPaintsIndex },
    { path: "/my-paints", Icon: Layers, label: t.navCollection, badge: collection.size || null, active: tab === "collection" },
    { path: "/stores", Icon: StoreIcon, label: t.navStores, badge: null as number | null, active: tab === "stores" },
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

  const renderStore = (s: Store & { distanceKm?: number }) => {
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
            <div className="store-addr" title={`${s.address}, ${s.city}`}>
              {s.address ? `${s.address} · ` : ""}{s.city}
              {here && (
                <span className="store-dist">
                  {s.distanceKm != null ? ` · ${formatDistance(s.distanceKm)}` : ` · ${t.distanceUnknown}`}
                </span>
              )}
            </div>
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
    <>
      {/* ═══ HERO BANNER (full-bleed 3:1 artwork) ═══ */}
      <header className="hero-banner">
        <img className="hero-banner-img" src="/fallen-banner-wide.jpg" alt="Fallen Palette" />
        <div className="hero-banner-text">
          <h1 className="wordmark">Fallen&nbsp;Palette</h1>
          <p className="tagline">{t.tagline}</p>
        </div>
      </header>

      <div className="app">
      {/* ═══ STICKY NAV ═══ */}
      <div className="navbar">
        <nav className="nav">
          {NAV.map(n => (
            <Link key={n.path} to={n.path} className={`nav-btn ${n.active ? "active" : ""}`}>
              <n.Icon size={17} />
              <span>{n.label}</span>
              {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="lang-toggle" role="group" aria-label="Language">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
          <button className={lang === "el" ? "active" : ""} onClick={() => setLang("el")} aria-pressed={lang === "el"}>GR</button>
        </div>
      </div>

      <div className="app-content">
        {/* ═══════════ ALL PAINTS INDEX ═══════════
            Plain links to every paint. Doubles as the crawl path that makes
            each paint page discoverable, since the search view is driven by
            JavaScript and exposes no hrefs. */}
        {isPaintsIndex && (<div className="view">
          <div className="section-label"><Droplets size={14} /> {t.allPaints}</div>
          <div className="index-hint">{t.allPaintsHint}</div>
          <div className="search-wrap">
            <Search size={17} className="search-icon" />
            <input
              className="search-input"
              placeholder={t.filterPaintsPh}
              value={indexFilter}
              onChange={e => setIndexFilter(e.target.value)}
            />
          </div>
          <div className="count">
            {t.showingPaints.replace("{n}", String(indexPaints.length)).replace("{total}", String(ALL_PAINTS.length))}
          </div>
          {indexPaints.length === 0 && (
            <div className="hint">{t.noPaintsMatch.replace("{q}", indexFilter)}</div>
          )}
          {BRAND_IDS.map(brandId => {
            const paints = indexPaints.filter(p => p.brand === brandId);
            if (!paints.length) return null;
            return (
              <section key={brandId} className="index-brand">
                <h2 className="index-brand-name">{BRANDS[brandId]} <span>{paints.length}</span></h2>
                <div className="index-list">
                  {paints.map(p => (
                    <Link key={pid(p)} className="index-item" to={paintPath(p)}>
                      <Swatch hex={p.hex} size={18} />
                      <span className="index-item-name">{p.name}</span>
                      <span className="index-item-range">{p.type}</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
          <div className="index-foot"><Link className="cta-btn" to="/colours">{t.backToSearch} <ArrowRight size={15} /></Link></div>
        </div>)}

        {/* ═══════════ COLOUR MATCH ═══════════ */}
        {!isPaintsIndex && tab === "match" && (<div className="view">
          <div className="mode-row">
            <button className={`mode-btn ${mode === "name" ? "active" : ""}`} onClick={() => setMode("name")}><Search size={14} /> {t.byName}</button>
            <button className={`mode-btn ${mode === "hex" ? "active" : ""}`} onClick={() => setMode("hex")}><Droplets size={14} /> {t.byColour}</button>
            <button className={`mode-btn ${mode === "photo" ? "active" : ""}`} onClick={() => setMode("photo")}><Sparkles size={14} /> {t.byPhoto}</button>
          </div>

          {mode === "name" && (<>
            <div className="search-wrap">
              <Search size={17} className="search-icon" />
              <input className="search-input" placeholder={t.searchNamePh} value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <BrandChips />
            <RangeChips />

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
              {/* The shelf before the shop: what you already own beats a buy
                  link, and ordering it the other way would be self-serving. */}
              <FromYourPaints paint={selPaint} />
              {/* Directly under the paint it belongs to. Placed after the
                  equivalents originally, which buried it below a full results
                  grid where nobody found it. */}
              <WhereToBuy paint={selPaint} />
              {(triad.shade.length > 0 || triad.highlight.length > 0) && (<>
                <div className="section-label"><Layers size={14} /> {t.shadingTriad}</div>
                <div className="triad-hint">{t.triadHint}</div>
                <div className="triad-ramp">
                  {[
                    { role: t.triadShade, paints: triad.shade, current: false },
                    { role: t.triadBase, paints: [selPaint], current: true },
                    { role: t.triadHighlight, paints: triad.highlight, current: false },
                  ].filter(step => step.paints.length > 0).map(step => (
                    <div key={step.role} className={`triad-step ${step.current ? "is-base" : ""}`}>
                      <div className="triad-role">{step.role}</div>
                      {step.paints.map((p, i) => (
                        <button
                          key={i}
                          className="triad-paint"
                          onClick={step.current ? undefined : () => selectPaint(p)}
                          disabled={step.current}
                          title={`${p.name} — ${BRANDS[p.brand]} · ${p.type}`}
                        >
                          <Swatch hex={p.hex} size={30} />
                          <span className="triad-name">{p.name}</span>
                          <span className="triad-brand">{BRANDS[p.brand]}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>)}
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
                  {featuredMatches.length > 0 && (<>
                    <div className="feature-count">
                      {t.featuredAcross
                        .replace("{n}", String(featuredMatches.length + 1))
                        .replace("{total}", String(BRAND_IDS.length))}
                    </div>
                    <div className="feature-matches">
                      {featuredMatches.map((p, i) => (
                        <div key={i} className="feature-match">
                          <Swatch hex={p.hex} size={20} />
                          <span className="fm-name" title={p.name}>{p.name}</span>
                          <span className="fm-badge">
                            <MatchBadge d={colorDistance(featured.hex, p.hex)} />
                          </span>
                          <span className="fm-brand">{BRANDS[p.brand]}</span>
                        </div>
                      ))}
                    </div>
                  </>)}
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

          {mode === "photo" && (<>
            <div className="hex-panel">
              <div className="hex-title">{t.photoTitle}</div>
              <div className="hex-desc">{t.photoDesc}</div>
              <div className="photo-privacy">{t.photoPrivacy}</div>

              <label className="photo-pick">
                {photoUrl ? t.photoAgain : t.photoPick}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }}
                />
              </label>

              {photoState === "working" && <div className="photo-note">{t.photoWorking}</div>}
              {photoState === "failed" && <div className="photo-note photo-error">{t.photoFailed}</div>}
              {photoUrl && <img className="photo-preview" src={photoUrl} alt="" />}
            </div>

            {palette.map((entry, i) => {
              const near = allFlat
                .map(p => ({ ...p, distance: colorDistance(entry.hex, p.hex) }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 3);
              return (
                <div key={i} className="pal-group">
                  <div className="pal-head">
                    <Swatch hex={entry.hex} size={30} />
                    <div className="pal-info">
                      <div className="pal-hex">{entry.hex.toUpperCase()}</div>
                      <div className="pal-share">
                        {t.photoShare.replace("{n}", String(Math.round(entry.share * 100)))}
                      </div>
                    </div>
                  </div>
                  <div className="results-grid">
                    {near.map((p, j) => (
                      <div key={j} className="card">
                        <PaintRow paint={p} onClick={() => selectPaint(p)} extra={<MatchBadge d={p.distance} />} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
            <RangeChips />
            <div className="count">{hexResults.length} {t.closestTo} <b style={{ color: "var(--bright)" }}>{hexVal.toUpperCase()}</b></div>
            <div className="results-grid">
              {hexResults.map((p, i) => <div key={i} className="card"><PaintRow paint={p} extra={<MatchBadge d={(p as any).distance} />} /></div>)}
            </div>
          </>)}
        </div>)}

        {/* ═══════════ COLLECTION ═══════════ */}
        {!isPaintsIndex && tab === "collection" && (<div className="view">
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
              {collPaints.map((p, i) => (
                <div key={i} className="card card-open"><PaintRow paint={p} extra={<ShopMenu paint={p} compact />} /></div>
              ))}
            </div>
          </>)}
        </div>)}

        {/* ═══════════ STORES ═══════════ */}
        {!isPaintsIndex && tab === "stores" && (<div className="view">
          <div className="search-wrap">
            <Search size={17} className="search-icon" />
            <input className="search-input" placeholder={t.storeSearchPh} value={storeQ} onChange={e => { setStoreQ(e.target.value); }} />
          </div>
          <div className="chips">
            <button className={`chip ${!countryFilter ? "active" : ""}`} onClick={() => setCountryFilter(null)}>{t.all}</button>
            {countries.map(c => <button key={c} className={`chip ${countryFilter === c ? "active" : ""}`} onClick={() => setCountryFilter(countryFilter === c ? null : c)}>{t.countries[c] || c}</button>)}
          </div>
          <div className="count">{storeResults.length} {storeResults.length !== 1 ? t.storePlur : t.storeSing}</div>
          <div className="near-row">
            {here ? (
              <>
                <span className="near-on"><Navigation size={13} /> {t.nearMeOn}</span>
                <button className="ghost-btn" onClick={() => { setHere(null); setGeoState("idle"); }}>{t.nearMeClear}</button>
              </>
            ) : (
              <button className="chip near-btn" onClick={requestLocation} disabled={geoState === "locating"}>
                <Navigation size={13} /> {geoState === "locating" ? t.nearMeLocating : t.nearMe}
              </button>
            )}
            {geoState === "denied" && <span className="near-note">{t.nearMeDenied}</span>}
            {geoState === "unavailable" && <span className="near-note">{t.nearMeUnavailable}</span>}
          </div>

          <div className="store-layout">
            <div className="store-list">
              {storeResults.length === 0 ? <div className="hint">{t.noStoresMatch}</div> :
                showGroups ? groupedStores.map(([country, list]) => (
                  <div key={country} className="store-group">
                    <div className="store-group-label"><MapPin size={12} /> {t.countries[country] || country} <span className="store-group-count">{list.length}</span></div>
                    {list.map(renderStore)}
                  </div>
                )) : storeList.map(renderStore)
              }
            </div>

            {mapStores.length > 0 && (
              <Suspense fallback={<div className="map-container map-loading" />}>
                <StoreMap
                  stores={mapStores}
                  activeStore={activeStore}
                  activeStoreObj={activeStoreObj}
                  onSelect={setActiveStore}
                />
              </Suspense>
            )}
          </div>
        </div>)}

        <footer className="footer">
          <div className="footer-brand"><FallenIcon size={20} /> {t.footer}</div>
          {FEEDBACK_READY && (
            <a className="footer-feedback" href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent("Fallen Palette — feedback")}`}>
              <Mail size={13} /> {t.feedback}
            </a>
          )}
          <div className="footer-copy">{t.copyright}</div>
          {/* Site-wide disclosure, in addition to the one beside the links
              themselves. Only shown when a programme is actually live. */}
          {AFFILIATES_ENABLED && (
            <div className="footer-disclaimer">
              {t.affiliateFooter}
              {AMAZON_ENABLED && <> {AMAZON_DISCLOSURE}</>}
            </div>
          )}
          <div className="footer-disclaimer">{t.disclaimer}</div>
        </footer>
      </div>
    </div>
    </>
  );
}
