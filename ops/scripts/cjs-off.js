#!/usr/bin/env node

// This script is triggered from one of monorepo packages,
// specifically, CJS packages, such as ESLint plugins.
// It restores the "type": "module" row from the package.json
// and appends "-tbc".

import fs from "fs";
import path from "path";
import writeFileAtomic from "write-file-atomic";
import { set } from "edit-package-json";

console.log(`ops/scripts/cjs-off.js`);

const pkgName = path.resolve(".").split("/").pop();

const pkg = fs.readFileSync(path.resolve("package.json"), "utf8");
const pkg_bak = fs.readFileSync(path.resolve("package_bak.json"), "utf8");
if (!pkg) {
  throw new Error(
    `ops/scripts/cjs-off.js: couldn't read ${path.resolve("package.json")}`
  );
}
if (!pkgName) {
  throw new Error(
    `ops/scripts/cjs-off.js: something went wrong! pkgName is falsy!`
  );
}
if (pkgName.includes("eslint") && !pkgName.includes("-tbc")) {
  throw new Error(
    `ops/scripts/cjs-off.js: package's folder name (${pkgName}) is missing "-tbc"!`
  );
}
if (pkg.includes(`"main": "${pkgName}"`)) {
  throw new Error(
    `ops/scripts/cjs-off.js: ${pkgName} package.json already contains "-tbc" values!`
  );
}

// 1. check, does the backup exist
fs.existsSync(path.resolve("package_bak.json"));
fs.existsSync(path.resolve("package.json"));

// 2. assume the version on CJS "package.json" might have mutated since - grab it
const v = JSON.parse(pkg).version;
if (!v) {
  throw new Error(`045 ops/scripts/cjs-off.js - missing version!`);
}

// 3. delete both
fs.unlinkSync(path.resolve("package.json"));
fs.unlinkSync(path.resolve("package_bak.json"));

// 4. write a new package.json:
const pkg_new = set(pkg_bak, "version", v);
writeFileAtomic(path.resolve("package.json"), pkg_new);
