/**
 * History data structure
 *
 * Example:
 * {
 *   "2025": {
 *     "12": [
 *       "An event",
 *       { text: "Text", url: "https://example.com", badge: "project" }
 *     ],
 *     "08": [ ... ]
 *   }
 * }
 *
 * @typedef {'work'|'event'|'award'|'project'|'personal'|'release'|string} HistoryBadgeKey
 * @typedef {{ text: string, url?: string, badge?: HistoryBadgeKey }} HistoryItem
 * @typedef {string|HistoryItem} HistoryEntry
 * @typedef {Record<string, HistoryEntry[]>} MonthMap
 * @typedef {Record<string, MonthMap>} HistoryMap
 *
 * Suggested badge categories (sample):
 * - work: { badge: 'circle' }       // Work history
 * - award: { badge: 'triangle' }    // Awards / honors
 * - project: { badge: 'square' }    // Projects / releases
 * - personal: { badge: 'diamond' }  // Personal events
 *
 * Badges accept either a category key (e.g., 'work') or a shape name:
 * 'dot' | 'circle' | 'triangle' | 'square' | 'diamond'
 *
 * HistoryBadges shape:
 * @typedef {Object} HistoryBadgeEntry
 * @property {('dot'|'circle'|'triangle'|'square'|'diamond'|string)} [badge] Shape name (dot|circle|triangle|square|diamond) or custom
 * @property {string} [color] CSS color string (hex, rgb, etc.)
 * @property {string} [label] English short label for the category
 * @typedef {Record<string, HistoryBadgeEntry>} HistoryBadgesMap
 */

/** @type {HistoryBadgesMap} */
export const historyBadges = {
  work: { badge: "circle", color: "#043cb4ff", label: "Work" },
  event: { badge: "circle", color: "#81a9ffff", label: "Event" },
  award: { badge: "triangle", color: "#f59e0b", label: "Award" },
  project: { badge: "square", color: "#10b981", label: "Project" },
  personal: { badge: "diamond", color: "#ef4444", label: "Personal" },
  release: { badge: "diamond", color: "#8b5cf6", label: "Release" },
};

/** @type {HistoryBadgeKey[]} */
export const historyBadgeKeys = Object.keys(historyBadges);

/** @type {HistoryMap} */
export const history = {
  2025: {
    12: [
      { text: "もふもふぽっぷに所属", badge: "personal" },
      { text: "React(Next.js)を始める", badge: "project" },
      { text: "ポートフォリオをリニューアル", badge: "release" },
      { text: "TailwindCSSを始める", badge: "project" },
      { text: "p2hacks 2025 Pre-PBL部門 Fenrir賞 受賞", url: "https://universe.mfmf.moe", badge: "award" },
      { text: "p2hacks 2025 Pre-PBL部門 最優秀賞 受賞", url: "https://universe.mfmf.moe", badge: "award" },
    ],
    11: [
      { text: "つくるっしょ！運営メンバーになる", url: "https://tsukurussyo.pages.dev", badge: "event" },
      { text: "開発バイトを開始", badge: "work" },
      { text: "道南リモートワーカーお茶会 Vol.02 参加", url: "https://blog.montblank.fun/b/donan-remoteworker_2", badge: "event" },
    ],
    10: [
      { text: "技育CAMPキャラバン札幌2025秋 参加", url: "https://blog.montblank.fun/b/geekcamp_2025-10-04", badge: "event" },
      { text: "CoffeeScriptを始める", badge: "project" },
      { text: "CoffeeScript用のビルダー、Milkeeを公開", url: "https://milkee.oto.im", badge: "release" },
      { text: "Rubyを始める", badge: "project" },
      { text: "未来祭LT2025", url: "https://blog.montblank.fun/b/miraisailt_2025-10-12", badge: "event" },
    ],
    9: [{ text: "道南リモートワーカーお茶会 Vol.01 参加", badge: "event" }],
    8: [
      { text: "Astroを始める", badge: "project" },
      { text: "hokkaido.js(函館)2025 登壇", url: "https://blog.montblank.fun/b/hokkaidojs_2025-08-02", badge: "event" },
      { text: "セブンイレブンで長期休暇は帰省すると申告したら何故かバイトを辞めさせられる", badge: "work" },
      { text: "CISTLT2025 登壇", url: "https://blog.montblank.fun/b/cistlt_2025-08", badge: "event" },
      { text: "nekosを公開", url: "https://www.npmjs.com/package/nekos", badge: "release" },
    ],
    7: [{ text: "しょーもないLT2025 登壇・運営", url: "https://blog.montblank.fun/b/shomonailt_2025-07-06", badge: "event" }],
    6: [
      { text: "技育CAMPキャラバン札幌2025春 参加", url: "https://blog.montblank.fun/b/geekcamp_2025-06-07", badge: "event" },
      { text: "FUNピクニックLT 登壇", url: "https://blog.montblank.fun/b/picniclt_2025-06-15", badge: "event" },
      { text: "セブンイレブンでバイトを始める", badge: "work" },
    ],
    5: [{ text: "はこだて未来大×企業エンジニア 大LT2025 参加", badge: "event" }],
    4: [
      { text: "公立はこだて未来大学 入学", badge: "work" },
      { text: "Viteを始める", badge: "project" },
      { text: "EJSを始める", badge: "project" },
      { text: "ポートフォリオサイトを公開", badge: "release" },
      { text: "Mariners' Conference `25 Spring 参加", badge: "event" },
    ],
    3: [{ text: "北海道岩見沢東高等学校 卒業", badge: "work" }],
    1: [{ text: "Svelteを始める", badge: "project" }],
  },
  2024: {
    12: [
      { text: "Chrome拡張機能の開発とストア掲載を始める", badge: "personal" },
      { text: "Idea Sellerでの活動を休止", badge: "personal" },
    ],
    8: [{ text: "Idea Sellerに所属しチーム開発を進める", badge: "personal" }],
    4: [{ text: "TypeScriptを始める", badge: "project" }],
  },
  2023: {
    9: [{ text: "セキュリティDiscord Botを公開", url: "https://protecat.otoneko.jp", badge: "release" }],
    7: [{ text: "OSS開発を開始", badge: "project" }],
    1: [
      { text: "Google Apps Scriptを始める", badge: "project" },
      { text: "多機能Discord Botを公開", url: "https://maidproject.otoneko.jp", badge: "release" },
    ],
  },
  2022: {
    12: [
      { text: "新型コロナに感染。自宅療養中の暇な時間を活用し、Node.jsでDiscord Botの作成を開始", badge: "project" },
      { text: "Web開発を開始。JavaScriptやHTML/CSSを始める", badge: "project" },
    ],
    8: [
      { text: "個人開発を開始", badge: "project" },
      { text: "BDFDという簡易的な言語でDiscord Botの作成を開始", badge: "project" },
    ],
    4: [{ text: "北海道岩見沢東高等学校 入学", badge: "work" }],
  },
};
