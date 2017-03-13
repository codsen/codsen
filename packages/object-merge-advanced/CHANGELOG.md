# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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

[2.0.0]: https://github.com/code-and-send/object-merge-advanced/compare/v1.6.0...v2.0.0
[3.0.0]: https://github.com/code-and-send/object-merge-advanced/compare/v2.0.0...v3.0.0
[4.0.0]: https://github.com/code-and-send/object-merge-advanced/compare/v3.0.0...v4.0.0
[4.1.0]: https://github.com/code-and-send/object-merge-advanced/compare/v4.0.0...v4.1.0
[4.2.0]: https://github.com/code-and-send/object-merge-advanced/compare/v4.1.0...v4.2.0
[5.0.0]: https://github.com/code-and-send/object-merge-advanced/compare/v4.2.0...v5.0.0
