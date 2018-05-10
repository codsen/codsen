# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-02-06

### Added

* ✨ `opts.skipIncomingRangeSorting`

## [1.3.0] - 2018-01-10

### Added

* ✨ `opts.returnMatchedRangeInsteadOfTrue`

## [1.2.0] - 2017-11-29

### Added

* ✨ Set up Rollup and now we generate three builds: CommonJS, UMD and ES Modules.
* ✨ Rebased the source to be in ES Modules.

## [1.1.0] - 2017-09-13

### Added

* ✨ If any of the ranges has starting index bigger than ending (like `[2, 1]`), it does not make sense and program will `throw`.
* ✨ Even more unit tests. It does not matter that there's 100% coverage, the more the better, especially testing edge cases.

## 1.0.0 - 2017-09-13

### Added

* ✨ Initial release

[1.4.0]: https://github.com/codsen/ranges-is-index-within/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/ranges-is-index-within/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/ranges-is-index-within/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/ranges-is-index-within/compare/v1.0.0...v1.1.0
