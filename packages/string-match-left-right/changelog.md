# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-12-10
### Added
- ✨ Stringifying of `opts.trimCharsBeforeMatching` now occurs only if element is not string.
- ✨ Callbacks, [opts.cbLeft and opts.cbRight](https://www.npmjs.com/package/string-match-left-right#optscbleft-and-optscbright), get second argument - whole substring of what's on that side. First argument it received is first character, second is whole substring (including first character).

I needed this when I was coding [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css) and I was traversing the string. I wanted to check, do any of given _heads_ are equal to what's on the right of the current character being traversed. For example, if there are Nunjucks variables in HTML, they would start with `{{` and end with `}}`. I wanted `email-remove-unused-css` to ignore everything between such `heads` and `tails` (which can be customised to anything, to support any templating/programming languages).

## [1.3.0] - 2017-11-23
### Added
- ✨ `opts.trimCharsBeforeMatching`

## [1.2.0] - 2017-11-22
### Added
- ✨ `opts.trimBeforeMatching`

## [1.1.0] - 2017-10-28
### Added
- ✨ `opts.cbLeft`
- ✨ `opts.cbRight`

Often you want to check not only what's to the left or right of the certain index in the string, but also perform certain checks on what's even further to the left/right. For example, you have a piace of HTML, `class=` and you are an index which is at character `=`. You can use `string-match-left-right` to check, is `class` on the left using `matchLeft`. Which is fine. There's a gotcha though. You also need to check, what's further to the left of `class=` - is it a character, a space or something else? Because it might be that you looked for `class` attribute but matched `superclass`, an (imaginary) custom attribute!

Here comes in the callback functions.

They have to be callbacks because I can't predict what checks you will want to check on the outer-left and outer-right characters. Just pass your function and this library will feed them (the outer-left and outer-right characters) as arguments. You can then find out yourself what to do about it.

## 1.0.0 - 2017-10-28
### New
- ✨ First public release

[1.4.0]: https://github.com/codsen/string-match-left-right/compare/v1.3.6...v1.4.0
[1.3.0]: https://github.com/codsen/string-match-left-right/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/string-match-left-right/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/string-match-left-right/compare/v1.0.0...v1.1.0
