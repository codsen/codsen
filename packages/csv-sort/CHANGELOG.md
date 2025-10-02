# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.0.26 (2025-10-02)

**Note:** Version bump only for package csv-sort

## 7.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 6.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 6.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 5.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([bbeed3f](https://github.com/codsen/codsen/commit/bbeed3f73497244e4aec8d1b3ff482ce6b531b31))

### BREAKING CHANGES

- previously you'd consume this program like: `import sort from ...` - now: `import { sort } from ...`

## 4.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 3.1.0 (2020-09-27)

### Features

- fixture mangling prevention using SHA hashes, 100% cov and some rebase ([0973579](https://gitlab.com/codsen/codsen/commit/0973579ca57df0d2f641ff4a4fea2f6951b4f6fe))

## 3.0.37 (2019-10-05)

### Performance Improvements

- removal dependency ordinal ([e8cd758](https://gitlab.com/codsen/codsen/commit/e8cd758))

## 2.7.0 (2019-02-26)

### Features

- Switch to currency.js ([0c2521b](https://gitlab.com/codsen/codsen/commit/0c2521b))

## 2.6.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.4.0 (2018-12-26)

- Rebase to point to es modules builds ([8d4635e](https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort/commits/8d4635e))

## 2.3.0 (2018-10-17)

- Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 2.2.0 (2018-06-14)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-03)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 2.0.0 (2017-11-12)

- 🔧 Rewrote in ES Modules and set up the Rollup to generate 3 flavours of it: CommonJS, UMD and ES Modules.

**PS.** Bumping major just in case the Rollup setup messes up somebody's API's (which it shouldn't but let's be on the safe side).

## 1.0.0 (2017-08-22)

- First public release
