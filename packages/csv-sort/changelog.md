# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2018-05-03

### Improvements

* ✨ Set up [Prettier](https://prettier.io)
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## [2.0.0] - 2017-11-12

### Changed

* ✨ Rewrote in ES Modules and set up the Rollup to generate 3 flavours of it: CommonJS, UMD and ES Modules.

Bumping major just in case the Rollup setup messes up somebody's API's (which it shouldn't but let's be on the safe side).

## 1.0.0 - 2017-08-22

### New

* ✨ First public release

[2.0.0]: https://github.com/codsen/csv-sort/compare/v1.0.4...v2.0.0
[2.1.0]: https://github.com/codsen/csv-sort/compare/v2.0.6...v2.1.0
