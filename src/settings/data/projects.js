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
    description: "キモい構成のポートフォリオ",
    image: "/icon.png",
    tags: ["Astro", "Svelte"],
    github: "https://github.com/otoneko1102/my-portfolio",
    pin: true,
  },
  {
    title: "Milkee",
    description: "現代のCoffeeScript Builderです。",
    image: "/projects/milkee-logo.png",
    tags: ["CoffeeScript"],
    url: "https://milkee.oto.im",
    github: "https://github.com/otoneko1102/coffeescript-milkee",
    pin: true,
  },
  {
    title: "nekos",
    description: "Let's have cute cats mess around in the log!",
    image: "/projects/nekos.png",
    tags: ["cli", "JavaScript", "TypeScript"],
    url: "https://www.npmjs.com/package/nekos",
    github: "https://github.com/otoneko1102/nekos",
    pin: true,
  },
  {
    title: "ドメインフォ",
    description: "ドメイン関連の話題を扱うブログです。",
    image: "https://domainfo.blog/assets/img/thumbnail.png",
    tags: ["Vite", "ドメイン", "ブログ"],
    url: "https://domainfo.blog",
    github: "https://github.com/otoneko1102/domainfo.blog",
    pin: true,
  },
  {
    title: "U'n'IVERSE",
    description: "Create your own profile card easily and share it with the people you meet to expand your universe.",
    image: "/projects/universe.png",
    tags: ["Hono", "Next.js", "P2HACKS 2025", "TailwindCSS", "TypeScript", "もふもふぽっぷ"],
    url: "https://universe.mfmf.moe",
    pin: true,
  },
  {
    title: "Spotify Now Playing",
    description: "Spotifyでの現在再生中の楽曲を他ユーザーに簡単に見てもらったり、#NowPlayingのツイートをしやすくするものです。",
    tags: ["Spotify", "Svelte", "TypeScript"],
    url: "https://spotify.montblank.fun",
    github: "https://github.com/otoneko1102/SpotifyNowPlaying",
  },
  {
    title: "oto.im URL Shortener",
    description: "シンプルで高速な短縮URLサービス",
    tags: ["Astro", "CoffeeScript", "Svelte", "短縮URL"],
    url: "https://oto.im",
    github: "https://github.com/otoneko1102/shorturl-service",
  },
  {
    title: "Webプレゼン",
    description: "対面/音声通話時を想定したWebプレゼンです。スクリーン・プロジェクターやモニターがない時に使えます。",
    tags: ["Svelte", "TypeScript"],
    url: "https://presentation.oto.im",
    github: "https://github.com/otoneko1102/web-presentation",
  },
  {
    title: "xpdf-viewer",
    description: "A simple, embeddable PDF viewer that works on both PC and mobile, powered by PDF.js.",
    tags: ["JavaScript", "PDF", "unpkg", "Web"],
    url: "https://www.npmjs.com/package/xpdf-viewer",
    github: "https://github.com/otoneko1102/xpdf-viewer",
  },
];
