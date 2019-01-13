# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.7.1](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.7.0...object-delete-key@1.7.1) (2019-01-13)

**Note:** Version bump only for package object-delete-key





# [1.7.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.5.7...object-delete-key@1.7.0) (2019-01-11)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/commits/4f00871))

# [1.6.0](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.5.7...object-delete-key@1.6.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/commits/4f00871))

## [1.5.7](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.5.6...object-delete-key@1.5.7) (2019-01-02)

**Note:** Version bump only for package object-delete-key

## [1.5.6](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.5.5...object-delete-key@1.5.6) (2019-01-01)

**Note:** Version bump only for package object-delete-key

## [1.5.5](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.5.4...object-delete-key@1.5.5) (2018-12-29)

**Note:** Version bump only for package object-delete-key

## [1.5.4](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.5.3...object-delete-key@1.5.4) (2018-12-29)

**Note:** Version bump only for package object-delete-key

## [1.5.3](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.5.2...object-delete-key@1.5.3) (2018-12-27)

**Note:** Version bump only for package object-delete-key

## [1.5.2](https://bitbucket.org/codsen/codsen/src/master/packages/object-delete-key/compare/object-delete-key@1.5.1...object-delete-key@1.5.2) (2018-12-27)

**Note:** Version bump only for package object-delete-key

## 1.5.1 (2018-12-26)

**Note:** Version bump only for package object-delete-key

## 1.5.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.4.0 (2018-06-19)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.3.0 (2018-05-25)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.2.0 (2018-03-11)

### Added

- ✨ Updated all dependencies
- ✨ Switched from deprecated [posthtml-ast-is-empty](https://bitbucket.org/codsen/posthtml-ast-is-empty) to [ast-is-empty](https://bitbucket.org/codsen/ast-is-empty)

## 1.1.0 (2017-10-30)

### Added

- ✨ Now accepts globs everywhere, see [matcher](https://github.com/sindresorhus/matcher)'s API which is driving the globbing. This comes from [ast-monkey](https://bitbucket.org/codsen/ast-monkey) tapping `matcher`.

## 1.0.0 (2017-10-23)

### Released

- ✨ First public release
