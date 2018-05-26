# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.1.0] - 2018-05-26

### Improvements

* ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
* ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## [4.0.0] - 2017-12-12

### Changed

* ✨ Rebased in ES Modules
* ✨ Set up Rollup. Now we generate three builds: CommonJS, UMD and ES Modules.
* ✨ Major setup overhaul and deps refresh.

## [3.1.0] - 2017-05-12

### Added

* ✨ `opts.flattenArraysContainingStringsToBeEmpty` now lets you flatten object values which have arrays which have strings into empty arrays. This is important. Trust me. No, seriously.

## 3.0.0 - 2017-03-17

### Changed

* ✨ Recoded all the core, improving the algorithm and making everything cleaner (hope so).
* ✨ Pinned JS Standard not to be the latest, to avoid sudden linting issues coming from nowhere and blocking builds when a new version of JS Standard is released.

### Added

* ✨ Even more tests.

### Unchanged

* ✨ Unit test coverage is still a solid 100%.

[3.0.0]: https://github.com/codsen/object-flatten-all-arrays/compare/v2.0.0...v3.0.0
[3.1.0]: https://github.com/codsen/object-flatten-all-arrays/compare/v3.0.0...v3.1.0
[4.0.0]: https://github.com/codsen/object-flatten-all-arrays/compare/v3.1.0...v4.0.0
[4.1.0]: https://github.com/codsen/object-flatten-all-arrays/compare/v4.0.6...v4.1.0
