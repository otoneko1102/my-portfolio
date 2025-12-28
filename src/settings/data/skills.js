/**
 * @typedef {Object} Skill
 * @property {string} name
 * @property {string} icon
 * @property {number} proficiency
 */

/**
 * @typedef {Object} SkillCategory
 * @property {string} category
 * @property {Skill[]} items
 */

const javaScript = {
  name: "JavaScript",
  icon: "vscode-icons:file-type-js-official",
  proficiency: 80,
};
const typescript = {
  name: "TypeScript",
  icon: "vscode-icons:file-type-typescript-official",
  proficiency: 65,
};

const coffeescript = {
  name: "CoffeeScript",
  icon: "logos:coffeescript",
  proficiency: 75,
};

/**
 * @type {SkillCategory[]}
 */
export const skills = [
  {
    category: "Frontend",
    items: [
      javaScript,
      typescript,
      coffeescript,
      {
        name: "HTML",
        icon: "devicon:html5",
        proficiency: 70,
      },
      {
        name: "CSS",
        icon: "devicon:css3",
        proficiency: 75,
      },
      {
        name: "Vite",
        icon: "logos:vitejs",
        proficiency: 75,
      },
      {
        name: "Astro",
        icon: "logos:astro-icon",
        proficiency: 75,
      },
      {
        name: "Svelte",
        icon: "logos:svelte-icon",
        proficiency: 60,
      },
      {
        name: "React",
        icon: "logos:react",
        proficiency: 35,
      },
      {
        name: "Next.js",
        icon: "logos:nextjs-icon",
        proficiency: 35,
      },
      {
        name: "TailwindCSS",
        icon: "logos:tailwindcss-icon",
        proficiency: 35,
      },
      {
        name: "EJS",
        icon: "vscode-icons:file-type-ejs",
        proficiency: 50,
      },
    ],
  },
  {
    category: "Backend",
    items: [
      {
        name: "Node.js",
        icon: "logos:nodejs-icon",
        proficiency: 85,
      },
      javaScript,
      typescript,
      coffeescript,
      {
        name: "Express",
        icon: "simple-icons:express",
        proficiency: 70,
      },
      {
        name: "Hono",
        icon: "logos:hono",
        proficiency: 70,
      },
      {
        name: "Nest.js",
        icon: "logos:nestjs",
        proficiency: 30,
      },
      {
        name: "Ruby",
        icon: "logos:ruby",
        proficiency: 20,
      },
    ],
  },
  {
    category: "Others",
    items: [
      {
        name: "Git",
        icon: "logos:git-icon",
        proficiency: 70,
      },
      {
        name: "GitHub",
        icon: "logos:github-icon",
        proficiency: 70,
      },
      {
        name: "VS Code",
        icon: "logos:visual-studio-code",
        proficiency: 70,
      },
      {
        name: "Docker",
        icon: "logos:docker-icon",
        proficiency: 50,
      },
      {
        name: "npm",
        icon: "logos:npm-icon",
        proficiency: 85,
      },
      {
        name: "pnpm",
        icon: "vscode-icons:file-type-light-pnpm",
        proficiency: 65,
      },
      {
        name: "yarn",
        icon: "vscode-icons:file-type-yarn",
        proficiency: 50,
      },
      {
        name: "nginx",
        icon: "logos:nginx",
        proficiency: 50,
      },
      {
        name: "SQLite",
        icon: "vscode-icons:file-type-sqlite",
        proficiency: 50,
      },
      {
        name: "Regex",
        icon: "file-icons:regex",
        proficiency: 65,
      },
    ],
  },
];
