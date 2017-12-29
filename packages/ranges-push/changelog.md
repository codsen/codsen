# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.2.0] - 2017-12-29
### Added
- ✨ When third argument is `null`, any merged range results will have there `null`.

## [2.1.0] - 2017-12-20
### Added
- ✨ `opts.limitToBeAddedWhitespace` - makes life easier when cleaning HTML. Now, chunk ranges can contain any amount of whitespace - the `current()` will run `string-collapse` on the to-be-inserted, third argument. Now, if there are any line breaks among the whitespace characters, the result will be a single line break instead. Basically, when this setting is active, only space or linebreak will be inserted in place of deleted range.

What this feature gives you is you can activate it and freely push chunks of string in, extracting whitespace along it and pushing it too. You don't need to care about excessive amount of it - this library will truncate it automatically. It's very handy when stripping strings from [HTML tags](https://github.com/codsen/string-strip-html) for example.

## [2.0.0] - 2017-12-05
### Changed
- ✨ Rewrite in ES modules
- ✨ Now serving three builds: CommonJS, UMD and ES modules, all wired up to appropriate end-points on `package.json`

### Added
- ✨ If you have two ranges where second-one completely overlaps the first-one and the first has third argument, something to insert in its place, that third argument will be discarded upon merge.

Let's say you got these two ranges:

```js
[
  [5, 6, ' '],
  [1, 10]
]
```

Previously, result would be `[1, 10, ' ']`. Now result will be `[1, 10]`. This is logical, because each range should take care to consider its vicinity. If `[1, 10]` came in without instructions to add something in its place, we assume this was intentional.

## [1.6.0] - 2017-09-25
### Changed
- ✨ Actually serving the transpiled version as default. Sorry about that. Now the transpiled source is wired to `package.json` `main`. The proper Rollup setup (UMD, ESJ and ESM builds) is in coming next.

## [1.5.0] - 2017-09-18
### Changed
- ✨ Separated the merging function into a separate library, [ranges-merge](https://github.com/codsen/ranges-merge).

## [1.4.0] - 2017-09-12
### Added
- ✨ Separated ranges sorting function into a [separate library](https://github.com/codsen/ranges-sort) because it will be needed in [Detergent](https://github.com/codsen/detergent).
- ✨ Replaced JS Standard with ESLint on `airbnb-base` config with two exceptions: 1. no semicolons and 2. allow plus-plus in `for`-loops. For posterity JS Standard has been neglected by its maintainers, currently it's using half-year old version of ESLint, and doesn't tap to majority of its rules. After activating ESLint, it found some style issues that needed fixing. I like that.

## [1.3.0] - 2017-08-30
### Added
- ✨ Transpiled version is available from the folder `/es5/`.

## [1.2.0] - 2017-08-16
### Fixed
- 🔧 The input validation was not passing through the zero indexes for `.add()` because natural number checks were not including zero. Sorted now.

## [1.1.0] - 2017-07-31
### Added
- ✨ An improvement to the algorithm which doesn't change API: sorting and merging is now done upon querying `.current()`, not during `.add()`. This guarantees maximum data precision, especially if you don't do any `.add()` after calling `.current()` and processing the slices array using [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array).

## 1.0.0 - 2017-07-28
### New
- First public release

[2.2.0]: https://github.com/codsen/string-slices-array-push/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/codsen/string-slices-array-push/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/codsen/string-slices-array-push/compare/v1.6.0...v2.0.0
[1.6.0]: https://github.com/codsen/string-slices-array-push/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/codsen/string-slices-array-push/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/codsen/string-slices-array-push/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/string-slices-array-push/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/string-slices-array-push/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/string-slices-array-push/compare/v1.0.0...v1.1.0
