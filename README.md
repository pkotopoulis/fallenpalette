# Fallen Palette

Miniature paint cross-reference, collection tracker, and hobby store finder.

Fallen Palette helps miniature painters find equivalent paints across brands
(Citadel, Vallejo, The Army Painter, AK Interactive, Scale75, Two Thin Coats,
Pro Acryl and more), track the paints they own, and locate hobby/wargaming
stores across Europe — with an English/Greek interface.

## Tech

- React 18 + TypeScript, built with Vite
- Leaflet + CARTO dark tiles for the store map
- lucide-react icons
- Deployed on Cloudflare Pages

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/, then sitemap/robots
npm run preview  # preview the production build
npm test         # unit tests (vitest)
```

## Routes

The location is the source of truth for the open view, the selected paint and
the current search, so results are shareable and the back button works. The
mappings live in [`src/utils/urlState.ts`](./src/utils/urlState.ts).

| Path | View |
|---|---|
| `/` and `/colours` | Search by paint name |
| `/colours?q=<text>` | Search, prefilled |
| `/colours?hex=<rrggbb>` | Search by colour |
| `/paint/<brand>/<slug>` | One paint: equivalents, similar colours, triad |
| `/paints` | Index of every paint, grouped by brand |
| `/my-paints` | Collection (device-local, excluded from robots.txt) |
| `/stores` | Store finder |

A paint's slug comes from its name, so **changing a paint name changes its URL**
and breaks existing links. A test asserts slugs stay unique per brand.

Deep links need the host to serve the app for paths that match no file.
Cloudflare Pages does this automatically — **as long as the build output has no
top-level `404.html`**, Pages treats the project as a single-page app and routes
unmatched paths to the root.

> **Important:** Adding a `404.html` silently switches that off, and every deep
> link starts returning it instead of the app. Do not add one. A `_redirects`
> file with `/* /index.html 200` is not the fix either — Pages rejects it as an
> infinite loop (error 100324) and the whole deploy fails.

`sitemap.xml` and `robots.txt` are generated at build time from the catalog by
[`scripts/seo.mjs`](./scripts/seo.mjs), so they cannot drift from the paint data.

## Prerendering

[`scripts/prerender.mjs`](./scripts/prerender.mjs) writes a real HTML file per
route into `dist/` after the Vite build — one per paint, plus the index and the
public views. Each carries its own `<title>`, description, canonical and Open
Graph tags, and a `<noscript>` block holding the paint's details and its
equivalents as real text and real links.

Without it every URL in the sitemap served the same shell, so a crawler that
does not execute JavaScript saw nothing specific to the page.

The shell still boots normally: the `<noscript>` sits inside `#root` and React
replaces it on mount, so nothing changes for a visitor.

> **Important:** This step must run **after** `vite build`, so that
> vite-plugin-pwa has already written its precache manifest. Reordering it would
> add ~770 HTML files to the service worker precache for no benefit — crawlers
> do not run service workers, and a returning visitor gets the shell from cache
> regardless.

`seo.mjs` and `prerender.mjs` derive their route lists independently, so the
prerender step ends by asserting every URL in `sitemap.xml` has a file behind it
and fails the build otherwise.

## Analytics

Enable **Web Analytics** in the Cloudflare Pages project under Metrics.
Cloudflare injects the beacon on the next deployment — it is cookieless, needs
no consent banner, and requires no code here.

> **Important:** Do not also add the beacon snippet to `index.html`. With
> dashboard injection enabled that loads it twice and double-counts every
> pageview.

It reports pageviews, referrers, paths and Core Web Vitals. It does **not** do
custom events, so it will not tell you whether the affiliate links are clicked —
the Amazon Associates dashboard reports clicks and conversions per tag, which is
where that lives.

## Affiliate links

"Where to buy" links on paint pages and a restock link in My Paints, configured
in [`src/data/affiliates.ts`](./src/data/affiliates.ts).

**Nothing renders until you paste in a real ID.** Every retailer with a blank ID
is skipped, and the whole block plus the footer disclosure disappear when none
are configured, so the feature ships inert rather than as links that look like
they work while tracking nothing.

| Retailer | What to set | Where to get it |
|---|---|---|
| Amazon | `tag` per marketplace in `AMAZON_MARKETPLACES` | Associates dashboard. The tag must match the store — `-21` for European, `-20` for `.com` |
| Wayland Games | `AWIN_PUBLISHER_ID` and `WAYLAND_AWIN_ADVERTISER_ID` | Awin dashboard: your publisher ID, and Wayland's advertiser ID from their programme page |
| Element Games | `ELEMENT_GAMES_PARAM` | Their affiliate dashboard after signing up at [elementgames.co.uk/affiliation](https://elementgames.co.uk/affiliation) — the parameter name is a placeholder, confirm it |

With 620 paints there is no practical way to store a product URL per paint per
retailer, so links point at each retailer's own search for
`<brand> <paint name>`.

> **Important:** Outbound links carry `rel="sponsored nofollow noopener"`.
> `sponsored` is required by Google for paid links — without it they read as a
> link scheme, which would work directly against the paint pages' ranking. A
> test asserts this on every link, so do not remove it.

> **Important:** The disclosure next to the links and in the footer is a legal
> requirement (FTC, UK ASA/CAP, EU consumer law), not a courtesy. Keep it
> visible if you enable a programme.

Two caveats worth checking before relying on either:

- **Element Games** restrict their scheme to content creators and explicitly
  exclude "aggregator" sites. Confirm a cross-reference tool qualifies.
- **Amazon** terms forbid link cloaking and caching prices, and require the
  disclosure. Search-result links with a tag are permitted.

## Copyright

Copyright © 2026 Fallen Palette. All rights reserved.
See [LICENSE](./LICENSE) for full terms — this is proprietary software and may
not be copied, reused, or redistributed without written permission.

### Trademarks

Fallen Palette is an independent, unofficial fan project and is **not affiliated
with, endorsed by, or sponsored by Games Workshop Limited**. "Warhammer",
"Citadel", and all associated names and logos are trademarks of Games Workshop
Limited. All paint brand and colour names are trademarks of their respective
owners and are used here for identification and cross-reference purposes only.
