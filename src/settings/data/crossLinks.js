import requirementsHtml from "./crossLinks.html?raw";

/**
 * @typedef {Object} CrossLink
 * @property {string} url - リンク先のURL
 * @property {string} author - サイトの作者
 * @property {string} [title] - サイトのタイトル（任意、なければOGデータから取得）
 * @property {string} [description] - サイトの説明（任意、なければOGデータから取得）
 * @property {string} [thumbnail] - サムネイル画像URL（任意、なければOGデータから取得）
 */

/**
 * @typedef {Object} CrossLinksConfig
 * @property {string} applyDescription - 申請セクションの説明文
 * @property {string} applyButtonText - 申請ボタンのテキスト
 * @property {string} twitterUsername - Twitterのユーザー名（@なし、例: "1517667933291704320"）
 * @property {string} applyMessageTemplate - TwitterのDMメッセージテンプレート
 */

/**
 * @type {CrossLinksConfig}
 */
export const crossLinksConfig = {
  applyDescription: "相互リンクをご希望の方は、お気軽にご連絡ください！",
  applyButtonText: "相互リンクを申請する",
  twitterUsername: "1517667933291704320",
  applyMessageTemplate: "相互リンクしませんか！\n\nURL:\nあなたの名前:\n紹介文:(任意)\nサイト名:(任意)\nサムネイルURL:(任意)\n\n※OGPから取得できるのであれば任意の部分は不要",
  requirementsHtml: requirementsHtml,
};

/**
 * @type {CrossLink[]}
 */
export const crossLinks = [
  {
    url: "https://kinoemon.com",
    title: null,
    author: "キノえもん",
    description: null,
    thumbnail: null,
  },
  {
    url: "https://shikoshib.ru",
    title: null,
    author: "shikoshib",
    description: null,
    thumbnail: null,
  },
];
