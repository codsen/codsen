# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-11-08
### Changed
- ✨ Rewrote in ES Modules and set up Rollup to serve 3 flavours: 1. CommonJS, 2. UMD and 3. ES Modules.

## [1.2.0] - 2017-09-22
### Changed
- ✨ Dropped JS Standard and switched to raw ESLint on `airbnb-base` preset with override to ban semicolons.

## [1.1.0] - 2017-08-16
### Added
- ✨ `opts.removeThousandSeparatorsFromNumbers` controls the removal of thousand separators. That's in case somebody would want only to pad the digits (`opts.padSingleDecimalPlaceNumbers`) and/or force the decimal notation (`opts.forceUKStyle`)

## 1.0.0 - 2017-08-15
### Added
- ✨ First public release

[2.0.0]: https://github.com/codsen/string-remove-thousand-separators/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/codsen/string-remove-thousand-separators/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/string-remove-thousand-separators/compare/v1.0.0...v1.1.0
