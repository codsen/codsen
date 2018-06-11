# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.3.0] - 2018-06-11

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## [3.2.0] - 2018-05-26

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## [3.1.0] - 2018-01-10

### Added

- ✨ Updated all dependencies and setup in general

## [3.0.0] - 2017-12-03

### Added

- ✨ Set up Rollup, generating three builds: CommonJS, UMD and ES Modules
- ✨ Rebased the code to be natively in ES Modules

Bumping major just in case this breaks API endpoints.

## [2.1.0] - 2017-09-13

### Added

- ✨ More description in readme.
- ✨ More unit tests, including tests for examples used in readme.

## [2.0.0] - 2017-09-12

### Added

- ✨ `opts.strictlyTwoElementsInRangeArrays` (default is `false`, differently from v1 which is opposite).

## 1.0.0 - 2017-09-11

### Added

- ✨ Initial release

[2.0.0]: https://github.com/codsen/ranges-sort/compare/v1.0.0...v2.0.0
[2.1.0]: https://github.com/codsen/ranges-sort/compare/v2.0.0...v2.1.0
[3.0.0]: https://github.com/codsen/ranges-sort/compare/v2.1.0...v3.0.0
[3.1.0]: https://github.com/codsen/ranges-sort/compare/v3.0.0...v3.1.0
[3.2.0]: https://github.com/codsen/ranges-sort/compare/v3.1.2...v3.2.0
