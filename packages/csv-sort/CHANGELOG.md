# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([bbeed3f](https://github.com/codsen/codsen/commit/bbeed3f73497244e4aec8d1b3ff482ce6b531b31))

### BREAKING CHANGES

- previously you'd consume this program like: `import sort from ...` - now: `import { sort } from ...`

## 4.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

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

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.4.0 (2018-12-26)

- ✨ Rebase to point to es modules builds ([8d4635e](https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort/commits/8d4635e))

## 2.3.0 (2018-10-17)

- ✨ Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 2.2.0 (2018-06-14)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 2.0.0 (2017-11-12)

- 🔧 Rewrote in ES Modules and set up the Rollup to generate 3 flavours of it: CommonJS, UMD and ES Modules.

**PS.** Bumping major just in case the Rollup setup messes up somebody's API's (which it shouldn't but let's be on the safe side).

## 1.0.0 (2017-08-22)

- ✨ First public release
