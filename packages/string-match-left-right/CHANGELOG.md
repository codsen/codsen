# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 8.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 7.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 7.0.9 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 7.0.0 (2021-02-27)

### Bug Fixes

- if the first char was matched, don't tolerate any mismatches leading up to it ([c482851](https://github.com/codsen/codsen/commit/c4828514dfcca6470d895f0b35801eac1faf2f7a))

### Features

- algorithm improvements to avoid false positives in too early matches ([552df88](https://github.com/codsen/codsen/commit/552df885c6d97b5e1d8c5767071d0b993f214052))
- opts.hungry ([68b1c0f](https://github.com/codsen/codsen/commit/68b1c0fae857573c2230a5baea1b149e1a87eeb5))

### BREAKING CHANGES

- This flag, disabled by default, prevents from too-eager matching in the beginning,
  wasting `maxMismatches`. To get old behaviour like before this release, set `opts.hungry` to `true`.

## 6.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 6.0.0 (2021-01-23)

### Features

- rewrite in TS ([390a399](https://github.com/codsen/codsen/commit/390a3993c5296232eb540591af4262285863bc5e))

### BREAKING CHANGES

- there should be no API changes, but we're bumping _major_ just in case

## 5.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 4.0.1 (2020-03-24)

### Bug Fixes

- fix `opts.firstMustMatch` ([195350b](https://gitlab.com/codsen/codsen/commit/195350b56c26d3e856b5cd3d1a2abb947c9ada3d))

## 4.0.0 (2020-03-16)

### Bug Fixes

- `opts.maxMismatches` higher than one ([c0a416a](https://gitlab.com/codsen/codsen/commit/c0a416afd32aa39698703437aed36b81cb04abd6))
- add insurance against the variable being not string ([e53f435](https://gitlab.com/codsen/codsen/commit/e53f435206b1b2daf1e7d9c45c8373933d09eca9))
- fix `opts.matchRight` ([ba40509](https://gitlab.com/codsen/codsen/commit/ba40509c63463e2579efd9ebfdd21b97e6faa665))
- fix maxMismatches ([be34351](https://gitlab.com/codsen/codsen/commit/be34351d02b683b191af669a33e896c04f49aacf))
- fix the excessive skipping ([e97899d](https://gitlab.com/codsen/codsen/commit/e97899d92ff5794e817ff2b24ece83e1b4d3b327))
- insurance against undefined value ([a0d5193](https://gitlab.com/codsen/codsen/commit/a0d519349b1b53852b1e6ce1948c24eb1f855667))

### Features

- `opts.maxMismatches` ([5288fe9](https://gitlab.com/codsen/codsen/commit/5288fe9667a34a3f447c3c13a63629bc9132b4ff))
- case when character is omitted from the source and maxMismatches allows that ([1b47eba](https://gitlab.com/codsen/codsen/commit/1b47eba3683b77511c45d02b4f2553db729ff401))
- merge marchForward and marchBackward into one, simplify the API ([e873ee6](https://gitlab.com/codsen/codsen/commit/e873ee652da54e352c52419042e0327b3a49cdd5))
- opts.lastMustMatch ([12ad597](https://gitlab.com/codsen/codsen/commit/12ad597c9b84d34208be620f1a8ef605b62beceb))
- opts.skipWhitespace ([6d9c847](https://gitlab.com/codsen/codsen/commit/6d9c8479f090b22bee4d70230d2d069f198e7e81))
- rebase to make twice as fast ([4530b9f](https://gitlab.com/codsen/codsen/commit/4530b9f98357654f1a35552b80810ce158dce3bd))
- remove opts.skipInnerWhitespace ([541c1c5](https://gitlab.com/codsen/codsen/commit/541c1c5b47e1667e77328ba586e1e5cc725fcad9))

### BREAKING CHANGES

- no more opts.relaxedApi - it's relaxed as much as possible by default, no
  emoji-related code

## CHANGES

- ✨ Remove anything emoji-related to make things run faster. Emoji can be of varying length and previous algorithm worked only for 2 character-long emojis only anyway. And there can be emoji as long as 8 characters.
- ✨ Remove `opts.relaxedApi` - now it's always relaxed. Idea is, this is an internal library, if parent programs want to check something, let them do so.

## 3.11.0 (2019-08-08)

### Features

- second callback's argument returns empty string when EOL is reached (previously - undefined) ([b480821](https://gitlab.com/codsen/codsen/commit/b480821))

## 3.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.6.0 (2018-12-26)

- ✨ Add `EOL` matching and code refresh ([ca834a7](https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right/commits/ca834a7))
- ✨ Add `opts.relaxedApi` ([f30626c](https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right/commits/f30626c))

## 3.5.0 (2018-12-04)

- ✨ **NEW!** Now you can match against `EOL` - end of string (beginning or ending). Since you can't pass letters `"EOL"`, you must pass them as an ES6 arrow function, `() => "EOL"`. In all other aspects, the use is the same.
- 🔧 Previously, `opts.cb` second argument, which means the rest of the string on particular side, depending on the method called, left or right, was giving empty string when there was nothing on that side. This, however looked inconsistent when all other callback values were `undefined`. Now, second `opts.cb` argument comes as `undefined` instead of `empty` string when there's nothing to return.
- ✨ Implemented and released (but not documented) `opts.strictApi` was merged with `opts.relaxedApi`
- ✨ Restored unit test coverage and ava linting

## 3.4.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 3.3.0 (2018-05-16)

- ✨ Add `opts.relaxedApi`

## 3.2.0 (2018-05-15)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed
- ✨ Removed `DEBUG` statements from the code
- ✨ Added `esm` config to package.json which somehow enables CJS compat in `ava`.

## 3.1.1 (2018-03-06)

- 🔧 Looks like the new callback feature was causing throws on certain cases. Not any more. Sorry about that. Very big release in coming soon with great new features. 👍

## 3.1.0 (2018-03-01)

- ✨ Add the third argument, `whatToMatch`, can now be empty string. In such case, you have to provide callback and result will be calculated purely using the callback. It's handy when you want to perform complex matching, beyond "character is equal to" level. Personally, I reached this level and it's necessary for the feature I'm producing on the other package. It must be handy for everybody else too.

## 3.0.0 (2018-01-15)

- ✨ Rewrote a lot of code, relieving us from all `lodash` dependencies.
- ✨ `opts.trimCharsBeforeMatching` must be a string of single character or an array of single characters. Previously merged string of characters was accepted but now it's not accepted.
- ✨ Callback `cb` now returns three arguments:

  1.  `char` - the character just outside of the matched substring (as previously)
  2.  `theRemainderOfTheString` - whole string outside of the matched substring (as previously)
  3.  `index` - NEW - the index of the `char`.

  Index is handy in cases when you set trimming and it's not clear where exactly is the `char` located in the string. Also, from here you can easily calculate the index of the match - just substract its length from `index`.

### Fixed

- 🔧 I think `matchLeftIncl` previously was returning `theRemainderOfTheString` **together with the matched substring** (on the right of it). That's against the spec because the spec says "everything outside of the matched substring is given". But not including it. Sorry for this error. I'll bump the _major_ just in case the correct behaviour breaks somebody's code.

## 2.0.0 (2017-12-21)

### Changed

- ✨ Let's say you want to check, does a string contain "something" to the right or to the left of somewhere in it (a given index). We allow "something" to be an **array** of strings. If those strings are of a varying length, how do you find out, what exactly did match from the "something" array and especially, how long it is? As a solution for that, I'm going to return a positive result not Boolean `true` which is meaningless, but actually the value of a matched string from "something". It is equally `truthy` but you can now query it further, like find its `length`.

**Instructions to upgrade from `1.x`**

If you relied on the result being explicitly Boolean, `true` or `false`, prepare that truthy outcome now will be string. Just us double negation `!!` and you'll convert it to `true`. Or better, you can just use the truthy (string) result in the Boolean logic. It's `truthy` anyway.

- ✨ `opts.cbLeft` and `opts.cbRight` were joined into one, `opts.cb`. Same behaviour, except there's less to think about. Just pass the callback function - it will be called with the substring which is on the left or right, depending if you called left-side (`matchLeftIncl`/`matchLeft`) or right-side (`matchRightIncl`/`matchRight`) method.

## 1.4.0 (2017-12-10)

### Added

- ✨ Stringifying of `opts.trimCharsBeforeMatching` now occurs only if element is not string.
- ✨ Callbacks, [opts.cbLeft and opts.cbRight](https://www.npmjs.com/package/string-match-left-right#optscbleft-and-optscbright), get second argument - whole substring of what's on that side. First argument it received is first character, second is whole substring (including first character).

I needed this when I was coding [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css) and I was traversing the string. I wanted to check, do any of given _heads_ are equal to what's on the right of the current character being traversed. For example, if there are Nunjucks variables in HTML, they would start with `{{` and end with `}}`. I wanted `email-remove-unused-css` to ignore everything between such `heads` and `tails` (which can be customised to anything, to support any templating/programming languages).

## 1.3.0 (2017-11-23)

- ✨ Add `opts.trimCharsBeforeMatching`

## 1.2.0 (2017-11-22)

- ✨ Add `opts.trimBeforeMatching`

## 1.1.0 (2017-10-28)

- ✨ Add `opts.cbLeft`
- ✨ Add `opts.cbRight`

Often you want to check not only what's to the left or right of the certain index in the string, but also perform certain checks on what's even further to the left/right. For example, you have a piace of HTML, `class=` and you are an index which is at character `=`. You can use `string-match-left-right` to check, is `class` on the left using `matchLeft`. Which is fine. There's a gotcha though. You also need to check, what's further to the left of `class=` - is it a character, a space or something else? Because it might be that you looked for `class` attribute but matched `superclass`, an (imaginary) custom attribute!

Here comes in the callback functions.

They have to be callbacks because I can't predict what checks you will want to check on the outer-left and outer-right characters. Just pass your function and this library will feed them (the outer-left and outer-right characters) as arguments. You can then find out yourself what to do about it.

## 1.0.0 (2017-10-28)

- ✨ First public release
