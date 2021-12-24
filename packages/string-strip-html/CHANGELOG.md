# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 9.1.0 (2021-11-22)

### Features

- opts.ignoreTagsWithTheirContents ([39dad96](https://github.com/codsen/codsen/commit/39dad967940208f7ac0e88fb1faa04a019f83b75))
- opts.stripRecognisedHTMLOnly ([50010a8](https://github.com/codsen/codsen/commit/50010a8e48fd4c66a7160da8a6400942d6eca102))

## 9.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 8.3.0 (2021-05-24)

### Bug Fixes

- skip jinja-nunjucks tags to run faster ([307a578](https://github.com/codsen/codsen/commit/307a5784278b94f4287cf8306f7c19f40e68ca43))

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 8.2.12 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 8.2.0 (2021-02-07)

### Features

- better recognition for Rails or Phoenix templating tags ([9aeddc3](https://github.com/codsen/codsen/commit/9aeddc3e47d7e488b6c63f205df3f7a05c78c017)), closes [#2](https://github.com/codsen/codsen/issues/2)

## 8.1.0 (2021-01-28)

### Features

- extend ESP tag recognition to all <%... tags ([d552f86](https://github.com/codsen/codsen/commit/d552f86f98d7e2d9743e709dd088ea2ba8d011dc))

## 8.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 8.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([e6fe544](https://github.com/codsen/codsen/commit/e6fe544cb94727b18793d0e13303ee3b407cde1b))

### BREAKING CHANGES

- previously you'd consume like: `import stripHtml from ...` - now: `import { stripHtml } from ...`

## 7.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

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
