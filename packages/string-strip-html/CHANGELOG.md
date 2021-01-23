# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 8.0.0 (2021-01-23)


### Bug Fixes

* correct filteredTagLocations for pair tags which are stripped with content ([f58f48f](https://github.com/codsen/codsen/commit/f58f48f51d2c0bff0e2c7fd784689bbb97a198a1))
* fix filteredTagLocations closing location on paired tags ([1f289ff](https://github.com/codsen/codsen/commit/1f289ffbbc508a54719e45b7b623fa39a3e8e2fe))
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* make all opts optional, also callback object keys optional ([627ab36](https://github.com/codsen/codsen/commit/627ab36d35f3771cc3c3540735b666a315fb4315))
* throwing case when tag is the last in string and has closing bracket missing ([d62715c](https://github.com/codsen/codsen/commit/d62715cad274ca2fec066189c71a2e61b10f8e8a))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* add previously missing tag.lastClosingBracketAt on ignored tags ([a06ffa6](https://github.com/codsen/codsen/commit/a06ffa6f56d82bf2be16ef5d391be87619ba84a5))
* algorithm improvements ([20d92e3](https://github.com/codsen/codsen/commit/20d92e31724a4aa6a3e2f7f58aad1d90ea4bfd3d))
* algorithm improvements ([765dbb1](https://github.com/codsen/codsen/commit/765dbb1a106fb85489aed3c901c1bdc6901a21fb))
* align applied opts.returnRangesOnly output to default returned string ([e7e5e04](https://github.com/codsen/codsen/commit/e7e5e04d24179c323aad5e738b9bced12a04c890))
* better recognise some JSON patterns ([dfe04c1](https://github.com/codsen/codsen/commit/dfe04c1aba2394c8b6636f8b81b45bc2f823414a))
* delete trailing whitespace after dirty code chunk: tag + missing opening bracket tag ([1aab657](https://github.com/codsen/codsen/commit/1aab6572d42081acdb4ee41b88eb329b328930cd))
* harden the linting rules and make them all pass ([0e0e02d](https://github.com/codsen/codsen/commit/0e0e02d2f00375a9e590cceabcf4d5b7407f683f))
* implement callback interface, opts.cb() ([3cc7c97](https://github.com/codsen/codsen/commit/3cc7c977a48d5d159aa183411c8b78b7de73af3a))
* improve the algorithm, if tag's name starts with a digit that's not a tag ([4206b80](https://github.com/codsen/codsen/commit/4206b807c2a83fed7e5876397803bc3184237850))
* improvements for JSP recognition ([ff23bde](https://github.com/codsen/codsen/commit/ff23bde77ba1a40dfc1259e3aa1715fd5ffa2380))
* improvements to exclamation mark punctuation ([07b64a3](https://github.com/codsen/codsen/commit/07b64a32c9f8015e0c3c5486c546ccf2be364321))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* make the callback (opts.cb) ping the ignored tags too ([8bfc69e](https://github.com/codsen/codsen/commit/8bfc69e2b5162a1495e3429ab9288a30a34382bd))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* now returns keys: result, ranges, allTagLocations, filteredTagLocations ([5321503](https://github.com/codsen/codsen/commit/53215038478c9cc4a1bc68dcd2700a1375c56a43))
* opts.dumpLinkHrefsNearby and algorithm improvements ([920af1b](https://github.com/codsen/codsen/commit/920af1b7f0f54522578c54009c0990d63e15f8f2))
* opts.onlyStripTags ([18a9cf6](https://github.com/codsen/codsen/commit/18a9cf600354da01f2f49aa78c77de91c57939ec))
* opts.trimOnlySpaces ([279b2e7](https://github.com/codsen/codsen/commit/279b2e76b494f9e7ebed0fe2ef71ccbd0e5bc4ce))
* punctuation doesn't terminate the tag ([2e04f60](https://github.com/codsen/codsen/commit/2e04f60a263a5839c47ec7f4aa81099dd5876776))
* recognise greater than signs followed by numbers only ([ee9f6b6](https://github.com/codsen/codsen/commit/ee9f6b63dd0a6496d5745a19692215e7174126a8)), closes [#32](https://github.com/codsen/codsen/issues/32)
* report tag.slashPresent as index of the slash, not as a boolean ([2249abc](https://github.com/codsen/codsen/commit/2249abc2f740c647250e5150e58ae338ac13b73c))
* respect double line breaks ([78001ab](https://github.com/codsen/codsen/commit/78001abfd7e0d478a8a0f2f193908ca4b49ab580)), closes [#15](https://github.com/codsen/codsen/issues/15)
* rewrite in TS, start using named exports ([e6fe544](https://github.com/codsen/codsen/commit/e6fe544cb94727b18793d0e13303ee3b407cde1b))
* skip JSP tags ([4da34b6](https://github.com/codsen/codsen/commit/4da34b6a5d1a0998baaacb024f179de6ef7fef78))
* wildcard ALL option for opts.stripTogetherWithTheirContents ([8da6bc7](https://github.com/codsen/codsen/commit/8da6bc7a4a44db7f6efafaa065a92c527c43a343))


### BREAKING CHANGES

* previously you'd consume like: "import stripHtml from ..." - now: "import {
stripHtml } from ..."
* now filteredTagLocations shows only one range for pair tags which are to be
stripped with their contents
* now returns keys: result, ranges, allTagLocations, filteredTagLocations - no more
opts.returnRangesOnly
* align applied opts.returnRangesOnly output to default returned string
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





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
