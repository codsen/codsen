# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2018-05-18

Complete rewrite.

### Added

* ✨ `opts.stripOnlyTags` - you can request only certain tags to be removed. Respects `opts.stripTogetherWithTheirContents` setting.
* ✨ Works with custom tags, as long as there is no space after the opening bracket.

## [1.5.0] - 2018-05-14

### Improved

* ✨ Improved HTML tag detection algorithm: now, if digit (with or without whitespace in front) follows the opening bracket, it's interpretes as definitely not an opening bracket of a tag.
* ✨ Various setup tweaks

## [1.4.0] - 2018-05-11

### Improved

* ✨ Set up [Prettier](https://prettier.io)
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
* ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## [1.3.0] - 2018-02-19

### Added

* ✨ Now strips HTML comments too.

## [1.2.0] - 2017-12-31

### Improved

* ✨ Improvements to `opts.stripTogetherWithTheirContents` and done a lot of rebasing.

## [1.1.0] - 2017-12-07

### Added

* ✨ `opts.stripTogetherWithTheirContents`

## 1.0.0 - 2017-11-27

### Added

* ✨ First public release

[1.1.0]: https://github.com/codsen/string-strip-html/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/codsen/string-strip-html/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/string-strip-html/compare/v1.2.6...v1.3.0
[1.4.0]: https://github.com/codsen/string-strip-html/compare/v1.3.2...v1.4.0
[1.5.0]: https://github.com/codsen/string-strip-html/compare/v1.4.0...v1.5.0
[2.0.0]: https://github.com/codsen/string-strip-html/compare/v1.5.0...v2.0.0
