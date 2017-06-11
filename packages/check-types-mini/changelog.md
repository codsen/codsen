# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.5.0] - 2017-06-11
### Changed
- 🔧 Fixed a bug involving `null` values. I overused `existy()`, in this case, using it to check existence of a key in an Object. The right way is to use `.hasOwnProperty`. Silly me. {facepalm}
- 🔧 Now `opts.enforceStrictKeyset` checks both ways, the keysets of both object and reference object have to match _strictly_. Previously I tried to cheat and check only one direction, assuming the object will be `object-assign`'ed from the reference. But this morning I was thinking, what it isn't? For me it's easy to close this error rabbit-hole, so let's do it.

## [1.4.0] - 2017-06-10
### Added
- ✨ `opts.enforceStrictKeyset` will now by default `throw` if there are any keys in the options object, that don't exist in the reference object.

## [1.3.0] - 2017-05-22
### Added
- ✨ `opts.acceptArrays` will accept arrays too, if they contain only the same type elements as the one that's being checked.
- ✨ `opts.acceptArraysIgnore` - lets you ignore per-key level when `opts.acceptArrays` is on. 👍

## [1.2.0] - 2017-05-15
### Added
- `opts.ignoreKeys` won't throw now if input is a single string.

## [1.1.0] - 2017-05-15
### Added
- ✨ `opts.ignoreKeys`

## 1.0.0 - 2017-05-15
### New
- First public release

[1.1.0]: https://github.com/codsen/check-types-mini/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/codsen/check-types-mini/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/check-types-mini/compare/v1.2.2...v1.3.0
[1.4.0]: https://github.com/codsen/check-types-mini/compare/v1.3.0...v1.4.0
[1.5.0]: https://github.com/codsen/check-types-mini/compare/v1.4.0...v1.5.0
