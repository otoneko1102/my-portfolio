// not share

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
    title: "音猫｡のポートフォリオ",
    description: aboutMe.bio,
    image: aboutMe.image,
    type: "website",
  },
  pages: {
    projects: {
      title: "Projects | 音猫｡のポートフォリオ",
      description:
        "私の制作物をまとめたページです。個人開発とチーム開発のものを掲載しています。",
      image: "/icon.png",
      type: "website",
    },
    history: {
      title: "History | 音猫｡のポートフォリオ",
      description: "これまでの出来事を時系列でまとめたページです。",
      image: "/icon.png",
      type: "website",
    },
  },
};
