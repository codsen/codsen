# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0] - 2017-04-27
### Changed
- `opts.wrapHeads` is now `opts.wrapHeadsWith`
- `opts.wrapTails` is now `opts.wrapTailsWith`

## [2.0.0] - 2017-04-25
### Changed
- Major API change and major semver bump: `opts.dontWrapKeysStartingWith` and `opts.dontWrapKeysEndingWith` are now one key, `opts.dontWrapKeys` and the same (and better) result is achieved using wildcards (`*` symbols). Now you can have as many wildcards as you like, not only at the beginning or the ending of a string (or arrays of strings), but also anywhere in the middle too. Also you can set multiple wildcards in the same string.

## [1.2.0] - 2017-04-24
### Added
- Made the algorithm to be even more smarter: when the value has no spaces around already existing `heads` and `tails`, for example `{{value}}`, but you want, in general, to have a space around your wrappings, you set `heads` for for example: `{{ ` with a trailing space. Previously, this would have caused double wrapping. Now, `heads` and `tails` are trimmed before search, so go crazy with the white space!

## [1.1.0] - 2017-04-20
### Added
- New options setting `opts.ignore` which lets you skip flattening on an array (or a single string) of keys.
- New options setting `opts.whatToDoWhenReferenceIsMissing` which allows you to specify exactly what do you want to happen when the equivalent value in the reference (object/array/string/whatever) is falsey.
### Improved
- Done some rebasing, for example, `util.arrayiffyString` now DRY'ies the code a bit.
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.1.0]: https://github.com/code-and-send/object-flatten-referencing/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/code-and-send/object-flatten-referencing/compare/v1.1.0...v1.2.0
[2.0.0]: https://github.com/code-and-send/object-flatten-referencing/compare/v1.2.0...v2.0.0
[3.0.0]: https://github.com/code-and-send/object-flatten-referencing/compare/v2.0.0...v3.0.0
