# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.8.2](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.8.1...util-nonempty@2.8.2) (2019-01-15)

**Note:** Version bump only for package util-nonempty





## [2.8.1](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.8.0...util-nonempty@2.8.1) (2019-01-13)

**Note:** Version bump only for package util-nonempty





# [2.8.0](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.7...util-nonempty@2.8.0) (2019-01-11)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/commits/4f00871))

# [2.7.0](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.7...util-nonempty@2.7.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/commits/4f00871))

# [2.6.0](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.7...util-nonempty@2.6.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/commits/4f00871))

## [2.3.7](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.6...util-nonempty@2.3.7) (2019-01-02)

**Note:** Version bump only for package util-nonempty

## [2.3.6](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.5...util-nonempty@2.3.6) (2019-01-01)

**Note:** Version bump only for package util-nonempty

## [2.3.5](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.4...util-nonempty@2.3.5) (2018-12-29)

**Note:** Version bump only for package util-nonempty

## [2.3.4](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.3...util-nonempty@2.3.4) (2018-12-29)

**Note:** Version bump only for package util-nonempty

## [2.3.3](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.2...util-nonempty@2.3.3) (2018-12-27)

**Note:** Version bump only for package util-nonempty

## [2.3.2](https://bitbucket.org/codsen/codsen/src/master/packages/util-nonempty/compare/util-nonempty@2.3.1...util-nonempty@2.3.2) (2018-12-27)

**Note:** Version bump only for package util-nonempty

## 2.3.1 (2018-12-26)

**Note:** Version bump only for package util-nonempty

## 2.3.0 (2018-10-26)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.2.0 (2018-07-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-25)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

# 2.0.0 (2017-11-09)

### Changed/Added

- ✨ Numbers are not correctly reported as "non-empty"
- ✨ Some rebasing and improvements to the setup

## 1.4.0 (2017-09-23)

### Added

- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## 1.3.0 (2017-09-18)

### Added

- ✨ This changelog.
- ✨ Switched from JS Standard to ESLint on `airbnb-base` preset. It's way better.

## 1.0.0 (2016-12-23)

- ✨ First public release
