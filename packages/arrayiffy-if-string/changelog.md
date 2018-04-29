# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.1.0] - 2018-04-29

### Improvements

* ✨ Set up [Prettier](https://prettier.io)
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## [3.0.0] - 2017-11-22

### Changed

* ✨ Rewrote in ES modules, now serving UMD, Common JS and native ES modules builds. Bumping major just in case.
* ✨ Removed JS Standard and switched to raw ESLint on `airbnb-base` preset, with no-semicolon override.

## 1.0.0 - 2017-05-22

### New

* ✨ First public release

[3.0.0]: https://github.com/codsen/arrayiffy-if-string/compare/v1.0.0...v3.0.0
[3.1.0]: https://github.com/codsen/arrayiffy-if-string/compare/v3.0.6...v3.1.0
