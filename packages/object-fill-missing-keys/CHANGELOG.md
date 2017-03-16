# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-03-16
### Changed
- Rewrote pretty much the whole core of this. Previously, the algorithm did not take into the account the placeholder values and also didn't use an `object-merge-advanced`-class merging, only filled the missing keys. It's fixed now. From practical standpoint, the main difference is when merging two plain objects, if two have the same key but one's value is a string, another's value is array, array will overwrite string. Previously, not so. Basically, now the full hierarchy of `object-merge-advanced` is retained. This might have consequences to any template code that relied on previous algorithm, but it's a bad practice to mix different data types in the template logic anyway, so hey.

### Added
- Even more more unit tests

### Improved
- Put some test variables into correct scope. It does not change anything, but still.

[2.0.0]: https://github.com/code-and-send/object-fill-missing-keys/compare/v1.4.0...v2.0.0
