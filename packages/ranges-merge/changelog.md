# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.2.0] - 2018-05-26

### Improvements

* ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
* ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## [3.1.0] - 2017-12-29

### Added

* ✨ If third argument is `null` on any side being merged, output is always `null`. This will stand for explicit "no" to remove any content to be added. Sibling [libraries](https://github.com/codsen/string-slices-array-push) will tap this feature.

Previously `null` would have been turned into a string and shown/concatenated like that which was meaningless and kindof erroneous. We never used `null` anyway. That's why this is not a major semver bump but minor - it's only feature, an extension of the API.

## [3.0.0] - 2017-12-05

### Changed

* ✨ If you have two ranges where second-one completely overlaps the first-one and the first has third argument, something to insert in its place, that third argument will be discarded upon merge.

Let's say you got these two ranges:

```js
[[5, 6, " "], [1, 10]];
```

Previously, result would be `[1, 10, ' ']`. Now result will be `[1, 10]`. This is logical, because each range should take care to consider its vicinity. If `[1, 10]` came in without instructions to add something in its place, we assume this was intentional.

This change is logical and natural but I'm bumping major version just in case it breaks somebody's unit tests.

## [2.0.0] - 2017-12-04

### Changed

* ✨ Rebased the source in ES Modules
* ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).

## 1.0.0 - 2017-09-18

### New

* First public release

[2.0.0]: https://github.com/codsen/ranges-merge/compare/v1.0.3...v2.0.0
[3.0.0]: https://github.com/codsen/ranges-merge/compare/v2.0.0...v3.0.0
[3.1.0]: https://github.com/codsen/ranges-merge/compare/v3.0.0...v3.1.0
[3.2.0]: https://github.com/codsen/ranges-merge/compare/v3.1.4...v3.2.0
