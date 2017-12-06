# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0] - 2017-12-05
### Changed
- ✨ If you have two ranges where second-one completely overlaps the first-one and the first has third argument, something to insert in its place, that third argument will be discarded upon merge.

Let's say you got these two ranges:

```js
[
  [5, 6, ' '],
  [1, 10]
]
```

Previously, result would be `[1, 10, ' ']`. Now result will be `[1, 10]`. This is logical, because each range should take care to consider its vicinity. If `[1, 10]` came in without instructions to add something in its place, we assume this was intentional.

This change is logical and natural but I'm bumping major version just in case it breaks somebody's unit tests.

## [2.0.0] - 2017-12-04
### Changed
- ✨ Rebased the source in ES Modules
- ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).

## 1.0.0 - 2017-09-18
### New
- First public release

[3.0.0]: https://github.com/codsen/ranges-merge/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/codsen/ranges-merge/compare/v1.0.3...v2.0.0
