# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2017-08-29
### Changed
- 🔧 Guys, strange stuff. I was generating a production build of [emailcomb](https://emailcomb.com) and it refused to minify this library because of the first backtick in the ES6 string literals. So, I replaced them with ES5 string literals. Let's see how it will go. Geez!

## [1.1.0] - 2017-08-16
### Fixed
- 🔧 Now allowing zeros as values in ranges too. Sorry about that, the integer-checking library was not accepting zeros. Fixed now.

## 1.0.0 - 2017-07-25
### New
- ✨ First public release

[1.2.0]: https://github.com/codsen/string-replace-slices-array/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/string-replace-slices-array/compare/v1.0.0...v1.1.0
