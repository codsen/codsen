// ==================================
// GENERATES THE MONOREPO ROOT README
// ==================================

import fs from "node:fs";
import path from "node:path";
import {
  IIFE_BROWSER_POLICY,
  iifeGlobalName,
} from "../helpers/browserCompatibility.js";
import { writeGeneratedFile } from "../helpers/generatedFiles.js";

const arguments_ = process.argv.slice(2);
if (arguments_.some((argument) => argument !== "--check")) {
  throw new Error(
    `generate-readme.js: unsupported argument(s): ${arguments_.join(", ")}`,
  );
}
const mode = arguments_.includes("--check") ? "check" : "write";

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
          "utf8",
        ),
      ).private,
  )
  .sort();

// ASSEMBLE THE TEMPLATE
// =====================

const template = `# Codsen

> A turbo-monorepo of ${allPackages.length} npm packages 📦📦📦

## 📚 Documentation

Please [visit codsen.com](https://codsen.com/os/) for an overview and full documentation of all packages.

## 🌐 Browser bundles

Packages whose \`package.json\` declares \`exports.script\` ship a classic-script IIFE at that path and support Chromium ${IIFE_BROWSER_POLICY.minimumMajor} and later. The bundle exposes its named exports on \`window\` under the lower-camel-cased package name: remove each hyphen and uppercase the following character. For example, \`codsen-utils\` uses \`window.${iifeGlobalName("codsen-utils")}\`. The historical \`*.umd.js\` filename is retained for CDN compatibility even though the emitted format is IIFE.

## 🛠️ Tech stack

- \`npm\` — with workspaces
- \`lerna-lite\` + \`conventional-changelogs\` — automates versioning and changelogs
- \`turborepo\` — to run tasks within monorepo
- \`uvu\` + \`c8\` — program unit test runner and code coverage
- \`typescript\` — for all source code
- \`esbuild\` — to build \`*.ts\` into ESM and IIFE
- \`rollup\` + \`rollup-plugin-dts\` — to generate \`*.d.ts\`

## 🐛 Issue Tracker

For bugs, feature requests and so on, use the [Issue Tracker](https://github.com/codsen/codsen/issues/new/choose).

## 💼 Licence

MIT License

Copyright (c) 2010-${year} Roy Revelt and other contributors
`;

await writeGeneratedFile({
  contents: template,
  filename: path.resolve("README.md"),
  fixCommand: "npm run ci:build:root-readme",
  mode,
});
