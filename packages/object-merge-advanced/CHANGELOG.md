# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.11.24](https://gitlab.com/codsen/codsen/compare/object-merge-advanced@10.11.23...object-merge-advanced@10.11.24) (2020-08-16)

**Note:** Version bump only for package object-merge-advanced





## 10.11.0 (2019-10-02)

### Features

- remove options checking to make program run around 128 times faster ([9ce7714](https://gitlab.com/codsen/codsen/commit/9ce7714))

### Performance Improvements

- tap Array.isArray directly, gaining around 124 times more speed ([13cd986](https://gitlab.com/codsen/codsen/commit/13cd986))

## 10.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 10.6.0 (2018-12-26)

- ✨ Added the fourth argument in the callback ([306e3da](https://gitlab.com/codsen/codsen/tree/master/packages/object-merge-advanced/commits/306e3da))

## 10.5.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 10.4.0 (2018-07-03)

- ✨ Set up Rollup to remove comments from all builds
- ✨ Removed AVA ESLint rules until the plugin is [fixed](https://github.com/avajs/eslint-plugin-ava/issues/195)

## 10.3.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 10.2.0 (2018-05-16)

- ✨ Fourth argument in the callback. It will allow to make decisions evaluating key names, paths and their type (is it a key of an array or an object?).
- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 10.1.0 (2018-03-28)

- ✨ Dropped `airbnb-base` as ESLint preset and set up Prettier. Now contributors don't have to worry about the code style any more.

## 10.0.0 (2018-03-13)

- ✨ When `opts.useNullAsExplicitFalse` is on and one of the clashing values is `null`, result will be `null`, not `false`. That's a breaking change of the API and this warrants _a major semver bump_.

**PS.** This feature is needed to maintain the data integrity. When merging in multiple rounds, if `null` under `opts.useNullAsExplicitFalse` yielded `false`, after the first round, the `null` would be lost. Now, `null` is kept and all subsequent merges will yield `null`. Practically, this means that it's enough to place `null` anywhere on any any level of template data and the result is guaranteed to be null. It's super-easy way to remove default values _arrays_ or _objects_ — the merged result `null` will not cause defaults to show up now.

## 9.1.0 (2018-02-15)

### Added

- ✨ `opts.cb`
- ✨ Rebased a lot of code, merged `util.js` into the main file
- ✨ Code coverage is now 100% line & function-wise

## 9.0.0 (2018-02-08)

### Changed

Previously, `opts.hardMergeKeys`, `opts.ignoreKeys` as well as `opts.hardMergeEverything` and `opts.ignoreEverything` were not 100% unidirectional. In some cases, for example, when object key's value was an array and it clashed with another array from same-named key, the merging was performed instead of hard write. It was done with intention to retain as much data as possible after merging. However, it was not what was promised in documentation. Now this is sorted.

Also, single asterisk wildcard `*` among `opts.ignoreKeys` sets `opts.ignoreEverything` to `true`. Same with `*` among `opts.hardMergeKeys`.

## 8.4.0 (2018-02-07)

Thanks to [@jabiinfante](https://github.com/jabiinfante) PR:

- ✨ Add `opts.hardArrayConcat`
- ✨ Add `opts.hardArrayConcatKeys`

## 8.3.0 (2018-01-05)

- ✨ Add `opts.dedupeStringsInArrayValues` now returns sorted arrays

## 8.2.0 (2017-12-11)

- ✨ Add `opts.useNullAsExplicitFalse`

## 8.1.0 (2017-11-12)

- ✨ Add `opts.mergeBoolsUsingOrNotAnd`

## 8.0.0 (2017-11-09)

- ✨ Recoded everything in ES modules, set up Rollup and now generating 3 flavours: CommonJS, UMD and ES modules.
- ✨ `opts.concatInsteadOfMerging`
- ✨ `opts.dedupeStringsInArrayValues`

**PS. Bumping major just in case.**

## 7.1.0 (2017-09-21)

- ✨ Switched from JS Standard to ESLint on `airbnb-base` preset with override to ban semicolons. 3 reasons: 1. JS Standard uses outdated ESLint which has `shell.js` one level-deep which is insecure. 2. JS Standard cares pretty much only about semicolons and doesn't activate many useful rules that `airbnb-*` have on. 3. Using raw ESLint guarantees, well, latest ESLint, always.
- ✨ Fixed many style things that ESLint flagged up. Functionality stays the same.
- ✨ Now serving transpiled code. Sorry everybody impacted by this, I got onto Sindre's bandwagon but I guess it's too early. I'll transpile all my libs.
- ✨ [Tweaked](https://github.com/codsen/bitsausage) bithound config.

## 7.0.0 (2017-08-21)

Bumping the _major_ just in case because strictly speaking, while things behave more _correct_ now, they behave slightly different. This involves more precise hard merging and ignoring keys, when values are container-like (arrays or plain objects). For the rest, the merging algorithm's behaviour is the same. Read below.

### Added

- ✨ Improvements to the algorithm, related to hard merges and ignores. Quick refresher: **a hard merge** is when second item overwrites first no matter what. **An ignore** is the opposite - first value is left as it is, no matter what it is merged against. Up until now, the hard merging was done via simple overwriting. On some edge cases I found out that container-like values (arrays or objects) should not be simply overwritten, but **their contents** should be hard-merged instead. Again, this concerns only narrow cases where types of both _merger_ and _mergee_ match and are equal to arrays or plain objects.

## 6.5.0 (2017-06-29)

- ✨ Add `opts.oneToManyArrayObjectMerge`. It's an essential feature when setting defaults on data structures in JSON. When your default values object has array with single object, but your working object has an array with many objects. That's one-to-many merge. `opts.oneToManyArrayObjectMerge` is off by default in order to keep the release semver "minor". 🦄

## 6.4.0 (2017-06-02)

- 🔧 Slightly rebased so that there's 100% branch coverage too, not only statements/lines.

## 6.3.0 (2017-05-15)

- ✨ Switched to [check-types-mini](https://www.npmjs.com/package/check-types-mini); removed all existing functions responsible for options' types.

## 6.2.0 (2017-05-12)

- ✨ Add `opts.mergeArraysContainingStringsToBeEmpty`

## 6.1.0 (2017-04-23) weekend

### Added

- ✨ When the options object values are set to be of a wrong type, this library will throw an error. At the same time, we're trying to be as flexible as possible - for example, accepting single string value instead of array.
- ✨ new options setting, `opts.ignoreKeys` - this is one direction merge. Key names accept wildcards.
- ✨ new options setting, `opts.hardMergeKeys` - this is also one direction (opposive of above) merge. Key names accept wildcards.

### PS.

It took nearly whole weekend on and off to get this out. Bloody leading wildcard [bug](https://github.com/deltreey/wildstring/issues/2) kept poking out until I switched to [matcher](https://www.npmjs.com/package/matcher), problem solved.

It's nice to use the modular way of coding JS: I found bug here on this library with leading wildcards, but it was coming from dependency, another of mine, [array-includes-with-glob](https://github.com/codsen/array-includes-with-glob), which in turn was bugged by buggy [wildstring](https://github.com/deltreey/wildstring). I swapped its dependencies, updated `object-merge-advanced` (this library) and tests passed again.

Like changing a broken carburettor with another, working-one. 🎉

## 6.0.0 (2017-03-14)

### Changed

- 🔧 Recoded everything, adding Number type. This means, now there are 100 possibilities of the merge. Looks even more clean and optimal now, but that's a subjective thing.

## 5.0.0 (2017-03-13)

### API addition

- ✨ Added an optional options object, the third argument. Now `opts.mergeObjectsOnlyWhenKeysetMatches` allow more granular control over how objects within arrays are merged. The default setting is balanced option, `opts.mergeObjectsOnlyWhenKeysetMatches = false` is more _gung-ho_ merging approach (behaviour like v4, previous version).

## 4.2.0 (2017-03-03)

- 🔧 Updated dependencies, now requesting JS Standard as normal version range, to prevent future surprises.

## 4.1.0 (2017-02-28)

- 🔧 Improved the algorithm, removed redundant insurance, cloning input variable.

## 4.0.0 (2017-02-28)

- 🔧 Making API even more user-friendly. If one of the input args is missing, instead of returning the `undefined` now it's returning the argument that's present. What's the point to return `undefined`?

  If none are present, `undefined` is returned as before.

## 3.0.0 (2017-02-28)

- 🔧 Technically a major API change. When object key values are arrays now we're checking is _merger's_ element already present in a _mergee_. If so, it's omitted. This means, you can safely merge similar arrays without them bloating. However, in theory, while it's very logical and necessary feature, it's also a major API change. Hence bumping to v.3.

By the way, I needed this myself, placeholder default values in merged JSON files otherwise get duplicated. Now it's how it should be. 🍺

## 2.0.0 (2017-02-23)

- 🔧 Major API change. Input argument objects are not mutated any more. Function first clones what it later uses.
- 🔧 Adding tests for input argument mutation (`3.x` group).
- 🔧 All auxiliary functions are ported inside the main exported function. Looks cleaner.
