# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/compare/regex-empty-conditional-comments@1.2.8...regex-empty-conditional-comments@1.4.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/commits/4f00871))

# [1.3.0](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/compare/regex-empty-conditional-comments@1.2.8...regex-empty-conditional-comments@1.3.0) (2019-01-07)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/commits/4f00871))

## [1.2.8](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/compare/regex-empty-conditional-comments@1.2.7...regex-empty-conditional-comments@1.2.8) (2019-01-02)

**Note:** Version bump only for package regex-empty-conditional-comments

## [1.2.7](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/compare/regex-empty-conditional-comments@1.2.6...regex-empty-conditional-comments@1.2.7) (2019-01-01)

**Note:** Version bump only for package regex-empty-conditional-comments

## [1.2.6](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/compare/regex-empty-conditional-comments@1.2.5...regex-empty-conditional-comments@1.2.6) (2018-12-29)

**Note:** Version bump only for package regex-empty-conditional-comments

## [1.2.5](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/compare/regex-empty-conditional-comments@1.2.4...regex-empty-conditional-comments@1.2.5) (2018-12-29)

**Note:** Version bump only for package regex-empty-conditional-comments

## [1.2.4](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/compare/regex-empty-conditional-comments@1.2.3...regex-empty-conditional-comments@1.2.4) (2018-12-27)

**Note:** Version bump only for package regex-empty-conditional-comments

## [1.2.3](https://bitbucket.org/codsen/codsen/src/master/packages/regex-empty-conditional-comments/compare/regex-empty-conditional-comments@1.2.2...regex-empty-conditional-comments@1.2.3) (2018-12-27)

**Note:** Version bump only for package regex-empty-conditional-comments

## 1.2.2 (2018-12-26)

**Note:** Version bump only for package regex-empty-conditional-comments

## 1.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.0.0 (2018-04-19)

### Added

- ✨ Initial release
