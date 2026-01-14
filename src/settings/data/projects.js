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
    tags: ["cli", "JavaScript", "npm", "TypeScript"],
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
    title: "Enhanced Tab Manager",
    description: "タブのグループ化と保存・復元を管理します。",
    image: "/projects/enhanced-tab-manager.png",
    tags: ["Chrome Extension", "JavaScript", "Tab"],
    url: "https://chromewebstore.google.com/detail/pjjabdbillaokbiighjgibfajkacfind",
    github: "https://github.com/otoneko1102/enhanced-tab-manager",
    pin: true,
  },
  {
    title: "Anywhere Search",
    description: "Add a search bar to all pages.",
    image: "/projects/anywhere-search.png",
    tags: ["Chrome Extension", "JavaScript", "Search"],
    url: "https://chromewebstore.google.com/detail/kfmamlgbolcnplllcjpkmjfjmgcjghml",
    github: "https://github.com/otoneko1102/anywhere-search",
    pin: true,
  },
  {
    title: "Fix Punycode",
    description: "すべてのPunycode形式のURLをUnicode表示に変換します。",
    image: "/projects/fix-punycode.png",
    tags: ["Chrome Extension", "JavaScript", "Punycode"],
    url: "https://chromewebstore.google.com/detail/fhhpbkpgaokapedjmmaagobopmiochef",
    github: "https://github.com/otoneko1102/fix-punycode",
    pin: true,
  },
  {
    title: "LDS Sync",
    description: "LINE, Discord, Slackのグループチャット・チャンネルを同期させます。",
    tags: ["Discord", "LINE", "Slack", "TypeScript"],
    github: "https://github.com/otoneko1102/lds-sync",
  },
  {
    title: "メイドちゃん",
    description: "Discordの多機能Bot(現在サービス終了済み)。",
    tags: ["Discord", "JavaScript"],
    url: "https://maidproject.otoneko.jp",
  },
  {
    title: "ProteCat",
    description: "DiscordのセキュリティBot(現在サービス終了済み)。",
    tags: ["Discord", "JavaScript"],
    url: "https://protecat.otoneko.jp",
  },
  {
    title: "Spotify Now Playing",
    description: "Spotifyでの現在再生中の楽曲を他ユーザーに簡単に見てもらったり、#NowPlayingのツイートをしやすくするものです。",
    tags: ["Spotify", "Svelte", "TypeScript"],
    url: "https://spotify.montblank.fun",
    github: "https://github.com/otoneko1102/SpotifyNowPlaying",
  },
  {
    title: "Captcha Like Fake Captcha",
    description: "ReCAPTCHAに扮した偽ReCAPTCHA風のCaptchaのサンプルです。",
    tags: ["Captcha", "mshta"],
    url: "https://hta.oto.im",
    github: "https://github.com/otoneko1102/captcha-like-fake-captcha",
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
    tags: ["JavaScript", "npm", "PDF", "unpkg", "Web"],
    url: "https://www.npmjs.com/package/xpdf-viewer",
    github: "https://github.com/otoneko1102/xpdf-viewer",
  },
  {
    title: "closewords",
    description: "最も似た単語を単語群から検索する日本語(漢字含む)対応のライブラリ",
    tags: ["JavaScript", "npm"],
    url: "https://www.npmjs.com/package/closewords",
    github: "https://github.com/otoneko1102/closewords",
  },
];
