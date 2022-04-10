#!/usr/bin/env node

// ==================================
// GENERATES THE MONOREPO ROOT README
// ==================================

import fs from "fs";
import path from "path";

const today = new Date();
const year = today.getFullYear();

// READ ALL LIBS
// =============

const allPackages = fs
  .readdirSync(path.resolve("packages"))
  .filter(
    (packageName) =>
      typeof packageName === "string" &&
      packageName.length &&
      fs.statSync(path.join("packages", packageName)).isDirectory() &&
      fs.statSync(path.join("packages", packageName, "package.json")) &&
      !JSON.parse(
        fs.readFileSync(
          path.join("packages", packageName, "package.json"),
          "utf8"
        )
      ).private
  );

// ASSEMBLE THE TEMPLATE
// =====================

const template = `# Codsen

> A turbo-monorepo of ${allPackages.length} npm packages 📦📦📦

## 📚 Documentation

Please [visit codsen.com](https://codsen.com/os/) for an overview and full documentation of all packages.

## 🛠️ Tech stack

- \`yarn\` — v.1 still, with workspaces
- \`lerna\` + \`conventional-changelogs\` — automates versioning and changelogs
- \`turborepo\` — to run tasks within monorepo
- \`uvu\` + \`c8\` — program unit test runner and code coverage
- \`jest\` + \`cypress\` — web app unit test runner and e2e's
- \`typescript\` — with Project References — for all source code
- \`esbuild\` — to build \`*.ts\` into ESM and IIFE
- \`rollup\` + \`rollup-plugin-dts\` — to generate \`*.d.ts\`
- \`remix\` — drives all web apps here

## 🐛 Issue Tracker

For bugs, feature requests and so on, use the [Issue Tracker](https://github.com/codsen/codsen/issues/new/choose).

## 💼 Licence

MIT License

Copyright (c) 2010-${year} Roy Revelt and other contributors
`;

fs.writeFile("README.md", template, (err) => {
  if (err) {
    throw err;
  }
});
