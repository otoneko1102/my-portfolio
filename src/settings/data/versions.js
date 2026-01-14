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
  // If you previously relied on deriving URLs from version (v{n}.{baseDomain}),
  // you can still set a `baseDomain` for backward compatibility, but it's
  // recommended to explicitly specify `url` on each entry.
  domain: "p.montblank.fun",
};

/** @type {VersionEntry[]} */
export const versions = [
  // Each entry should specify at minimum `version` and `url`.
  // Optional fields: title, description, image
  {
    version: 2,
    url: "https://montblank.fun",
    title: "V2 (latest)",
    description: "2025年の12月から現在まで使用している最新のバージョンです。AstroとSvelteで書いています。",
  },
  {
    version: 1,
    description: "2025年の11月まで使用していたバージョンです。Svelteで書いています。",
  },
];
