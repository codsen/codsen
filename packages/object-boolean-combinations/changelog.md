# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.10.1](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.10.0...object-boolean-combinations@2.10.1) (2019-01-13)

**Note:** Version bump only for package object-boolean-combinations





# [2.10.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.6...object-boolean-combinations@2.10.0) (2019-01-11)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/commits/4f00871))

# [2.9.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.6...object-boolean-combinations@2.9.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/commits/4f00871))

# [2.8.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.6...object-boolean-combinations@2.8.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/commits/4f00871))

# [2.6.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.6...object-boolean-combinations@2.6.0) (2019-01-07)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/commits/4f00871))

## [2.5.6](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.5...object-boolean-combinations@2.5.6) (2019-01-02)

**Note:** Version bump only for package object-boolean-combinations

## [2.5.5](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.4...object-boolean-combinations@2.5.5) (2019-01-01)

**Note:** Version bump only for package object-boolean-combinations

## [2.5.4](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.3...object-boolean-combinations@2.5.4) (2018-12-29)

**Note:** Version bump only for package object-boolean-combinations

## [2.5.3](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.2...object-boolean-combinations@2.5.3) (2018-12-29)

**Note:** Version bump only for package object-boolean-combinations

## [2.5.2](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.1...object-boolean-combinations@2.5.2) (2018-12-27)

**Note:** Version bump only for package object-boolean-combinations

## [2.5.1](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/compare/object-boolean-combinations@2.5.0...object-boolean-combinations@2.5.1) (2018-12-27)

**Note:** Version bump only for package object-boolean-combinations

# 2.5.0 (2018-12-26)

### Features

- allow any types in override object key values ([af4f99d](https://bitbucket.org/codsen/codsen/src/master/packages/object-boolean-combinations/commits/af4f99d))

## 2.4.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.3.0 (2018-07-25)

- ✨ Allow override object key values to be of any type
- ✨ Small improvements to the setup

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-17)

### Changed

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rules, dropped `airbnb-base`
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.0.0 (2017-12-12)

### Changed

- ✨ Rebased the source in ES Modules
- ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).
- ✨ Small tweaks to the code, no changes to the API.

Bumping the major version just in case it breaks something. But it should not.
