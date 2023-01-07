#!/usr/bin/env node

// This script is triggered from one of monorepo packages,
// specifically, CJS packages, such as ESLint plugins.
// It removes the "type": "module" row from the package.json
// just before npm publishing, then sibling script will
// restore it.

import writeFileAtomic from "write-file-atomic";
import fs from "fs";
import path from "path";
import { del } from "edit-package-json";
import { removeTbc } from "../lect/plugins/_util.js";

console.log(`ops/scripts/cjs-on.js`);

const pkgName = path.resolve(".").split("/").pop();

const pkg = fs.readFileSync(path.resolve("package.json"), "utf8");
if (!pkg) {
  throw new Error(
    `ops/scripts/cjs-on.js: couldn't read ${path.resolve("package.json")}`
  );
}
if (!pkgName) {
  throw new Error(
    `ops/scripts/cjs-on.js: something went wrong! pkgName is falsy!`
  );
}
if (pkgName.includes("eslint") && !pkgName.includes("-tbc")) {
  throw new Error(
    `ops/scripts/cjs-on.js: package's folder name (${pkgName}) is missing "-tbc"!`
  );
}
if (pkgName.includes("eslint") && !pkg.includes("-tbc")) {
  throw new Error(
    `ops/scripts/cjs-on.js: ${pkgName} package.json does not include "-tbc"!`
  );
}

// 1. Rename the current, ESM-based package.json into package_bak.json
fs.renameSync(path.resolve("package.json"), path.resolve("package_bak.json"));

// 2. Turn the ESM-based package.json (which we already have in memory) into CJS-based.
let res =
  pkg
    .split(/(\r?\n)/)
    .map((row) => {
      // 2.1. remove "-tbc" part in "<package-name>-tbc" from every row that contains it
      if (
        pkgName.includes("eslint") &&
        row.includes(pkgName) &&
        !row.includes("directory")
      ) {
        return row.replace(pkgName, removeTbc(pkgName));
      }
      // a default - nothing happens
      return row;
    })
    // 2.2. remove "type: module" and any blank lines
    .filter((row) => row.trim() && !row.includes(`"type": "module"`))
    .join("\n")
    .trim() + "\n";

// 3. All our CJS packages are bundled, so let's remove "dependencies"
// and "devDependencies" keys from the package.json — they were meant
// for when this package is in ESM "shape", not when it's published
// as CJS to npm.
res = del(res, "devDependencies");
res = del(res, "dependencies");

writeFileAtomic(path.resolve("package.json"), res);
