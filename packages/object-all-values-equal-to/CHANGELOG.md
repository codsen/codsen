# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.16](https://github.com/codsen/codsen/compare/object-all-values-equal-to@2.0.15...object-all-values-equal-to@2.0.16) (2021-04-14)

**Note:** Version bump only for package object-all-values-equal-to





## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([4190a84](https://github.com/codsen/codsen/commit/4190a849df5ed2c76fc08e44199cfb41bee45857))

### BREAKING CHANGES

- previously: `import allEq from ...` - now `import { allEq } from ...`

## 1.9.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.8.0 (2019-10-02)

### Features

- remove option checking to make things run faster ([296989f](https://gitlab.com/codsen/codsen/commit/296989f))

## 1.7.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.2.0 (2018-06-19)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-21)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.

## 1.0.0 (2017-12-13)

- ✨ First public release
