// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configOtoneko = path.resolve(__dirname, "src/settings/config-o.js");

/**
 * Vite plugin to redirect config.js → config-o.js for otoneko.cat build.
 * Works in both SSR and client builds.
 */
function configSwapPlugin() {
  return {
    name: "config-swap",
    enforce: /** @type {const} */ ("pre"),
    /** @param {string} source */
    resolveId(source) {
      if (
        source.endsWith("settings/config.js") ||
        source.endsWith("settings/config")
      ) {
        return configOtoneko;
      }
      return null;
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: "static",
  outDir: "./build-o",
  publicDir: "./public-o",
  site: "https://otoneko.cat",
  integrations: [
    svelte(),
    sitemap({
      changefreq: "weekly",
      priority: 1,
      lastmod: new Date(),
      serialize(item) {
        return item;
      },
    }),
  ],
  vite: {
    plugins: [configSwapPlugin()],
  },
});
