#!/usr/bin/env node

// This script is triggered from one of monorepo packages,
// specifically, CJS packages, such as ESLint plugins.
// It restores the "type": "module" row from the package.json
// and appends "-tbc".

import writeFileAtomic from "write-file-atomic";
import fs from "fs";
import path from "path";
import { removeTbc } from "../lect/plugins/_util.js";

console.log(`ops/scripts/cjs-off.js`);

const pkgName = path.resolve(".").split("/").pop();

const pkg = fs.readFileSync(path.resolve("package.json"), "utf8");
if (!pkg) {
  throw new Error(
    `ops/scripts/cjs-on.js: couldn't read ${path.resolve("package.json")}`
  );
}
if (!pkgName.includes("-tbc")) {
  throw new Error(
    `ops/scripts/cjs-on.js: package's folder name (${pkgName}) is missing "-tbc"!`
  );
}
if (pkg.includes(`"main": "${pkgName}"`)) {
  throw new Error(
    `ops/scripts/cjs-on.js: ${pkgName} package.json already contains "-tbc" values!`
  );
}

// split by row and process each
const res =
  pkg
    .split(/(\r?\n)/)
    .map((row) => {
      // 1. add "-tbc" part to every reference to package's name
      if (
        row.includes(removeTbc(pkgName)) &&
        !row.includes(`"homepage"`) &&
        !row.includes(`"main"`) &&
        !row.includes("-tbc")
      ) {
        return row.replace(removeTbc(pkgName), pkgName);
      }
      // 2. add the "type: module" row above "main"
      if (row.includes(`"main"`) && !pkg.includes(`"type": "module"`)) {
        return `  "type": "module",\n${row}`;
      }
      // a default - nothing happens
      return row;
    })
    // 2. remove any blank lines
    .filter((row) => row.trim())
    .join("\n")
    .trim() + "\n";

writeFileAtomic(path.resolve("package.json"), res);
