# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-09-20

- ✨ Improvements to `opts.addSingleSpaceToPreventAccidentalConcatenation`, now it detects is there at least one digit or number around and if there's none, it doesn't add a space.

## [1.3.0] - 2018-09-20

- ✨ Improvements to cases when `opts.ifLeftSideIncludesThisThenCropTightly`/`opts.ifRightSideIncludesThisThenCropTightly` is an array
- ✨ Now we tend an edge case when `opts.addSingleSpaceToPreventAccidentalConcatenation` is surrounded by characters, whitelisted by `opts.ifLeftSideIncludesThisThenCropTightly` and `opts.ifRightSideIncludesThisThenCropTightly` (or just one of them, but then the other is a falsey empty string). In that case, the compensation space is not added.

## [1.2.0] - 2018-09-18

- ✨ New feature - `opts.addSingleSpaceToPreventAccidentalConcatenation`. It's off by default but if it's on, it can prevent accidental concatenation of string when chunk is deleted. It checks the outer edges of the string range what is about to be deleted and if non-whitespace surrounds both sides it adds a single space (as range's third argument).

## [1.1.0] - 2018-09-12

- ✨ New feature - `opts.wipeAllWhitespaceOnLeft`, `opts.wipeAllWhitespaceOnRight` now expands to include any whitespace on the particular side. It will be handy when deleting attributes from HTML.

## 1.0.0 - 2018-09-11

### New

- ✨ First public release

[1.4.0]: https://bitbucket.org/codsen/string-range-expander/branches/compare/v1.4.0%0Dv1.3.0#diff
[1.3.0]: https://bitbucket.org/codsen/string-range-expander/branches/compare/v1.3.0%0Dv1.2.0#diff
[1.2.0]: https://bitbucket.org/codsen/string-range-expander/branches/compare/v1.2.0%0Dv1.1.3#diff
[1.1.0]: https://bitbucket.org/codsen/string-range-expander/branches/compare/v1.1.0%0Dv1.0.2#diff
