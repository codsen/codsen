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

## [2.0.0] - 2017-12-03

### Changed

* ✨ Rebased the source to be in ES modules
* ✨ Set up Rollup to generate three flavours: CommonJS, UMD and native ES Modules (source)
* ✨ Removed JS Standard because it's a wrapper and therefore it sucks. Switched to raw ESLint on `airbnb-base` preset and turned off semicolons. Fixed all newly-found issues.
* ✨ Updated many other files including readme.

## 1.0.0 - 2017-03-23

### New

* ✨ First public release

[2.0.0]: https://github.com/codsen/str-indexes-of-plus/compare/v1.0.3...v2.0.0
[2.1.0]: https://github.com/codsen/str-indexes-of-plus/compare/v2.0.5...v2.1.0
