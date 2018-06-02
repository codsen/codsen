# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.2.0] - 2018-06-01

- ✨ `opts.dumpLinkHrefsNearby` - handy when producing Email Text versions
- ✨ Improved algorithm to understand HTML code that has been abruptly chopped off. If you select bunch of HTML where beginning is valid, but ending is somewhere in the middle of the tags, styles or whatnot, now that tag will be removed.
- ✨ Improved algorithm to detect and clean tags without closing bracket, if a new tag follows, with or without whitespace in between.

## [2.1.0] - 2018-05-31

- ✨ `opts.trimOnlySpaces` - up until now, by default, the outsides of the string was trimmed using `String.trim()` which erased:

  - non-breaking spaces (in combination with recursive entity decoding this means `&nbsp;` will also be erased)
  - tabs
  - line breaks (`\n`), carriage returns (`\r`) and combination thereof (`\r\n`)
  - some other less common but space-like characters.

  This becomes a challenge in automated environments where data is considered to be clean and multiple datum can be parts of another. For example, we might be cleaning JSON fields where value is "sandwitched" out of three fields: "Hi&nbsp;", "%%-firstname-%%", ", welcome to special club!". To improve formatting, some outer spaces like after "Hi" can be replaced with a non-breaking space. This way, words would never wrap there. However, if all fields were cleaned by a tool which used this HTML stripping function, outer non-breaking spaces would get deleted and result would end up: "HiJohn, welcome to special club!". This option makes trimming more strict - only spaces deleted during string trimming.

## [2.0.0] - 2018-05-30

One day I noticed that my Nunjucks code (just a greater-than comparison against a number) gets falsely interpreted as HTML by this library and went on to rewrite the whole thing from scratch. Now it's leaner, cleaner and with the same and double extra more unit tests.

### Added

- ✨ An even smarter algorithm, now being able to detect missing opening bracket on a tag, for example. Even latest Chrome `v.66` can't do that.
- ✨ Increased unit test assertion count from 148 to 370. Covering even more legit and stinky code cases.
- ✨ `opts.returnRangesOnly`

## [1.4.0] - 2018-05-11

### Improved

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. It means, we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## [1.3.0] - 2018-02-19

### Added

- ✨ Now strips HTML comments too.

## [1.2.0] - 2017-12-31

### Improved

- ✨ Improvements to `opts.stripTogetherWithTheirContents` and done a lot of rebasing.

## [1.1.0] - 2017-12-07

### Added

- ✨ `opts.stripTogetherWithTheirContents`

## 1.0.0 - 2017-11-27

### Added

- ✨ First public release

[1.1.0]: https://github.com/codsen/string-strip-html/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/codsen/string-strip-html/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/string-strip-html/compare/v1.2.6...v1.3.0
[1.4.0]: https://github.com/codsen/string-strip-html/compare/v1.3.2...v1.4.0
[2.0.0]: https://github.com/codsen/string-strip-html/compare/v1.4.2...v2.0.0
[2.1.0]: https://github.com/codsen/string-strip-html/compare/v2.0.0...v2.1.0
[2.2.0]: https://github.com/codsen/string-strip-html/compare/v2.1.0...v2.2.0
