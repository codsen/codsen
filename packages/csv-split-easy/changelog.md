# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2018-03-06
### Added
- ✨ PR [#3](https://github.com/codsen/csv-split-easy/pull/3) from [@mac-](https://github.com/mac-) now caters double quotes wrapping double quotes, used as a means of escaping code
- 🔧 Updated dependencies. Rollup is continuously improving and build sizes are getting smaller.

## [2.0.0] - 2017-11-08
### Added
- ✨ Rewrote in ES modules, set up the Rollup
- ✨ Removes Standard and set up raw ESLint on `airbnb-base` config with semicolons off
- ✨ Additional checks on options object

## [1.3.0] - 2017-08-16
### Added
- ✨ `opts.removeThousandSeparatorsFromNumbers`. On by default. That's [string-remove-thousand-separators](https://github.com/codsen/string-remove-thousand-separators) internally doing it.
- ✨ `opts.padSingleDecimalPlaceNumbers`. On by default. `10.2` → `10.20`.
- ✨ `opts.forceUKStyle`. Off by default. `10,15` → `10.15`.

## [1.2.0] - 2017-08-13
### Added
- ✨ Skips empty rows, where each column within the row contains only empty space.

## [1.1.0] - 2017-08-13
### Added
- ✨ Automatic trimming of all leading and trailing whitespace. Some IDE's (like Atom) add a trailing empty line at the end of a file. If you opened a CSV and saved it over, such IDE's would a trailing empty line. `csv-split-easy` automatically trims all whitespace in front and in the end of an incoming string now, so such whitespace should not be an issue now.

## 1.0.0 - 2017-08-13
### New
- First public release

[2.1.0]: https://github.com/codsen/csv-split-easy/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/codsen/csv-split-easy/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/codsen/csv-split-easy/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/csv-split-easy/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/csv-split-easy/compare/v1.0.2...v1.1.0
