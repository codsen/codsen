# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-05-03

### Improvements

* ✨ Set up [Prettier](https://prettier.io)
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.
* ✨ Stopped transpiling to ES5, dropped Babel and bumped the Node engines to `>=8`

## [1.3.0] - 2017-12-08

### Updated

* ✨ Serving transpiled code now. Node version requirements are way lower, not `6.8.0` as before. I test on Travis against Node `v.4` now.

## [1.2.0] - 2017-11-12

### Updated

* The to the latest API, v.2

## [1.1.0] - 2017-10-09

### Added

* Switched from JS Standard to raw ESLint on `airbnb-base` preset with semicolons off. Linting is way stricter now.
* Added second entry point when calling via CLI: `sortcsv`. Now you can call this library either via `sortcsv` or `csvsort`. Both names will work. Easier to remember.

## 1.0.0 - 2017-08-26

### New

* First public release

[1.4.0]: https://github.com/codsen/csv-sort-cli/compare/v1.3.4...v1.4.0
[1.3.0]: https://github.com/codsen/csv-sort-cli/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/csv-sort-cli/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/csv-sort-cli/compare/v1.0.0...v1.1.0
