# Codsen

> A turbo-monorepo of 112 npm packages 📦📦📦

## 📚 Documentation

Please [visit codsen.com](https://codsen.com/os/) for an overview and full documentation of all packages.

## 🌐 Browser bundles

Packages whose `package.json` declares `exports.script` ship a classic-script IIFE at that path and support Chromium 58 and later. The bundle exposes its named exports on `window` under the lower-camel-cased package name: remove each hyphen and uppercase the following character. For example, `codsen-utils` uses `window.codsenUtils`. The historical `*.umd.js` filename is retained for CDN compatibility even though the emitted format is IIFE.

## 🛠️ Tech stack

- `npm` — with workspaces
- `lerna-lite` + `conventional-changelogs` — automates versioning and changelogs
- `turborepo` — to run tasks within monorepo
- `uvu` + `c8` — program unit test runner and code coverage
- `typescript` — for all source code
- `esbuild` — to build `*.ts` into ESM and IIFE
- `rollup` + `rollup-plugin-dts` — to generate `*.d.ts`

## 🐛 Issue Tracker

For bugs, feature requests and so on, use the [Issue Tracker](https://github.com/codsen/codsen/issues/new/choose).

## 💼 Licence

MIT License

Copyright (c) 2010-2026 Roy Revelt and other contributors
