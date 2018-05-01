# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.3.0] - 2018-05-02

### Added

* ✨ Set up [Prettier](https://prettier.io)
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## [3.2.0] - 2018-02-11

### Updated

* ✨ All matching is now case-sensitive.

## [3.1.0] - 2017-12-22

### Updated

* ✨ Tapped [`ast-monkey-traverse`](https://github.com/codsen/ast-monkey-traverse) directly. No need for the whole [`ast-monkey`](https://github.com/codsen/ast-monkey).

## [3.0.0] - 2017-12-14

### Updated

* ✨ Rebased in ES Modules
* ✨ Set up Rollup to generate three builds: a transpiled CommonJS, ES Modules and UMD.

The API is slightly relaxed now - you can set any types now. As long as you feed them as third argument and within array, it's fine. Previously, all values had to be string-type.

## [2.1.0] - 2017-06-18

### Updated

* 🔧 Add deps, particularly, [ast-monkey](https://github.com/codsen/ast-monkey).
* 🔧 Some minor rebase tweaks to the code.

## [2.0.0] - 2017-05-22

### Changed

* 🔧 Recoded everything from scratch - switched to [ast-monkey](https://github.com/codsen/ast-monkey#traverse), which does all the heavy lifting (traversal etc).

### Unchanged

* ✨ Unit test code coverage is solid 100%

There should not be breaking API changes, but I bumped the version just in case 😋

## [1.4.0] - 2017-02-20

### Updated

* 🔧 Readme
* 🔧 Unit tests to reach 100% coverage

## [1.3.0] - 2016-12-23

### Added

* ✨ JS Standard precommit hook
* ✨ Unit test coverage

## [1.2.0] - 2016-10-24

### Changed

* ✨ Removed redundant dep

## 1.0.0 - 2016-10-24

### New

* ✨ First public release

[1.2.0]: https://github.com/codsen/ast-get-values-by-key/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/ast-get-values-by-key/compare/v1.2.0...v1.3.0
[1.4.0]: https://github.com/codsen/ast-get-values-by-key/compare/v1.3.0...v1.4.0
[2.0.0]: https://github.com/codsen/ast-get-values-by-key/compare/v1.4.0...v2.0.0
[2.1.0]: https://github.com/codsen/ast-get-values-by-key/compare/v2.0.0...v2.1.0
[3.0.0]: https://github.com/codsen/ast-get-values-by-key/compare/v2.1.0...v3.0.0
[3.1.0]: https://github.com/codsen/ast-get-values-by-key/compare/v3.0.0...v3.1.0
[3.2.0]: https://github.com/codsen/ast-get-values-by-key/compare/v3.1.4...v3.2.0
[3.3.0]: https://github.com/codsen/ast-get-values-by-key/compare/v3.2.0...v3.3.0
