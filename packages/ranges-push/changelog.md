# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2017-08-16
### Fixed
- 🔧 The input validation was not passing through the zero indexes for `.add()` because natural number checks were not including zero. Sorted now.

## [1.1.0] - 2017-07-31
### Added
- ✨ An improvement to the algorithm which doesn't change API: sorting and merging is now done upon querying `.current()`, not during `.add()`. This guarantees maximum data precision, especially if you don't do any `.add()` after calling `.current()` and processing the slices array using [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array).

## 1.0.0 - 2017-07-28
### New
- First public release

[1.2.0]: https://github.com/codsen/string-slices-array-push/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/string-slices-array-push/compare/v1.0.0...v1.1.0
