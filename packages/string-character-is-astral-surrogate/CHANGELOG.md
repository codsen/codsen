# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.2.1 (2026-09-01)

### Bug Fixes

- allow omitted surrogate inputs ([ae1f614](https://github.com/codsen/codsen/commit/ae1f6146d4a1e6e868e2612934bcc5e5dec95967))

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 3.2.0 (2026-08-19)

### Bug Fixes

- add throw identifiers to surrogate validation ([511ddce](https://github.com/codsen/codsen/commit/511ddce7dc70343d6ca87342992bc11c6cbdd400))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Performance Improvements

- Recorded a 2.37% higher normalized benchmark score than v3.1.3 (38208905 → 39116155).

## 3.1.3 (2026-01-15)

### Performance Improvements

- Recorded a 6.93% higher normalized benchmark score than v3.0.21 (35734135 → 38208905).

## 3.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 2.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 2.0.14 (2022-07-05)

### Performance Improvements

- Recorded a 16.69% higher normalized benchmark score than v2.0.13 (100048501 → 116746982).

## 2.0.12 (2022-01-22)

### Performance Improvements

- Recorded a 11.67% higher normalized benchmark score than v2.0.11 (114510771 → 127876612).

## 2.0.11 (2022-01-11)

### Performance Improvements

- Recorded a 4.98% higher normalized benchmark score than v2.0.10 (109083499 → 114510771).

## 2.0.9 (2021-12-24)

### Performance Improvements

- Recorded a 2.4% higher normalized benchmark score than v2.0.8 (158948805 → 162756456).

## 2.0.8 (2021-12-24)

### Performance Improvements

- Recorded a 47.05% higher normalized benchmark score than v2.0.7 (108091634 → 158948805).

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 1.13.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.12.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.12.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.12.0 (2021-01-23)

### Features

- rewrite in TS ([c2aa395](https://github.com/codsen/codsen/commit/c2aa395e1787c0607be09eabccecbf8a5a641d5b))

## 1.11.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.10.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-10-25)

- Update all dependencies
- Restore coveralls.io reporting
- Restore unit test linting

## 1.3.0 (2018-06-16)

- Tweaks to the setup: added comment removal during Rollup build and dependency updates

## 1.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-26)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Remove `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.0.0 (2018-03-01)

- First public release
