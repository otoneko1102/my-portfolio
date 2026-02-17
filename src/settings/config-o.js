// Config aggregator for otoneko.cat
// Shared data comes from data/, non-shared data comes from data-o/

// Shared (same for both sites)
export { navLinks } from "./data/navLinks.js";
export { skills } from "./data/skills.js";
export { projects } from "./data/projects.js";
export { colors } from "./data/colors.js";
export { sectionDescriptions } from "./data/secDesc.js";

// Not shared (otoneko.cat specific)
export { siteConfig } from "./data-o/siteConfig.js";
export { metaConfig } from "./data-o/metaConfig.js";
export { socialLinks } from "./data-o/socialLinks.js";
export { aboutMe } from "./data-o/aboutMe.js";
export { aboutDetails } from "./data-o/aboutDetails.js";
export { contactLinks } from "./data-o/contactLinks.js";
export { blogConfig } from "./data-o/blogConfig.js";
export { crossLinks, crossLinksConfig } from "./data-o/crossLinks.js";
export { history, historyBadges, historyBadgeKeys } from "./data-o/history.js";
export { versions, versionsConfig } from "./data-o/versions.js";
