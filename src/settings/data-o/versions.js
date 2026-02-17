// not share

/**
 * @typedef {Object} VersionEntry
 * @property {number} version - Numeric version identifier
 * @property {string} url - Publicly accessible URL for this version
 * @property {string} [title] - Optional display title for UI
 * @property {string} [description] - Optional short description
 * @property {string} [image] - Optional image URL for preview/thumbnail
 */

/**
 * @typedef {Object} VersionsConfig
 * @property {string} [domain] - Fallback base domain used to derive a URL when `url` is not provided (e.g., `v{n}.{baseDomain}`)
 */

/** @type {VersionsConfig} */
export const versionsConfig = {
  domain: "p.otoneko.cat",
};

/** @type {VersionEntry[]} */
export const versions = [
  {
    version: 2,
    url: "https://otoneko.cat",
    title: "V2 (latest)",
    description:
      "2026年の2月から現在まで使用している最新のバージョンです。AstroとSvelteで書いています。",
  },
  {
    version: 1,
    url: "https://www.otoneko.jp",
    description: "2024年まで使用していたサイトです。",
  },
];
