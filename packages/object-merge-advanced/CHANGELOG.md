# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [6.4.0] - 2017-06-02
### Changed
- Slightly rebased so that there's 100% branch coverage too, not only statements/lines.

## [6.3.0] - 2017-05-15
### Added
- Switched to [check-types-mini](https://www.npmjs.com/package/check-types-mini); removed all existing functions responsible for options' types.

## [6.2.0] - 2017-05-12
### Added
- opts.mergeArraysContainingStringsToBeEmpty

## [6.1.0] - 2017-04-23 weekend
### Added
- When the options object values are set to be of a wrong type, this library will throw an error. At the same time, we're trying to be as flexible as possible - for example, accepting single string value instead of array.
- new options setting, `opts.ignoreKeys` - this is one direction merge. Key names accept wildcards.
- new options setting, `opts.hardMergeKeys` - this is also one direction (opposive of above) merge. Key names accept wildcards.
### Unchanged
- Coverage is kept 100%. That does not mean much but hey.

### PS.
It took nearly whole weekend on and off to get this out. Bloody leading wildcard [bug](https://github.com/deltreey/wildstring/issues/2) kept poking out until I switched to [matcher](https://www.npmjs.com/package/matcher), problem solved.

It's nice to use the modular way of coding JS: I found bug here on this library with leading wildcards, but it was coming from dependency, another of mine, [array-includes-with-glob](https://github.com/codsen/array-includes-with-glob), which in turn was bugged by buggy [wildstring](https://github.com/deltreey/wildstring). I swapped its dependencies, updated `object-merge-advanced` (this library) and tests passed again.

Like changing a broken carburettor with another, working-one. 🎉

## [6.0.0] - 2017-03-14
### Changed
- Recoded everything, adding Number type. This means, now there are 100 possibilities of the merge. Looks even more clean and optimal now, but that's a subjective thing.

## [5.0.0] - 2017-03-13
### API addition
- Added an optional options object, the third argument. Now `opts.mergeObjectsOnlyWhenKeysetMatches` allow more granular control over how objects within arrays are merged. The default setting is balanced option, `opts.mergeObjectsOnlyWhenKeysetMatches = false` is more _gung-ho_ merging approach (behaviour like v4, previous version).

## [4.2.0] - 2017-03-03
### Changed
- Updated dependencies, now requesting JS Standard as normal version range, to prevent future surprises.

## [4.1.0] - 2017-02-28
### Changed
- Improved the algorithm, removed redundant insurance, cloning input variable.

## [4.0.0] - 2017-02-28
### Changed
- Making API even more user-friendly. If one of the input args is missing, instead of returning the `undefined` now it's returning the argument that's present. What's the point to return `undefined`?

If none are present, `undefined` is returned as before.

## [3.0.0] - 2017-02-28
### Changed
- Technically a major API change. When object key values are arrays now we're checking is _merger's_ element already present in a _mergee_. If so, it's omitted. This means, you can safely merge similar arrays without them bloating. However, in theory, while it's very logical and necessary feature, it's also a major API change. Hence bumping to v.3.

By the way, I needed this myself, placeholder default values in merged JSON files otherwise get duplicated. Now it's how it should be. 🍺

## [2.0.0] - 2017-02-23
### Changed
- Major API change. Input argument objects are not mutated any more. Function first clones what it later uses.
- Adding tests for input argument mutation (`3.x` group).
- All auxiliary functions are ported inside the main exported function. Looks cleaner.

[2.0.0]: https://github.com/codsen/object-merge-advanced/compare/v1.6.0...v2.0.0
[3.0.0]: https://github.com/codsen/object-merge-advanced/compare/v2.0.0...v3.0.0
[4.0.0]: https://github.com/codsen/object-merge-advanced/compare/v3.0.0...v4.0.0
[4.1.0]: https://github.com/codsen/object-merge-advanced/compare/v4.0.0...v4.1.0
[4.2.0]: https://github.com/codsen/object-merge-advanced/compare/v4.1.0...v4.2.0
[5.0.0]: https://github.com/codsen/object-merge-advanced/compare/v4.2.0...v5.0.0
[6.0.0]: https://github.com/codsen/object-merge-advanced/compare/v5.0.0...v6.0.0
[6.1.0]: https://github.com/codsen/object-merge-advanced/compare/v6.0.0...v6.1.0
[6.2.0]: https://github.com/codsen/object-merge-advanced/compare/v6.1.0...v6.2.0
[6.3.0]: https://github.com/codsen/object-merge-advanced/compare/v6.2.0...v6.3.0
[6.4.0]: https://github.com/codsen/object-merge-advanced/compare/v6.3.0...v6.4.0
