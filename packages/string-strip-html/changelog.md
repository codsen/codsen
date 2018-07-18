# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.1.0] - 2018-07-17

- ✨ Added `opts.onlyStripTags`

## [3.0.0] - 2018-07-03

Breaking changes: `opts.dumpLinkHrefsNearby` was previously Boolean. Now it's a plain object and its key `enabled` (`opts.dumpLinkHrefsNearby.enabled`) does the same thing that `opts.dumpLinkHrefsNearby` did before `v3`.

This makes it easier for us to contain all new `opts.dumpLinkHrefsNearby` settings in one place:

```js
{
  ignoreTags: [],
  stripTogetherWithTheirContents: stripTogetherWithTheirContentsDefaults,
  skipHtmlDecoding: false,
  returnRangesOnly: false,
  trimOnlySpaces: false,
  dumpLinkHrefsNearby: { // <------ CHANGED!
    enabled: false, // <-------- 💥 NEW!
    putOnNewLine: false, // <--- 💥 NEW!
    wrapHeads: "", // <--------- 💥 NEW!
    wrapTails: "" // <---------- 💥 NEW!
  }
}
```

- ✨ Now, input string is returned trimmed of whitespace in the beginning and in the end.

## [2.4.0] - 2018-06-20

- ✨ Two `range-` dependencies have been renamed, namely [ranges-push](https://www.npmjs.com/package/ranges-push) and [ranges-apply](https://www.npmjs.com/package/ranges-apply). We tapped them.

## [2.3.0] - 2018-06-08

- ✨ Improvements to dirty code recognition algorithm

## [2.2.0] - 2018-06-02

- ✨ `opts.dumpLinkHrefsNearby` - handy when producing Email Text versions
- ✨ Improved algorithm to understand HTML code that has been abruptly chopped off. If you select bunch of HTML where beginning is valid, but ending is somewhere in the middle of the tags, styles or whatnot, now that tag will be removed.
- ✨ Improved algorithm to detect and clean tags without closing bracket, if a new tag follows, with or without whitespace in between.

64 unit tests, 451 assertions, 2226 lines of unit tests at 90% line coverage.

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

[1.1.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v1.1.0%0Dv1.0.1#diff
[1.2.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v1.2.0%0Dv1.1.0#diff
[1.3.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v1.3.0%0Dv1.2.6#diff
[1.4.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v1.4.0%0Dv1.3.2#diff
[2.0.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v2.0.0%0Dv1.4.2#diff
[2.1.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v2.1.0%0Dv2.0.0#diff
[2.2.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v2.2.0%0Dv2.1.2#diff
[2.3.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v2.3.0%0Dv2.2.2#diff
[2.4.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v2.4.0%0Dv2.3.0#diff
[3.0.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v3.0.0%0Dv2.4.1#diff
[3.1.0]: https://bitbucket.org/codsen/string-strip-html/branches/compare/v3.1.0%0Dv3.0.2#diff
