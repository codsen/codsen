# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2018-05-02

### Added

* ✨ Set up [Prettier](https://prettier.io)
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## [1.1.0] - 2018-01-03

### Added

* ✨ New key in the `innerObj` callback - `innerObj.path`. It's interoperable with [object-path](https://www.npmjs.com/package/object-path).

## 1.0.1 - 2017-12-22

### New

* ✨ First public release.

[1.1.0]: https://github.com/codsen/ast-monkey-traverse/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/codsen/ast-monkey-traverse/compare/v1.1.3...v1.2.0
