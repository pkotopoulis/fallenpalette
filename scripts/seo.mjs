// Generates sitemap.xml and robots.txt into dist/ after a build.
//
// Run as part of `npm run build`. Reads the catalog straight from source via
// esbuild so the sitemap can never drift out of step with the paint data.
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://fallenpalette.com";

// Bundle the data module to a temp file so this script can import the real
// ALL_PAINTS / paintPath rather than re-parsing paints.ts with a regex.
const tmp = resolve(root, "node_modules/.cache/fp-seo-paints.mjs");
mkdirSync(dirname(tmp), { recursive: true });
await build({
  entryPoints: [resolve(root, "src/data/paints.ts")],
  outfile: tmp,
  format: "esm",
  bundle: true,
  logLevel: "error",
});
const { ALL_PAINTS, paintPath } = await import(pathToFileURL(tmp).href);

const staticPaths = [
  { path: "/", priority: "1.0" },
  { path: "/colours", priority: "0.9" },
  { path: "/paints", priority: "0.8" },
  { path: "/stores", priority: "0.6" },
];

const urls = [
  ...staticPaths,
  // Individual paint pages are the long tail: these are what answer a search
  // for "<paint name> equivalent".
  ...ALL_PAINTS.map(p => ({ path: paintPath(p), priority: "0.7" })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${ORIGIN}${u.path}</loc><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;

// /my-paints is a private, device-local view with nothing to index.
const robots = `User-agent: *
Allow: /
Disallow: /my-paints

Sitemap: ${ORIGIN}/sitemap.xml
`;

const dist = resolve(root, "dist");
mkdirSync(dist, { recursive: true });
writeFileSync(resolve(dist, "sitemap.xml"), sitemap);
writeFileSync(resolve(dist, "robots.txt"), robots);

console.log(`seo: sitemap.xml with ${urls.length} urls (${ALL_PAINTS.length} paints), robots.txt`);
