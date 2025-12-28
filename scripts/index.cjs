#!/usr/bin/env node

try {
  const sort = require("./src/sort.cjs");
  sort();
} catch (e) {
  console.error(e);
  process.exit(1);
}
