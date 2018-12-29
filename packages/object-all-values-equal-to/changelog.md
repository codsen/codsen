# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.4](https://bitbucket.org/codsen/codsen/src/master/packages/object-all-values-equal-to/compare/object-all-values-equal-to@1.3.3...object-all-values-equal-to@1.3.4) (2018-12-29)

**Note:** Version bump only for package object-all-values-equal-to





## [1.3.3](https://bitbucket.org/codsen/codsen/src/master/packages/object-all-values-equal-to/compare/object-all-values-equal-to@1.3.2...object-all-values-equal-to@1.3.3) (2018-12-27)

**Note:** Version bump only for package object-all-values-equal-to





## [1.3.2](https://bitbucket.org/codsen/codsen/src/master/packages/object-all-values-equal-to/compare/object-all-values-equal-to@1.3.1...object-all-values-equal-to@1.3.2) (2018-12-27)

**Note:** Version bump only for package object-all-values-equal-to





## 1.3.1 (2018-12-26)

**Note:** Version bump only for package object-all-values-equal-to





## 1.3.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.2.0 (2018-06-19)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-21)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.

## 1.0.0 (2017-12-13)

### Added

- First public release
