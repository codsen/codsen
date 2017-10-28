# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.0] - 2017-10-28
### Added
- ✨ opts.cbLeft
- ✨ opts.cbRight

Often you want to check not only what's to the left or right of the certain index in the string, but also perform certain checks on what's even further to the left/right. For example, you have a piace of HTML, `class=` and you are an index which is at character `=`. You can use `string-match-left-right` to check, is `class` on the left using `matchLeft`. Which is fine. There's a gotcha though. You also need to check, what's further to the left of `class=` - is it a character, a space or something else? Because it might be that you looked for `class` attribute but matched `superclass`, an (imaginary) custom attribute!

Here comes in the callback functions.

They have to be callbacks because I can't predict what checks you will want to check on the outer-left and outer-right characters. Just pass your function and this library will feed them (the outer-left and outer-right characters) as arguments. You can then find out yourself what to do about it.

## 1.0.0 - 2017-10-28
### New
- ✨ First public release

[1.1.0]: https://github.com/codsen/string-match-left-right/compare/v1.0.0...v1.1.0
