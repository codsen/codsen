#!/usr/bin/env node

// This script is triggered from one of monorepo packages,
// specifically, CJS packages, such as ESLint plugins.
// It removes the "type": "module" row from the package.json
// just before npm publishing, then sibling script will
// restore it.

import writeFileAtomic from "write-file-atomic";
import fs from "fs";
import path from "path";
import { removeTbc } from "../lect/plugins/_util.js";

console.log(`ops/scripts/cjs-on.js`);

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
if (!pkg.includes("-tbc")) {
  throw new Error(
    `ops/scripts/cjs-on.js: ${pkgName} package.json does not include "-tbc"!`
  );
}

// split by row and process each
const res =
  pkg
    .split(/(\r?\n)/)
    .map((row) => {
      // 1. remove "-tbc" part in "<package-name>-tbc" from every row that contains it
      if (row.includes(pkgName) && !row.includes("directory")) {
        return row.replace(pkgName, removeTbc(pkgName));
      }
      // a default - nothing happens
      return row;
    })
    // 2. remove "type: module" and any blank lines
    .filter((row) => row.trim() && !row.includes(`"type": "module"`))
    .join("\n")
    .trim() + "\n";

writeFileAtomic(path.resolve("package.json"), res);
