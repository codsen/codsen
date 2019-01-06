# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.6](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/compare/string-range-expander@1.6.5...string-range-expander@1.6.6) (2019-01-02)

**Note:** Version bump only for package string-range-expander

## [1.6.5](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/compare/string-range-expander@1.6.4...string-range-expander@1.6.5) (2019-01-01)

**Note:** Version bump only for package string-range-expander

## [1.6.4](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/compare/string-range-expander@1.6.3...string-range-expander@1.6.4) (2018-12-29)

**Note:** Version bump only for package string-range-expander

## [1.6.3](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/compare/string-range-expander@1.6.2...string-range-expander@1.6.3) (2018-12-29)

**Note:** Version bump only for package string-range-expander

## [1.6.2](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/compare/string-range-expander@1.6.1...string-range-expander@1.6.2) (2018-12-27)

**Note:** Version bump only for package string-range-expander

## [1.6.1](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/compare/string-range-expander@1.6.0...string-range-expander@1.6.1) (2018-12-27)

**Note:** Version bump only for package string-range-expander

# 1.6.0 (2018-12-26)

### Bug Fixes

- fix for opts.wipeAllWhitespaceOnRight and left too ([72c26e6](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/commits/72c26e6))
- if\*\*\*\*SideIncludesThisCropItToo algorithm tweaks when there is no whitespace ([d4676d8](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/commits/d4676d8))

### Features

- improvements to opts.addSingleSpaceToPreventAccidentalConcatenation ([8bb929a](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/commits/8bb929a))
- opts.addSingleSpaceToPreventAccidentalConcatenation ([19b1390](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/commits/19b1390))
- opts.addSingleSpaceToPreventAccidentalConcatenation improvements ([47df5be](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/commits/47df5be))
- opts.wipeAllWhitespaceOnLeft and opts.wipeAllWhitespaceOnRight ([73d763b](https://bitbucket.org/codsen/codsen/src/master/packages/string-range-expander/commits/73d763b))

## 1.5.0 (2018-10-26)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.4.0 (2018-09-20)

- ✨ Improvements to `opts.addSingleSpaceToPreventAccidentalConcatenation`, now it detects is there at least one digit or number around and if there's none, it doesn't add a space.

## 1.3.0 (2018-09-20)

- ✨ Improvements to cases when `opts.ifLeftSideIncludesThisThenCropTightly`/`opts.ifRightSideIncludesThisThenCropTightly` is an array
- ✨ Now we tend an edge case when `opts.addSingleSpaceToPreventAccidentalConcatenation` is surrounded by characters, whitelisted by `opts.ifLeftSideIncludesThisThenCropTightly` and `opts.ifRightSideIncludesThisThenCropTightly` (or just one of them, but then the other is a falsey empty string). In that case, the compensation space is not added.

## 1.2.0 (2018-09-18)

- ✨ New feature - `opts.addSingleSpaceToPreventAccidentalConcatenation`. It's off by default but if it's on, it can prevent accidental concatenation of string when chunk is deleted. It checks the outer edges of the string range what is about to be deleted and if non-whitespace surrounds both sides it adds a single space (as range's third argument).

## 1.1.0 (2018-09-12)

- ✨ New feature - `opts.wipeAllWhitespaceOnLeft`, `opts.wipeAllWhitespaceOnRight` now expands to include any whitespace on the particular side. It will be handy when deleting attributes from HTML.

## 1.0.0 (2018-09-11)

- ✨ First public release
