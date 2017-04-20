# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.1.0 - 2017-04-20
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
