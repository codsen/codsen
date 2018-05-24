# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-05-23

### Added

* ✨ Unit tests. First time ever I pulled off completely async test files, [writen](https://github.com/sindresorhus/tempy) in some random temporary folder somewhere within the system folders. This is first the first CLI app of mine that has proper unit tests.
* ✨ Input is deeply traversed now and all plain objects no matter how deep are sorted.
* ✨ Removed Babel and whole transpiling process.
* ✨ Removed [Listr](https://www.npmjs.com/package/listr) and silent mode option. Silent mode is the only and default mode now.
* ✨ Removed `package-lock.json` and `.editorconfig`
* ✨ Set up [Prettier](https://prettier.io/)

## [1.3.0] - 2018-01-30

### Added

* ✨ `-s` or `--silent` flag. When enabled, shows only one row out output. Handy when there are many files.

## [1.2.0] - 2017-12-14

### Added

* ✨ Now if input contains only folder's name, non-JSON's are filtered-out. Basically, now this CLI is dumb-proofed, you can feed any paths and globs, containing or not containing JSON's.

## [1.1.0] - 2017-12-11

### New

* ✨ Now serving transpiled code, aiming at Node `v.4`

## 1.0.0 - 2017-10-12

### New

* First public release

[1.1.0]: https://github.com/codsen/json-sort-cli/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/codsen/json-sort-cli/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/json-sort-cli/compare/v1.2.0...v1.3.0
[1.4.0]: https://github.com/codsen/json-sort-cli/compare/v1.3.0...v1.4.0
