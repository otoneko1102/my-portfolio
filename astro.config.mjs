// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  outDir: "./build",
  site: "https://montblank.fun",
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
});
