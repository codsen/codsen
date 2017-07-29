# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.4.0] - 2017-07-29
### Added
- `object-assign` replaced with ES6 `Object.assign`

## [2.3.0] - 2017-06-05
### Updated
- ☝️ Improved some error messages, now outputting both its type and value.

## [2.2.0] - 2017-06-02
### Added
- 🆕 Unit tests covering input arg mutation on all functions that accept objects as input args.
- ☝️ Essential improvements to `findUnused()` - when input is not normalised, that is some of the JSON's have some fields missing and those fields happen to be placeholders on every single other JSON (or missing), now `findUnused()` will report those fields as unused. Previously it was necessary for a key to be present on all arrays to be admitted into a result list, now it's not.

> Last-one means a lot in practice. For example, mapping files are usually under unidirectional merges - they always overwrite everything lower in the "food chain" of data hierarchy. As a result, often PROD mapping data files are often _incomplete_, because we don't want or need to overwrite everything in DEV data. Which in turn means, that if you tried to run `findUnused()` on both your data JSON files (normalised) AND mapping JSON files (not normalised) before this version, you'd rarely get a result at all. Now it's fixed! 👨‍🔧✨

## [2.1.0] - 2017-06-02
### Added
- 🆕 `findUnused()`
### Removed
- Unused dependency from `package.json`

## [2.0.0] - 2017-05-15
### Added
- 🆕 `noNewKeys()`

### Changed
- ☝️ Tightened up the API, there were major changes within dependencies.

## 1.0.0 - 2017-03-18
### Added
- 🆕 First public release
- Unit test coverage is solid 100%

[2.4.0]: https://github.com/codsen/json-comb-core/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/codsen/json-comb-core/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/codsen/json-comb-core/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/codsen/json-comb-core/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/codsen/json-comb-core/compare/v1.0.1...v2.0.0
