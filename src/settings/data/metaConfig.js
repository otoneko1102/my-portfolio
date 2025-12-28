import { aboutMe } from "./aboutMe";

/**
 * @typedef {Object} MetaTag
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [image]
 * @property {string} [type]
 */

/**
 * @typedef {Object} MetaConfig
 * @property {MetaTag} default
 * @property {Object<string, MetaTag>} pages
 */

/**
 * @type {MetaConfig}
 */
export const metaConfig = {
  default: {
    title: "まろん｡のポートフォリオ",
    description: aboutMe.bio,
    image: aboutMe.image,
    type: "website",
  },
  pages: {
    home: {
      title: "ホーム | まろん｡のポートフォリオ",
      description: "まろん｡のポートフォリオサイトです。",
      image: "/icon.png",
      type: "website",
    },
  },
};
