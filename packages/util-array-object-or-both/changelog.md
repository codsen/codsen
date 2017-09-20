# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2017-09-20
### Changed
- Dropped JS Standard and switched to raw ESLint on `airbnb-base` preset. Of course, with overrides to ban semicolons and allow plus-plus in loops.

## [1.1.0] - 2017-08-09
### Removed
- Replaced `object-assign` with native ES6 `Object.assign`
- We don't need `lodash.clonedeep` either, we can just Object.assign onto a empty object literal because Object.assign sources are not mutated.

## 1.0.0 - 2017-06-13
### New
- Public release

[1.2.0]: https://github.com/codsen/util-array-object-or-both/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/util-array-object-or-both/compare/v1.0.0...v1.1.0
