# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2018-05-26

### Improvements

* ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
* ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## [2.0.0] - 2017-11-08

### Changed

* ✨ Rewrote in ES Modules and set up Rollup to serve 3 flavours: 1. CommonJS, 2. UMD and 3. ES Modules.

## [1.2.0] - 2017-09-22

### Changed

* ✨ Dropped JS Standard and switched to raw ESLint on `airbnb-base` preset with override to ban semicolons.

## [1.1.0] - 2017-08-16

### Added

* ✨ `opts.removeThousandSeparatorsFromNumbers` controls the removal of thousand separators. That's in case somebody would want only to pad the digits (`opts.padSingleDecimalPlaceNumbers`) and/or force the decimal notation (`opts.forceUKStyle`)

## 1.0.0 - 2017-08-15

### Added

* ✨ First public release

[2.1.0]: https://github.com/codsen/string-remove-thousand-separators/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/codsen/string-remove-thousand-separators/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/codsen/string-remove-thousand-separators/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/string-remove-thousand-separators/compare/v1.0.0...v1.1.0
