# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-04-23 Sunday evening
### Changed
- There are some finshy things happening with string wildcard libraries. Namely, [wildcard](https://www.npmjs.com/package/wildcard) and [wildstring](https://www.npmjs.com/package/wildstring). I was using `wildstring` until I in another of my libraries discovered that it does not support leading wildcards, that is when asterisk is the first character! WTF!!! Same case with `wildcard` too. Proof's [here](https://runkit.com/58fd11151dc1c60013c79f85/58fd132d15bef7001293f41a) and there are other [issues](https://github.com/DamonOehlman/wildcard/issues/9) with its API as well!!!
SOLUTION: switched to Sindre Sorhus' [matcher](https://www.npmjs.com/package/matcher). Small amendments (order of arguments) and one find-and-replace on the method `isMatch`. Problem solved!

## [1.3.0] - 2017-04-23
### Added
- You can provide an array (second argument) of strings to check, is ANY of them found in the source (first argument).
- Alternatively, you can set the matching to request that ALL elements from second argument array must be found in the source array (first argument).

## [1.2.0] - 2017-04-22
### Added
- Now the input can be not only array, but string as well. It will be converted into an array first and then processed.

## 1.0.0 - 2017-04-22
### New
- First public release

[1.2.0]: https://github.com/code-and-send/array-includes-with-glob/compare/v1.0.0...v1.2.0
[1.3.0]: https://github.com/code-and-send/array-includes-with-glob/compare/v1.2.0...v1.3.0
[1.4.0]: https://github.com/code-and-send/array-includes-with-glob/compare/v1.3.0...v1.4.0
