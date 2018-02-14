# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [9.1.0] - 2018-02-15
### Added
- ✨ `opts.cb`
- ✨ Rebased a lot of code, merged `util.js` into main file
- ✨ Code coverage is now 100% line/function-wise

## [9.0.0] - 2018-02-08
### Changed
Previously, `opts.hardMergeKeys`, `opts.ignoreKeys` as well as `opts.hardMergeEverything` and `opts.ignoreEverything` were not 100% unidirectional. In some cases, for example, when object key's value was an array and it clashed with another array from same-named key, the merging was performed instead of hard write. It was done with intention to retain as much data as possible after merging. However, it was not what was promised in documentation. Now this is sorted.

Also, single asterisk wildcard `*` among `opts.ignoreKeys` sets `opts.ignoreEverything` to `true`. Same with `*` among `opts.hardMergeKeys`.

## [8.4.0] - 2018-02-07
### Added
Thanks to [@jabiinfante](https://github.com/jabiinfante) PR:
- ✨ `opts.hardArrayConcat`
- ✨ `opts.hardArrayConcatKeys`

## [8.3.0] - 2018-01-05
### Added
- ✨ `opts.dedupeStringsInArrayValues` now returns sorted arrays

## [8.2.0] - 2017-12-11
### Added
- ✨ `opts.useNullAsExplicitFalse`

## [8.1.0] - 2017-11-12
### Added
- ✨ `opts.mergeBoolsUsingOrNotAnd`

## [8.0.0] - 2017-11-09
### Added
- ✨ Recoded everything in ES modules, set up Rollup and now generating 3 flavours: CommonJS, UMD and ES modules.
- ✨ `opts.concatInsteadOfMerging`
- ✨ `opts.dedupeStringsInArrayValues`

Bumping major just in case.

## [7.1.0] - 2017-09-21
### Added
- ✨ Switched from JS Standard to ESLint on `airbnb-base` preset with override to ban semicolons. 3 reasons: 1. JS Standard uses outdated ESLint which has `shell.js` one level-deep which is insecure. 2. JS Standard cares pretty much only about semicolons and doesn't activate many useful rules that `airbnb-*` have on. 3. Using raw ESLint guarantees, well, latest ESLint, always.
- ✨ Fixed many style things that ESLint flagged up. Functionality stays the same.
- ✨ Now serving transpiled code. Sorry everybody impacted by this, I got onto Sindre's bandwagon but I guess it's too early. I'll transpile all my libs.
- ✨ [Tweaked](https://github.com/codsen/bitsausage) bithound config.

## [7.0.0] - 2017-08-21
Bumping the _major_ just in case because strictly speaking, while things behave more _correct_ now, they behave slightly different. This involves more precise hard merging and ignoring keys, when values are container-like (arrays or plain objects). For the rest, the merging algorithm's behaviour is the same. Read below.

### Added
- ✨ Improvements to the algorithm, related to hard merges and ignores. Quick refresher: **a hard merge** is when second item overwrites first no matter what. **An ignore** is the opposite - first value is left as it is, no matter what it is merged against. Up until now, the hard merging was done via simple overwriting. On some edge cases I found out that container-like values (arrays or objects) should not be simply overwritten, but **their contents** should be hard-merged instead. Again, this concerns only narrow cases where types of both _merger_ and _mergee_ match and are equal to arrays or plain objects.
### Unchanged
- Unit test coverage is still 100%, counting per-functions, per-statement, per-branches and per-line.

## [6.5.0] - 2017-06-29
### Added
- ✨ `opts.oneToManyArrayObjectMerge`. It's an essential feature when setting defaults on data structures in JSON. When your default values object has array with single object, but your working object has an array with many objects. That's one-to-many merge. `opts.oneToManyArrayObjectMerge` is off by default in order to keep the release semver "minor". 🦄

## [6.4.0] - 2017-06-02
### Changed
- 🔧 Slightly rebased so that there's 100% branch coverage too, not only statements/lines.

## [6.3.0] - 2017-05-15
### Added
- ✨ Switched to [check-types-mini](https://www.npmjs.com/package/check-types-mini); removed all existing functions responsible for options' types.

## [6.2.0] - 2017-05-12
### Added
- ✨ opts.mergeArraysContainingStringsToBeEmpty

## [6.1.0] - 2017-04-23 weekend
### Added
- ✨ When the options object values are set to be of a wrong type, this library will throw an error. At the same time, we're trying to be as flexible as possible - for example, accepting single string value instead of array.
- ✨ new options setting, `opts.ignoreKeys` - this is one direction merge. Key names accept wildcards.
- ✨ new options setting, `opts.hardMergeKeys` - this is also one direction (opposive of above) merge. Key names accept wildcards.
### Unchanged
- Coverage is kept 100%. That does not mean much but hey.

### PS.
It took nearly whole weekend on and off to get this out. Bloody leading wildcard [bug](https://github.com/deltreey/wildstring/issues/2) kept poking out until I switched to [matcher](https://www.npmjs.com/package/matcher), problem solved.

It's nice to use the modular way of coding JS: I found bug here on this library with leading wildcards, but it was coming from dependency, another of mine, [array-includes-with-glob](https://github.com/codsen/array-includes-with-glob), which in turn was bugged by buggy [wildstring](https://github.com/deltreey/wildstring). I swapped its dependencies, updated `object-merge-advanced` (this library) and tests passed again.

Like changing a broken carburettor with another, working-one. 🎉

## [6.0.0] - 2017-03-14
### Changed
- 🔧 Recoded everything, adding Number type. This means, now there are 100 possibilities of the merge. Looks even more clean and optimal now, but that's a subjective thing.

## [5.0.0] - 2017-03-13
### API addition
- ✨ Added an optional options object, the third argument. Now `opts.mergeObjectsOnlyWhenKeysetMatches` allow more granular control over how objects within arrays are merged. The default setting is balanced option, `opts.mergeObjectsOnlyWhenKeysetMatches = false` is more _gung-ho_ merging approach (behaviour like v4, previous version).

## [4.2.0] - 2017-03-03
### Changed
- 🔧 Updated dependencies, now requesting JS Standard as normal version range, to prevent future surprises.

## [4.1.0] - 2017-02-28
### Changed
- 🔧 Improved the algorithm, removed redundant insurance, cloning input variable.

## [4.0.0] - 2017-02-28
### Changed
- 🔧 Making API even more user-friendly. If one of the input args is missing, instead of returning the `undefined` now it's returning the argument that's present. What's the point to return `undefined`?

If none are present, `undefined` is returned as before.

## [3.0.0] - 2017-02-28
### Changed
- 🔧 Technically a major API change. When object key values are arrays now we're checking is _merger's_ element already present in a _mergee_. If so, it's omitted. This means, you can safely merge similar arrays without them bloating. However, in theory, while it's very logical and necessary feature, it's also a major API change. Hence bumping to v.3.

By the way, I needed this myself, placeholder default values in merged JSON files otherwise get duplicated. Now it's how it should be. 🍺

## 2.0.0 - 2017-02-23
### Changed
- 🔧 Major API change. Input argument objects are not mutated any more. Function first clones what it later uses.
- 🔧 Adding tests for input argument mutation (`3.x` group).
- 🔧 All auxiliary functions are ported inside the main exported function. Looks cleaner.

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
[6.5.0]: https://github.com/codsen/object-merge-advanced/compare/v6.4.0...v6.5.0
[7.0.0]: https://github.com/codsen/object-merge-advanced/compare/v6.5.0...v7.0.0
[7.1.0]: https://github.com/codsen/object-merge-advanced/compare/v7.0.2...v7.1.0
[8.0.0]: https://github.com/codsen/object-merge-advanced/compare/v7.1.0...v8.0.0
[8.1.0]: https://github.com/codsen/object-merge-advanced/compare/v8.0.0...v8.1.0
[8.2.0]: https://github.com/codsen/object-merge-advanced/compare/v8.1.0...v8.2.0
[8.3.0]: https://github.com/codsen/object-merge-advanced/compare/v8.2.0...v8.3.0
[8.4.0]: https://github.com/codsen/object-merge-advanced/compare/v8.3.4...v8.4.0
[9.0.0]: https://github.com/codsen/object-merge-advanced/compare/v8.4.0...v9.0.0
[9.1.0]: https://github.com/codsen/object-merge-advanced/compare/v9.0.0...v9.1.0
