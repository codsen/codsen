# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.1] - 2017-09-01
### Added
- Added a transpiled version in `/es5/` folder.

## [2.0.0] - 2017-07-21
### Changed
- Improved the algorithm. Actually we don't need to care about emoji and characters that are made up of two Unicode characters (surrogates). This makes it unnecessary to split the string into an array of characters.
- API is now more strict, if the input is not `string` or it's missing completely, it will `throw`.

## 1.0.0 - 2017-06-26
### New
- First public release

[2.0.1]: https://github.com/codsen/string-unfancy/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/codsen/string-unfancy/compare/v1.0.9...v2.0.0
