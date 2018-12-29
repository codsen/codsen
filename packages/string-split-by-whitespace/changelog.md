# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.4](https://bitbucket.org/codsen/codsen/src/master/packages/string-split-by-whitespace/compare/string-split-by-whitespace@1.3.3...string-split-by-whitespace@1.3.4) (2018-12-29)

**Note:** Version bump only for package string-split-by-whitespace





## [1.3.3](https://bitbucket.org/codsen/codsen/src/master/packages/string-split-by-whitespace/compare/string-split-by-whitespace@1.3.2...string-split-by-whitespace@1.3.3) (2018-12-27)

**Note:** Version bump only for package string-split-by-whitespace





## [1.3.2](https://bitbucket.org/codsen/codsen/src/master/packages/string-split-by-whitespace/compare/string-split-by-whitespace@1.3.1...string-split-by-whitespace@1.3.2) (2018-12-27)

**Note:** Version bump only for package string-split-by-whitespace





## 1.3.1 (2018-12-26)

**Note:** Version bump only for package string-split-by-whitespace





## 1.3.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.2.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.1.0 (2018-01-12)

### Added

- ✨ `opts.ignoreRanges`

## 1.0.0 (2018-01-11)

- ✨ First public release
