# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.7.0](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.8...ast-get-object@1.7.0) (2019-01-11)


### Features

* Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/commits/4f00871))





# [1.6.0](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.8...ast-get-object@1.6.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/commits/4f00871))

# [1.5.0](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.8...ast-get-object@1.5.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/commits/4f00871))

## [1.4.8](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.7...ast-get-object@1.4.8) (2019-01-02)

**Note:** Version bump only for package ast-get-object

## [1.4.7](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.6...ast-get-object@1.4.7) (2019-01-01)

**Note:** Version bump only for package ast-get-object

## [1.4.6](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.5...ast-get-object@1.4.6) (2018-12-29)

**Note:** Version bump only for package ast-get-object

## [1.4.5](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.4...ast-get-object@1.4.5) (2018-12-29)

**Note:** Version bump only for package ast-get-object

## [1.4.4](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.3...ast-get-object@1.4.4) (2018-12-27)

**Note:** Version bump only for package ast-get-object

## [1.4.3](https://bitbucket.org/codsen/codsen/src/master/packages/ast-get-object/compare/ast-get-object@1.4.2...ast-get-object@1.4.3) (2018-12-27)

**Note:** Version bump only for package ast-get-object

## 1.4.2 (2018-12-26)

**Note:** Version bump only for package ast-get-object

## 1.4.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.3.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.1.0 (2018-05-02)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.0.0 (2018-03-10)

- ✨ First public release
