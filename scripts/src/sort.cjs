#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const recast = require("recast");
const parser = require("@babel/parser");
const t = require("@babel/types");

const parse = (source) =>
  parser.parse(source, {
    sourceType: "module",
    plugins: [
      "jsx",
      "classProperties",
      "decorators-legacy",
      "optionalChaining",
      "nullishCoalescingOperator",
      "topLevelAwait",
    ],
  });

function getAllJsFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllJsFiles(full));
    } else if (entry.isFile() && full.endsWith(".js")) {
      results.push(full);
    }
  }
  return results;
}

const collator = new Intl.Collator("ja");

function sortTagsInDir(
  rootDir = path.join(process.cwd(), "src", "settings", "data")
) {
  const files = getAllJsFiles(rootDir);
  let changedFiles = [];

  files.forEach((file) => {
    const source = fs.readFileSync(file, "utf8");
    let ast;
    try {
      ast = recast.parse(source, { parser: { parse } });
    } catch (err) {
      console.error("Failed to parse", file, err.message);
      return;
    }

    let modified = false;

    recast.types.visit(ast, {
      visitArrayExpression(path) {
        const parent = path.parentPath && path.parentPath.node;
        if (
          parent &&
          (parent.type === "Property" || parent.type === "ObjectProperty") &&
          parent.key
        ) {
          const key = parent.key;
          const keyName =
            key.type === "Identifier"
              ? key.name
              : key.type === "StringLiteral" || key.type === "Literal"
                ? key.value
                : null;
          if (keyName === "tags") {
            const elems = path.node.elements;
            if (!elems || elems.length === 0) return false;
            const allStrings = elems.every(
              (el) =>
                el && (el.type === "StringLiteral" || el.type === "Literal")
            );
            if (!allStrings) return false;

            const original = elems.map((el) => el.value);
            const sorted = [...original].sort((a, b) => collator.compare(a, b));

            const same =
              original.length === sorted.length &&
              original.every((v, i) => v === sorted[i]);
            if (!same) {
              path.node.elements = sorted.map((s) => t.stringLiteral(s));
              modified = true;
            }
          }
        }
        this.traverse(path);
      },
    });

    if (modified) {
      const output = recast.print(ast).code;
      fs.writeFileSync(file, output, "utf8");
      changedFiles.push(file);
      console.log("Updated", file);
    }
  });

  if (changedFiles.length === 0) {
    console.log("No changes.");
  } else {
    console.log("Updated files:", changedFiles.length);
  }

  return { changedFiles };
}

module.exports = function mainSortTags(dir) {
  return sortTagsInDir(dir);
};

if (require.main === module) {
  module.exports();
}
