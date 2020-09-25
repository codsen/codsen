# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.9.15](https://gitlab.com/codsen/codsen/compare/ast-contains-only-empty-space@1.9.14...ast-contains-only-empty-space@1.9.15) (2020-09-24)

**Note:** Version bump only for package ast-contains-only-empty-space





## 1.9.0 (2020-01-26)

### Bug Fixes

- fix algorithm when input is an empty string ([99b046a](https://gitlab.com/codsen/codsen/commit/99b046a1ce96b2719f83595f7981e74081565531))

### Features

- removed one dependency and sped up the program by 200% ([d1053cc](https://gitlab.com/codsen/codsen/commit/d1053cc48db252c87ca0731813958da42757e07c))

## 1.8.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.3.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.1.0 (2018-05-01)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 1.0.0 (2018-03-10)

- First public release
