# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.6.0] - 2017-09-25
### Changed
- ✨ Actually serving the transpiled version as default. Sorry about that. Now the transpiled source is wired to `package.json` `main`. The proper Rollup setup (UMD, ESJ and ESM builds) is in coming next.

## [1.5.0] - 2017-09-18
### Changed
- ✨ Separated the merging function into a separate library, [ranges-merge](https://github.com/codsen/ranges-merge).

## [1.4.0] - 2017-09-12
### Added
- ✨ Separated ranges sorting function into a [separate library](https://github.com/codsen/ranges-sort) because it will be needed in [Detergent](https://github.com/codsen/detergent).
- ✨ Replaced JS Standard with ESLint on `airbnb-base` config with two exceptions: 1. no semicolons and 2. allow plus-plus in `for`-loops. For posterity JS Standard has been neglected by its maintainers, currently it's using half-year old version of ESLint, and doesn't tap to majority of its rules. After activating ESLint, it found some style issues that needed fixing. I like that.

## [1.3.0] - 2017-08-30
### Added
- ✨ Transpiled version is available from the folder `/es5/`.

## [1.2.0] - 2017-08-16
### Fixed
- 🔧 The input validation was not passing through the zero indexes for `.add()` because natural number checks were not including zero. Sorted now.

## [1.1.0] - 2017-07-31
### Added
- ✨ An improvement to the algorithm which doesn't change API: sorting and merging is now done upon querying `.current()`, not during `.add()`. This guarantees maximum data precision, especially if you don't do any `.add()` after calling `.current()` and processing the slices array using [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array).

## 1.0.0 - 2017-07-28
### New
- First public release

[1.6.0]: https://github.com/codsen/string-slices-array-push/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/codsen/string-slices-array-push/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/codsen/string-slices-array-push/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/string-slices-array-push/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/string-slices-array-push/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/string-slices-array-push/compare/v1.0.0...v1.1.0
