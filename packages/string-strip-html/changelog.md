# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.6](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/compare/string-strip-html@3.3.5...string-strip-html@3.3.6) (2019-01-02)

**Note:** Version bump only for package string-strip-html

## [3.3.5](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/compare/string-strip-html@3.3.4...string-strip-html@3.3.5) (2019-01-01)

**Note:** Version bump only for package string-strip-html

## [3.3.4](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/compare/string-strip-html@3.3.3...string-strip-html@3.3.4) (2018-12-29)

**Note:** Version bump only for package string-strip-html

## [3.3.3](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/compare/string-strip-html@3.3.2...string-strip-html@3.3.3) (2018-12-29)

**Note:** Version bump only for package string-strip-html

## [3.3.2](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/compare/string-strip-html@3.3.1...string-strip-html@3.3.2) (2018-12-27)

**Note:** Version bump only for package string-strip-html

## [3.3.1](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/compare/string-strip-html@3.3.0...string-strip-html@3.3.1) (2018-12-27)

**Note:** Version bump only for package string-strip-html

# 3.3.0 (2018-12-26)

### Bug Fixes

- throwing case when tag is the last in string and has closing bracket missing ([ef44f63](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/commits/ef44f63))

### Features

- algorithm improvements ([8a82b8e](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/commits/8a82b8e))
- delete trailing whitespace after dirty code chunk: tag + missing opening bracket tag ([71f720c](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/commits/71f720c))
- improvements to exclamation mark punctuation ([e31fd3b](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/commits/e31fd3b))
- opts.dumpLinkHrefsNearby and algorithm improvements ([777407e](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/commits/777407e))
- opts.onlyStripTags ([7bb49c8](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/commits/7bb49c8))
- opts.trimOnlySpaces ([b8c6f29](https://bitbucket.org/codsen/codsen/src/master/packages/string-strip-html/commits/b8c6f29))

## 3.2.0 (2018-07-22)

- ✨ Fixed `opts.returnRangesOnly` - when there are no HTML tags in the input and the option is on, an empty array is returned (as opposed to the input string, incorrectly returned previously). Sorry about that.

## 3.1.0 (2018-07-17)

- ✨ Added `opts.onlyStripTags`

# 3.0.0 (2018-07-03)

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

## 2.4.0 (2018-06-20)

- ✨ Two `range-` dependencies have been renamed, namely [ranges-push](https://www.npmjs.com/package/ranges-push) and [ranges-apply](https://www.npmjs.com/package/ranges-apply). We tapped them.

## 2.3.0 (2018-06-08)

- ✨ Improvements to dirty code recognition algorithm

## 2.2.0 (2018-06-02)

- ✨ `opts.dumpLinkHrefsNearby` - handy when producing Email Text versions
- ✨ Improved algorithm to understand HTML code that has been abruptly chopped off. If you select bunch of HTML where beginning is valid, but ending is somewhere in the middle of the tags, styles or whatnot, now that tag will be removed.
- ✨ Improved algorithm to detect and clean tags without closing bracket, if a new tag follows, with or without whitespace in between.

64 unit tests, 451 assertions, 2226 lines of unit tests at 90% line coverage.

## 2.1.0 (2018-05-31)

- ✨ `opts.trimOnlySpaces` - up until now, by default, the outsides of the string was trimmed using `String.trim()` which erased:

  - non-breaking spaces (in combination with recursive entity decoding this means `&nbsp;` will also be erased)
  - tabs
  - line breaks (`\n`), carriage returns (`\r`) and combination thereof (`\r\n`)
  - some other less common but space-like characters.

  This becomes a challenge in automated environments where data is considered to be clean and multiple datum can be parts of another. For example, we might be cleaning JSON fields where value is "sandwitched" out of three fields: "Hi&nbsp;", "%%-firstname-%%", ", welcome to special club!". To improve formatting, some outer spaces like after "Hi" can be replaced with a non-breaking space. This way, words would never wrap there. However, if all fields were cleaned by a tool which used this HTML stripping function, outer non-breaking spaces would get deleted and result would end up: "HiJohn, welcome to special club!". This option makes trimming more strict - only spaces deleted during string trimming.

# 2.0.0 (2018-05-30)

One day I noticed that my Nunjucks code (just a greater-than comparison against a number) gets falsely interpreted as HTML by this library and went on to rewrite the whole thing from scratch. Now it's leaner, cleaner and with the same and double extra more unit tests.

### Added

- ✨ An even smarter algorithm, now being able to detect missing opening bracket on a tag, for example. Even latest Chrome `v.66` can't do that.
- ✨ Increased unit test assertion count from 148 to 370. Covering even more legit and stinky code cases.
- ✨ `opts.returnRangesOnly`

## 1.4.0 (2018-05-11)

### Improved

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. It means, we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 1.3.0 (2018-02-19)

### Added

- ✨ Now strips HTML comments too.

## 1.2.0 (2017-12-31)

### Improved

- ✨ Improvements to `opts.stripTogetherWithTheirContents` and done a lot of rebasing.

## 1.1.0 (2017-12-07)

### Added

- ✨ `opts.stripTogetherWithTheirContents`

## 1.0.0 (2017-11-27)

### Added

- ✨ First public release
