# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.1.0] - 2017-04-01
### Improved
- All this Saturday morning I worked on `monkey.traverse()`. Yesterday night I discovered that when you delete something on `traverse()`, all subsequent nodes are affected. The solution is not so elementary: yes, `i--` was missing, but there were also more fixed to implement for this to work. Now when you want to instruct `traverse()` to delete current node, you have to pass `null` — `undefined` won't work.
### Added
- Added `traverse()` unit tests, namely, `09.x` group.
### Unchanged
- Unit test coverage stays solid 100% lines.

## [3.0.0] - 2017-03-20
### Changed
BREAKING API CHANGES.
- `flatten()` method renamed to `arrayFirstOnly()` to reflect better what this does. The real "flatten" is [object-flatten-all-arrays](https://www.npmjs.com/package/object-flatten-all-arrays) and while it could be rewritten in `ast-monkey`, it goes against the overall flow of the `ast-monkey`'s algorithm — monkey goes horizontal, by branch, while `flatten-all-arrays` goes vertically, by array, all keys at once. The new `arrayFirstOnly()` is easy feature because it simply filters the first element of each array encountered during the traversal.
### Added
- Exposed `.traverse()` too; shielded its inner API with another function (one input arguement-less now)

## [2.9.0] - 2017-03-09
### Added
- `.flatten()`
- related unit tests.

### Changed
- `.info()` now returns the input, not `undefined`. This doesn't warrant major version bump because method was for logging only and nothing changes in this aspect.

## [2.8.0] - 2017-03-02
### Tweaks
- Now cloning all arguments in main `monkey()` and auxiliary `traverse()` functions' input object args to prevent any accidental mutation. This is big and important.

## [2.7.0] - 2017-02-20
### Tweaks
- Replaced spread operator with lodash equivalent to avoid unnecessary Babel use

## [2.6.0] - 2017-02-19
### New
- Incoming input is cloned upon receiving and clone is used instead, so that original input is not mutated. This is very important.

## [2.5.0] - 2017-02-18
### New
- Rebased the requirements for `opts.key` or `opts.val` to exist, now `find()` and `del()` are combined.

## [2.4.0] - 2017-02-18
### New
- Enforcing the {index: ?} to be provided for `drop()`.

## [2.3.0] - 2017-02-18
### New
- Added `index` key to each of `find()` result object.

## [2.2.0] - 2017-02-16
### New
- Added `del()` method which deletes pieces from AST's by key or by value or by both. It leaves empty stumps and does not clean after deletion.

## [2.0.0] - 2017-02-16
### Changed
- Major API change. Initial release's `get()` didn't make sense. It was returning a "synthetic" object with a separate keys containing info about fetched piece of AST, not the piece itself. This meant, it was not possible to actually _get_ the whole intact piece! Now, I am simply returning the whole finding from `get()`. That's it.

[2.0.0]: https://github.com/code-and-send/ast-monkey/compare/v1.0.1...v2.0.0
[2.2.0]: https://github.com/code-and-send/ast-monkey/compare/v2.1.0...v2.2.0
[2.3.0]: https://github.com/code-and-send/ast-monkey/compare/v2.2.0...v2.3.0
[2.4.0]: https://github.com/code-and-send/ast-monkey/compare/v2.3.0...v2.4.0
[2.5.0]: https://github.com/code-and-send/ast-monkey/compare/v2.4.0...v2.5.0
[2.6.0]: https://github.com/code-and-send/ast-monkey/compare/v2.5.0...v2.6.0
[2.7.0]: https://github.com/code-and-send/ast-monkey/compare/v2.6.0...v2.7.0
[2.8.0]: https://github.com/code-and-send/ast-monkey/compare/v2.7.0...v2.8.0
[2.9.0]: https://github.com/code-and-send/ast-monkey/compare/v2.8.0...v2.9.0
[3.0.0]: https://github.com/code-and-send/ast-monkey/compare/v2.9.0...v3.0.0
[3.1.0]: https://github.com/code-and-send/ast-monkey/compare/v3.0.0...v3.1.0
