# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2018-05-25

### Improvements

* ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
* ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## [2.0.0] - 2017-11-09

### Changed/Added

* ✨ Numbers are not correctly reported as "non-empty"
* ✨ Some rebasing and improvements to the setup

## [1.4.0] - 2017-09-23

### Added

* ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## [1.3.0] - 2017-09-18

### Added

* ✨ This changelog.
* ✨ Switched from JS Standard to ESLint on `airbnb-base` preset. It's way better.

## 1.0.0 - 2016-12-23

### New

* ✨ First public release

[2.1.0]: https://github.com/codsen/util-nonempty/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/codsen/util-nonempty/compare/v1.4.0...v2.0.0
[1.4.0]: https://github.com/codsen/util-nonempty/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/util-nonempty/compare/v1.3.0...v1.3.0
