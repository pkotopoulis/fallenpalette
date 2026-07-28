// Writes a real HTML file per route into dist/, after vite build.
//
// The app is client-rendered, so every URL in sitemap.xml previously served the
// same shell: identical <title>, identical description, and an empty <body> until
// JavaScript ran. A crawler that does not execute JS saw nothing specific, and
// one that does had to render 768 pages to tell them apart.
//
// Each page now ships its own title, description, canonical and Open Graph tags,
// plus a <noscript> block carrying the paint's details and its equivalents as
// real text and real links. The shell still boots normally and React takes over
// #root, so behaviour for a visitor is unchanged.
//
// Ordering matters: this runs after vite-plugin-pwa has generated its precache
// manifest, so these files are deliberately not precached. Adding 768 HTML files
// to the service worker would bloat it for no benefit — crawlers do not run
// service workers, and a returning visitor gets the SPA shell from cache anyway.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const ORIGIN = "https://fallenpalette.com";

// Bundle the data and copy modules so this script uses the same source of truth
// as the app, rather than a second copy that could drift.
const cache = resolve(root, "node_modules/.cache");
mkdirSync(cache, { recursive: true });
const load = async (rel, name) => {
  const out = resolve(cache, `fp-pre-${name}.mjs`);
  await build({ entryPoints: [resolve(root, rel)], outfile: out, format: "esm", bundle: true, logLevel: "error" });
  return import(pathToFileURL(out).href);
};
const { ALL_PAINTS, paintPath, equivalentsOf } = await load("src/data/paints.ts", "paints");
const { BRANDS } = await load("src/data/brands.ts", "brands");
const { I18N } = await load("src/i18n.ts", "i18n");

const t = I18N.en;
const template = readFileSync(resolve(dist, "index.html"), "utf8");

const esc = s => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Rewrites the shell's head and injects the no-JS body for one route. */
function page({ path, title, description, body }) {
  const url = `${ORIGIN}${path}`;
  const head = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${ORIGIN}/fallen-banner-wide.jpg" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n  ");

  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />\n  ${head}`)
    // Inside #root so React discards it on mount; a crawler that does not run
    // JavaScript still reads it.
    .replace('<div id="root"></div>', `<div id="root"><noscript>\n${body}\n  </noscript></div>`);
}

function write(path, html) {
  const dir = resolve(dist, path.replace(/^\//, ""));
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), html);
}

let count = 0;

// ── One page per paint: the long tail that answers "<paint> equivalent" ──
for (const p of ALL_PAINTS) {
  const brand = BRANDS[p.brand] ?? p.brand;
  const eq = equivalentsOf(p);
  const brandsWith = [...new Set(eq.map(e => BRANDS[e.brand] ?? e.brand))];

  const title = `${p.name} (${brand}) equivalents — Fallen Palette`;
  const description = brandsWith.length
    ? t.metaPaint.replace("{name}", p.name).replace("{brand}", brand)
        .replace("{hex}", p.hex).replace("{brands}", brandsWith.join(", "))
    : t.metaPaintBare.replace("{name}", p.name).replace("{brand}", brand);

  const list = eq.length
    ? `    <h2>Equivalent paints</h2>\n    <ul>\n` +
      eq.map(e => `      <li><a href="${esc(paintPath(e))}">${esc(e.name)}</a> — ${esc(BRANDS[e.brand] ?? e.brand)} (${esc(e.type)})</li>`).join("\n") +
      `\n    </ul>`
    : `    <p>No cross-brand equivalent is recorded for this paint yet.</p>`;

  write(paintPath(p), page({
    path: paintPath(p),
    title,
    description,
    body: `    <h1>${esc(p.name)} equivalents</h1>\n` +
          `    <p>${esc(p.name)} is a ${esc(p.type)} paint by ${esc(brand)}, colour ${esc(p.hex)}.</p>\n` +
          list + `\n    <p><a href="/paints">All ${ALL_PAINTS.length} paints</a></p>`,
  }));
  count++;
}

// ── The index, which is how a crawler reaches every paint page ──
write("/paints", page({
  path: "/paints",
  title: `All ${ALL_PAINTS.length} paints — Fallen Palette`,
  description: t.metaIndex.replace("{count}", String(ALL_PAINTS.length)),
  body: `    <h1>All ${ALL_PAINTS.length} paints</h1>\n    <ul>\n` +
    ALL_PAINTS.map(p =>
      `      <li><a href="${esc(paintPath(p))}">${esc(p.name)}</a> — ${esc(BRANDS[p.brand] ?? p.brand)}</li>`
    ).join("\n") + `\n    </ul>`,
}));
count++;

// ── Remaining public views. /my-paints is skipped: it is device-local, has
//    nothing to render server-side and is disallowed in robots.txt. ──
for (const [path, title, description] of [
  ["/colours", "Fallen Palette — miniature paint cross-reference", t.metaDefault],
  ["/stores", `${t.navStores} — Fallen Palette`, t.metaDefault],
]) {
  write(path, page({
    path, title, description,
    body: `    <h1>${esc(title)}</h1>\n    <p>${esc(description)}</p>\n` +
          `    <p><a href="/paints">All ${ALL_PAINTS.length} paints</a></p>`,
  }));
  count++;
}

// ── Every URL advertised in the sitemap must actually have a file behind it.
//    seo.mjs and this script derive their routes independently, so without this
//    they can drift and the sitemap ends up promising pages that fall back to
//    the generic shell — the exact problem this script exists to fix. ──
const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
const advertised = [...sitemap.matchAll(/<loc>https:\/\/fallenpalette\.com([^<]*)<\/loc>/g)].map(m => m[1]);
const missing = advertised.filter(u => {
  const file = u === "/" ? resolve(dist, "index.html") : resolve(dist, u.replace(/^\//, ""), "index.html");
  try { readFileSync(file); return false; } catch { return true; }
});
if (missing.length) {
  console.error(`prerender: ${missing.length} sitemap urls have no page:\n  ${missing.slice(0, 10).join("\n  ")}`);
  process.exit(1);
}

console.log(`prerender: ${count} html pages (${ALL_PAINTS.length} paints + index + 2 views), all ${advertised.length} sitemap urls covered`);
