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
    title: "My Portfolio",
    description:
      "キモい構成のポートフォリオ",
    image: "/icon.png",
    tags: ["Astro", "Svelte"],
    github:
      "https://github.com/otoneko1102/my-portfolio",
  },
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
    title: "nekos",
    description:
      "Let's have cute cats mess around in the log!",
    image: "/projects/nekos.png",
    tags: [
      "JavaScript",
      "TypeScript",
      "cli",
    ],
    url: "https://www.npmjs.com/package/nekos",
    github:
      "https://github.com/otoneko1102/nekos",
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
  {
    title: "U'n'IVERSE",
    description:
      "Create your own profile card easily and share it with the people you meet to expand your universe.",
    image: "/projects/universe.png",
    tags: [
      "P2HACKS 2025",
      "もふもふぽっぷ",
      "Next.js",
      "TailwindCSS",
      "TypeScript",
      "Hono",
    ],
    url: "https://universe.mfmf.moe",
  },
];
