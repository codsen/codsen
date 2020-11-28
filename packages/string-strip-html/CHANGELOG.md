# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.0.0 (2020-11-28)

### Bug Fixes

- correct filteredTagLocations for pair tags which are stripped with content ([6bd6f4c](https://git.sr.ht/~royston/codsen/commits/6bd6f4c8639571089bb3baa3b8146045ca891375))
- fix filteredTagLocations closing location on paired tags ([43ce393](https://git.sr.ht/~royston/codsen/commits/43ce393391f81dcc8de4e3de70e463356f4d0af5))
- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
- throwing case when tag is the last in string and has closing bracket missing ([ef44f63](https://git.sr.ht/~royston/codsen/commits/ef44f63729275c9fd40496ba1922a9be0ed3c968))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- add previously missing tag.lastClosingBracketAt on ignored tags ([f35e595](https://git.sr.ht/~royston/codsen/commits/f35e5954eed7b9b0e9c8df54e1680607f7ef0718))
- algorithm improvements ([5c2a45f](https://git.sr.ht/~royston/codsen/commits/5c2a45f176cbb3ff200668ab2357571ccec4ba09))
- algorithm improvements ([8a82b8e](https://git.sr.ht/~royston/codsen/commits/8a82b8e61e9851d520ea7bfd4a0f6e26e6e8c258))
- align applied opts.returnRangesOnly output to default returned string ([d32096d](https://git.sr.ht/~royston/codsen/commits/d32096d0b763b88ba36c40da4935d62ee9041ead))
- better recognise some JSON patterns ([450d30a](https://git.sr.ht/~royston/codsen/commits/450d30a9a662ab9097da9661c515979ae35651a7))
- delete trailing whitespace after dirty code chunk: tag + missing opening bracket tag ([71f720c](https://git.sr.ht/~royston/codsen/commits/71f720cbd7dbb3a3e650088cbcdb54307e316ae0))
- harden the linting rules and make them all pass ([812d17e](https://git.sr.ht/~royston/codsen/commits/812d17e02f2d2e1d45e05e94c64ef28a4b3eb017))
- implement callback interface, opts.cb() ([79bc8dc](https://git.sr.ht/~royston/codsen/commits/79bc8dc7f5bdcebf6ba8d4ba677b9f137d0f1eb7))
- improve the algorithm, if tag's name starts with a digit that's not a tag ([d548cdb](https://git.sr.ht/~royston/codsen/commits/d548cdb129b95ae784aeda00d59d7e2f020dd8ad))
- improvements for JSP recognition ([1fa513c](https://git.sr.ht/~royston/codsen/commits/1fa513c1d9aec37ad17d0c09193a1875fdb4177d))
- improvements to exclamation mark punctuation ([e31fd3b](https://git.sr.ht/~royston/codsen/commits/e31fd3b2b0903c4643b64a4ac0fd67d557810de1))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- make the callback (opts.cb) ping the ignored tags too ([d9302e7](https://git.sr.ht/~royston/codsen/commits/d9302e7e49e38ae704f1d005f08abb22acbce615))
- Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
- now returns keys: result, ranges, allTagLocations, filteredTagLocations ([567a0bd](https://git.sr.ht/~royston/codsen/commits/567a0bdfd2a7663c656f8b7615b048e11f28f4c2))
- opts.dumpLinkHrefsNearby and algorithm improvements ([777407e](https://git.sr.ht/~royston/codsen/commits/777407eb1807af72a9469e0a0399334d1716fc63))
- opts.onlyStripTags ([7bb49c8](https://git.sr.ht/~royston/codsen/commits/7bb49c8eddec216782e9b52a83f42916eb2e5cfa))
- opts.trimOnlySpaces ([b8c6f29](https://git.sr.ht/~royston/codsen/commits/b8c6f293f62c013df47d44e13a679dd5c9496674))
- punctuation doesn't terminate the tag ([64e7628](https://git.sr.ht/~royston/codsen/commits/64e76283c79be9a52a20e1594c3ca2839d3cb024))
- recognise greater than signs followed by numbers only ([418a689](https://git.sr.ht/~royston/codsen/commits/418a689e1eeb88e8dda84ec4614fd1589eb7cc0c)), closes [#32](https://git.sr.ht/~royston/codsen/issues/32)
- report tag.slashPresent as index of the slash, not as a boolean ([96ce6c8](https://git.sr.ht/~royston/codsen/commits/96ce6c80b8a33078258687ca2a6fb14010d6c2b9))
- respect double line breaks ([2c09d59](https://git.sr.ht/~royston/codsen/commits/2c09d59479e32cc5b5d499510f4d877c63fa1c95)), closes [#15](https://git.sr.ht/~royston/codsen/issues/15)
- skip JSP tags ([733fe9f](https://git.sr.ht/~royston/codsen/commits/733fe9f0d00f721fe7f1940df00514e875ffe2f7))
- wildcard ALL option for opts.stripTogetherWithTheirContents ([d2031ab](https://git.sr.ht/~royston/codsen/commits/d2031ab11260a24f436cef64ca5d8d43b9ae10e1))

### BREAKING CHANGES

- now filteredTagLocations shows only one range for pair tags which are to be
stripped with their contents
- now returns keys: result, ranges, allTagLocations, filteredTagLocations - no more
opts.returnRangesOnly
- align applied opts.returnRangesOnly output to default returned string
- Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead

## 6.3.0 (2020-11-10)

### Features

- algorithm improvements ([5c2a45f](https://gitlab.com/codsen/codsen/commit/5c2a45f176cbb3ff200668ab2357571ccec4ba09))

## 6.2.0 (2020-10-26)

### Features

- better recognise some JSON patterns ([450d30a](https://gitlab.com/codsen/codsen/commit/450d30a9a662ab9097da9661c515979ae35651a7))

## 6.1.0 (2020-10-13)

### Bug Fixes

- fix filteredTagLocations closing location on paired tags ([43ce393](https://gitlab.com/codsen/codsen/commit/43ce393391f81dcc8de4e3de70e463356f4d0af5))

### Features

- wildcard ALL option for `opts.stripTogetherWithTheirContents` ([d2031ab](https://gitlab.com/codsen/codsen/commit/d2031ab11260a24f436cef64ca5d8d43b9ae10e1))

## 6.0.0 (2020-09-15)

### Bug Fixes

- correct `filteredTagLocations` for pair tags which are stripped with content ([6bd6f4c](https://gitlab.com/codsen/codsen/commit/6bd6f4c8639571089bb3baa3b8146045ca891375))

### BREAKING CHANGES

- now filteredTagLocations shows only one range for pair tags which are to be
  stripped with their contents

## 5.0.0 (2020-08-16)

Why change what's returned, upon user's request, when we can return everything and let the user pick?

### BREAKING CHANGES

That's why we removed `opts.returnRangesOnly`.

Function's output is a plain object now, containing:

1. cleaned string (considering `opts.ignoreTags` and `opts.onlyStripTags`)
2. gathered _ranges_, used to produce cleaned string (considering `opts.ignoreTags` and `opts.onlyStripTags`)
3. tag locations of all spotted HTML tags IGNORING the whitelist/blacklist `opts.ignoreTags` and `opts.onlyStripTags`
4. locations of filtered HTML tags (considering `opts.ignoreTags` and `opts.onlyStripTags`)
5. plus, some statistics goodies

```js
stripHtml("abc<a>click me</a>def");
// => {
//      log: {
//        timeTakenInMilliseconds: 6
//      },
//      result: "abc click me def",
//      ranges: [
//        [3, 6, " "],
//        [14, 18, " "],
//      ],
//      allTagLocations: [
//        [3, 6],
//        [14, 18],
//      ],
//      filteredTagLocations: [
//        [3, 6],
//        [14, 18],
//      ],
//    }
```

`allTagLocations` can be used for syntax highlighting, for example.

**Migration instructions:**

Previously, function on defaults returned result string. Now it's under `result` key, in output plain object.
Previously, you could request _ranges_ output via `opts.returnRangesOnly`. Now _ranges_ are always present under key `ranges`.

Some people mistakenly took _ranges_ output for exact tag locations. Now exact tag locations are under `allTagLocations` key.

That's different from _ranges_ output, because _ranges_ are instructions: what to add, what to replace and can be merged and their character indexes covered will include whitespace management.

`allTagLocations`, on other hand, are exact tag locations. If you slice them using `String.slice()` you'll get string from bracket-to-bracket like `<a>`.

## 4.4.0 (2020-04-26)

### Features

- harden the linting rules and make them all pass ([812d17e](https://gitlab.com/codsen/codsen/commit/812d17e02f2d2e1d45e05e94c64ef28a4b3eb017))

## 4.3.0 (2019-09-23)

### Features

- respect double line breaks ([2c09d59](https://gitlab.com/codsen/codsen/commit/2c09d59)), closes [#15](https://gitlab.com/codsen/codsen/issues/15)

## 4.2.0 (2019-09-04)

### Features

- add previously missing tag.lastClosingBracketAt on ignored tags ([f35e595](https://gitlab.com/codsen/codsen/commit/f35e595))
- make the callback (opts.cb) ping the ignored tags too ([d9302e7](https://gitlab.com/codsen/codsen/commit/d9302e7))
- report tag.slashPresent as index of the slash, not as a boolean ([96ce6c8](https://gitlab.com/codsen/codsen/commit/96ce6c8))

## 4.1.0 (2019-08-24)

### Features

- implement callback interface, opts.cb() ([79bc8dc](https://gitlab.com/codsen/codsen/commit/79bc8dc))

## 3.5.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-12-26)

### Bug Fixes

- 🐛 Throwing case when tag is the last in string and has closing bracket missing ([ef44f63](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html/commits/ef44f63))

### Features

- ✨ Algorithm improvements ([8a82b8e](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html/commits/8a82b8e))
- ✨ Delete trailing whitespace after dirty code chunk: tag + missing opening bracket tag ([71f720c](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html/commits/71f720c))
- ✨ Improvements to exclamation mark punctuation ([e31fd3b](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html/commits/e31fd3b))
- ✨ `opts.dumpLinkHrefsNearby` and algorithm improvements ([777407e](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html/commits/777407e))
- ✨ Add `opts.onlyStripTags` ([7bb49c8](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html/commits/7bb49c8))
- ✨ Add `opts.trimOnlySpaces` ([b8c6f29](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html/commits/b8c6f29))

## 3.2.0 (2018-07-22)

- ✨ Fixed `opts.returnRangesOnly` - when there are no HTML tags in the input and the option is on, an empty array is returned (as opposed to the input string, incorrectly returned previously). Sorry about that.

## 3.1.0 (2018-07-17)

- ✨ Added `opts.onlyStripTags`

## 3.0.0 (2018-07-03)

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

## 2.0.0 (2018-05-30)

One day I noticed that my [Nunjucks](https://mozilla.github.io/nunjucks/) code (just a greater-than comparison against a number) gets falsely interpreted as HTML by this library and went on to rewrite the whole thing from scratch. Now it's leaner, cleaner and with the same and double extra more unit tests.

### Added

- ✨ An even smarter algorithm, now being able to detect missing opening bracket on a tag, for example. Even latest Chrome `v.66` can't do that.
- ✨ Increased unit test assertion count from 148 to 370. Covering even more legit and stinky code cases.
- ✨ `opts.returnRangesOnly`

## 1.4.0 (2018-05-11)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. It means, we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 1.3.0 (2018-02-19)

- ✨ Now strips HTML comments too.

## 1.2.0 (2017-12-31)

- ✨ Improvements to `opts.stripTogetherWithTheirContents` and done a lot of rebasing.

## 1.1.0 (2017-12-07)

- ✨ Add `opts.stripTogetherWithTheirContents`

## 1.0.0 (2017-11-27)

- ✨ First public release
