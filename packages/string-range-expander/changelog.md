# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2018-09-18

- ✨ New feature - `opts.addSingleSpaceToPreventAccidentalConcatenation`. It's off by default but if it's on, it can prevent accidental concatenation of string when chunk is deleted. It checks the outer edges of the string range what is about to be deleted and if non-whitespace surrounds both sides it adds a single space (as range's third argument).

## [1.1.0] - 2018-09-12

- ✨ New feature - `opts.wipeAllWhitespaceOnLeft`, `opts.wipeAllWhitespaceOnRight` now expands to include any whitespace on the particular side. It will be handy when deleting attributes from HTML.

## 1.0.0 - 2018-09-11

### New

- ✨ First public release

[1.2.0]: https://bitbucket.org/codsen/string-range-expander/branches/compare/v1.2.0%0Dv1.1.3#diff
[1.1.0]: https://bitbucket.org/codsen/string-range-expander/branches/compare/v1.1.0%0Dv1.0.2#diff
