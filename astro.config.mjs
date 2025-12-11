// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  output: "static",
  outDir: "./build",
  site: "https://montblank.fun",
  integrations: [svelte()]
});