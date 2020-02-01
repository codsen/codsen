# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.11.19](https://gitlab.com/codsen/codsen/compare/string-match-left-right@3.11.18...string-match-left-right@3.11.19) (2020-02-01)

**Note:** Version bump only for package string-match-left-right





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
