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

## [2.0.0] - 2017-12-13

### Changed

* ✨ Rebased in ES Modules
* ✨ Set up Rollup. Now we serve three builds: CommonJS, UMD and ES Module.

## [1.2.0] - 2017-09-20

### Changed

* Dropped JS Standard and switched to raw ESLint on `airbnb-base` preset. Of course, with overrides to ban semicolons and allow plus-plus in loops.

## [1.1.0] - 2017-08-09

### Removed

* Replaced `object-assign` with native ES6 `Object.assign`
* We don't need `lodash.clonedeep` either, we can just Object.assign onto a empty object literal because Object.assign sources are not mutated.

## 1.0.0 - 2017-06-13

### New

* Public release

[2.1.0]: https://github.com/codsen/util-array-object-or-both/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/codsen/util-array-object-or-both/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/codsen/util-array-object-or-both/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/util-array-object-or-both/compare/v1.0.0...v1.1.0
