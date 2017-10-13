# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.3.0] - 2017-10-13
### Added
- ✨ Dropped JS Standard and moved to raw ESLint on `airbnb-base` preset with semicolons off. JS Standard does not have many important rules on, beware.
- ✨ Options - third input argument, with all validation (driven by [check-types-mini](https://github.com/codsen/check-types-mini))

## [2.2.0] - 2017-05-20
### Added
- ✨ cli `clear` when running unit tests (not that relevant for end-user, but totally relevant when maintaining all this)
- ✨ now consuming `standard` as a normal semver range, not _the latest greatest_ which is a liability remembering what happened on v10 release
- ✨ one more unit test

## [2.1.0] - 2017-03-16
### Changed
- 🔧 Improvements to the merging algorithm

## 2.0.0 - 2017-03-16
### Changed
- 🔧 Rewrote pretty much the whole core of this. Previously, the algorithm did not take into the account the placeholder values and also didn't use an `object-merge-advanced`-class merging, only filled the missing keys. It's fixed now. From practical standpoint, the main difference is when merging two plain objects, if two have the same key but one's value is a string, another's value is array, array will overwrite string. Previously, not so. Basically, now the full hierarchy of `object-merge-advanced` is retained. This might have consequences to any template code that relied on previous algorithm, but it's a bad practice to mix different data types in the template logic anyway, so hey.

### Added
- ✨ Even more more unit tests

### Improved
- ✨ Put some test variables into correct scope. It does not change anything, but still.

[2.0.0]: https://github.com/codsen/object-fill-missing-keys/compare/v1.4.0...v2.0.0
[2.1.0]: https://github.com/codsen/object-fill-missing-keys/compare/v2.0.0...v2.1.0
[2.2.0]: https://github.com/codsen/object-fill-missing-keys/compare/v2.1.0...v2.2.0
[2.3.0]: https://github.com/codsen/object-fill-missing-keys/compare/v2.2.0...v2.3.0
