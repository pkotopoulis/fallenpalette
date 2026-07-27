import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["fallen-icon.png", "fallen-banner-wide.jpg"],
      manifest: {
        name: "Fallen Palette",
        short_name: "Fallen Palette",
        description: "Miniature paint cross-reference, collection tracker, and hobby store finder",
        theme_color: "#0A0B0D",
        background_color: "#0A0B0D",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/fallen-icon.png", sizes: "384x384", type: "image/png", purpose: "any" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,ico,woff2}"],
        // Client-side routing: any unknown path is the app, not a 404.
        navigateFallback: "/index.html",
        // ...except the crawler-facing files, which must be served as
        // themselves rather than swallowed by the app shell.
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/],
      },
    }),
  ],
  build: {
    outDir: "dist",
  },
});
