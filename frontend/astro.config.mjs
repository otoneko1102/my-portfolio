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
      serialize(item) {
        return item;
      },
      changefreq: "weekly",
      priority: 1,
    }),
  ],
});
