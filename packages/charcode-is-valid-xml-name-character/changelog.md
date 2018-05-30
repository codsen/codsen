# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-05-31

### Improvements

- ✨ I found myself looking again and again at the spec, double-checking which function name `isProduction4` or `isProduction4a` is for the first character, which is for second character onwards. To make life easier, I decided to supplement exported function with aliase keys `validFirstChar` and `validSecondCharOnwards` which are the same functions but named more sensibly.

## [1.3.0] - 2018-05-03

### Improvements

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## [1.2.0] - 2018-02-16

### Added

- ✨ First checking lowercase letters, then the rest.

## [1.1.0] - 2018-02-06

### New

- ✨ Tapped the dependency [ranges-is-index-within](https://github.com/codsen/ranges-is-index-within) with sorting turned off to save resources. (`opts.skipIncomingRangeSorting` setting)

## 1.0.0 - 2018-02-05

### New

- ✨ First public release

[1.1.0]: https://github.com/codsen/charcode-is-valid-xml-name-character/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/codsen/charcode-is-valid-xml-name-character/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/charcode-is-valid-xml-name-character/compare/v1.2.0...v1.3.0
[1.4.0]: https://github.com/codsen/charcode-is-valid-xml-name-character/compare/v1.3.0...v1.4.0
