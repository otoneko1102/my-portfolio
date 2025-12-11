/**
 * @typedef {Object} Project
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 * @property {string} [url]
 * @property {string} [github]
 * @property {string} [image]
 */

/**
 * @type {Project[]}
 */
export const projects = [
  {
    title: "Milkee",
    description:
      "現代のCoffeeScript Builderです。",
    image: "/projects/milkee-logo.png",
    tags: ["CoffeeScript"],
    url: "https://milkee.oto.im",
    github:
      "https://github.com/otoneko1102/coffeescript-milkee",
  },
  {
    title: "ドメインフォ",
    description:
      "ドメイン関連の話題を扱うブログです。",
    image:
      "https://domainfo.blog/assets/img/thumbnail.png",
    tags: [
      "ドメイン",
      "ブログ",
      "Vite",
    ],
    url: "https://domainfo.blog",
    github:
      "https://github.com/otoneko1102/domainfo.blog",
  },
  {
    title: "oto.im URL Shortener",
    description:
      "シンプルで高速な短縮URLサービス",
    image: null,
    tags: [
      "短縮URL",
      "Astro",
      "Svelte",
      "CoffeeScript",
    ],
    url: "https://oto.im",
    github:
      "https://github.com/otoneko1102/shorturl-service",
  },
];
