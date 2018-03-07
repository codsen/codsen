# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [7.1.2] - 2018-03-06
### Added
- 🔧 Updated all dependencies again. I was/am tinkering with [string-match-left-right](https://github.com/codsen/string-match-left-right) and its previous version could have caused `throw`s on certain cases. Sorry about that. Big features are coming soon for compensation 😋.

## [7.1.0] - 2018-02-16
### Added
- ✨ Updated all dependencies.
- ✨ Fixed some edge-cases where variables could have been wrapped where they shouldn't have been wrapped and the opposite.

## [7.0.0] - 2018-02-14

Full rewrite. Same and more unit tests.

### Changed
- ✨ Variables now can be fetched from the parent nodes, all the way up until root. Priority order: 1. key with variable's name at the same level; 2. data store at same level; 3. key with variable's name at parent node's level; 4. data store at parent's level ... and so on, until root is reached.
- ✨ Now the program will pretty much never throw. If you feed incomplete heads or tails, it will leave them unouched rather than throw an error about them. I'll implement strict mode later.
- ✨ Way leaner and efficient algorithm and dependencies' choice.
- ✨ Added more unit tests too.

## [6.0.0] - 2018-01-02

**Small but nonetheless breaking changes.**

### Changed
- ✨ Mismatching wrapping/nonwrapping heads and tails are not permitted any more. Either both are wrapping or both are non-wrapping. If you used this library in normal ways you should not see the difference. The benefits of this changes are huge - we have completely rehauled _head_ and _tail_ detection (see below) and accepting only matching pairs allows us to identify more false-positives.

Bumping _semver major_ just in case (could have bumped minor) but let's better be safe than sorry 😉

### Improved
- ✨ Improved _head_ and _tail_ detection algorithm. Previously we used simple string search, without considering the order of the findings. Wrong order now will help to rule-out more false positives.
- ✨ Tapped [ast-monkey-traverse](https://www.npmjs.com/package/ast-monkey-traverse) directly, without the need for the whole [ast-monkey](https://www.npmjs.com/package/ast-monkey).
- ✨ Many other improvements on the setup

## [5.0.0] - 2017-12-15
### Changed
- ✨ Rebased in ES Modules
- ✨ Set up Rollup to generate three builds: CommonJS, UMD and ES Modules
- ✨ Dropped JS Standard and tapped raw ESLint on `airbnb-base` preset, with an override to ban semicolons

## [4.6.0] - 2017-07-29
### Removed
- Replaced `object-assign` with ES6 `Object.assign`

## [4.5.0] - 2017-05-23
### Added
- ✨ Separated the `arrayiffy-if-string` into a standalone library and tapped it.

## [4.4.0] - 2017-05-20
### Updated
- Deps
- Codsen name

## [4.3.0] - 2017-05-15
### Added
- ✨ Switched to [check-types-mini](https://www.npmjs.com/package/check-types-mini) and removed internal equivalents.

## [4.2.0] - 2017-05-05
### Added
- ✨ `opts.resolveToFalseIfAnyValuesContainBool` (on by default)
- ✨ `opts.throwWhenNonStringInsertedInString` (off by default)
- ✨ Now allowing to query deeper-level values. For example:

```js
jv(
  {
    a: 'some text %%_b.key2_%% more text',
    b: {
      key1: 'val1',
      key2: 'val2',
      key3: 'val3'
    }
  }
)
// => {
//      a: 'some text val2 more text',
//      b: {
//        key1: 'val1',
//        key2: 'val2',
//        key3: 'val3'
//      }
//    }
```

- Obviously, the new changes above threw the `opts.dontWrapVars` out of track a little bit since instead of `key` now we've possibly got `key.key[element.key]`, so I fixed that too and added more unit tests.

Blimey, we've got 99 unit tests! 🍾 We'll need to celebrate the 100th! 🍻✨

## [4.1.0] - 2017-05-03

### Added
- ✨ Variables are not correctly resolved from linking to the same (deeper) level. If not found, search continues in that level's data store key (default key name for data stores is `<same-key-name>_data`). If not found there, search jumps to root level, and looks for key there. If not found, search continues for data store at the root. If failed, error is thrown.
- ✨ Some rebasing done to clean things up 🚿.

## [4.0.0] - 2017-04-30

Breaking changes in the API, or rather output. When Boolean values are encountered and written as values (and no other string characters are present on the original placeholder), we output empty string, not `false` or `true`. Nobody needs Booleans converted to String. I need this for my email templating projects. 🦄

### Changed
- JSON specs allow various kinds of types to be placed as key values: Booleans, arrays, plain objects and even `null`. In this release we loosen the restrictions and allow these different types to be resolved as values, particularly, `null` and Booleans.

### Added
- ✨ `opts.resolveToBoolIfAnyValuesContainBool` - if `true` (default), if any variable's value is Boolean, upon resolving it will set the whole value to itself. For example, `aaaa %%_var_%% bbbbb` and `var=true` would resolve to `true`. If setting is `false`, it will resolve to empty string, in this example's case, `aaaa  bbbbb`. I don't see why anybody would set it to other value than `default`, but hey, the more freedom the better.
- ✨ `opts.resolveToFalseIfAnyValuesContainBool` - if Boolean variable is enountered, the whole thing always resolves to `false`. Even if the first encountered variable's value was `true`. This is needed for email templating, so that when Booleans are encountered, we bail setting the whole thing to `false`.

## [3.0.0] - 2017-04-27
### Added
- ✨ `opts.headsNoWrap` (default `%%-`) & `opts.tailsNoWrap` (default `-%%`). When the same string has multiple occasions of a variable and we want some variables to be wrapped but some not it was previously impossible. Wrapping ignores were global. Now not. I came with an idea to allow different (customiseable) `heads` and `tails` which prevent wrapping on the variable it marks.
### Changed
- `opts.wrapHeads` is now `opts.wrapHeadsWith`
- `opts.wrapTails` is now `opts.wrapTailsWith`

## [2.0.0] - 2017-04-25
### Changed
- Breaking changes & major semver version bump: `opts.dontWrapVarsStartingWith` and `opts.dontWrapVarsEndingWith` merged into one and allow wildcards now. It's way more powerful since you can _glob_ not only the starting/ending pieces of string but _anything within it_. You can put a wildcard in the middle now or even multiple wildcards!

## [1.2.0] - 2017-04-20
### Added
- ✨ If any key's value contains only a heads or tails marker and nothing else, it will not throw. You can force throwing (that's previous version's behaviour) setting `opts.noSingleMarkers` to `true`. But the default is `false`.
### Improved
- Did some code rebasing.

## [1.1.0] - 2017-04-06
### Improved
- Fixed one edge case where the source was array, it was querying variable from `_data` key store, which was in turn querying variable from its key data store.
- More tests to keep coverage at 100%

## 1.0.0 - 2017-03-28
### New
- ✨ First public release

[1.1.0]: https://github.com/codsen/json-variables/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/codsen/json-variables/compare/v1.1.0...v1.2.0
[2.0.0]: https://github.com/codsen/json-variables/compare/v1.2.0...v2.0.0
[3.0.0]: https://github.com/codsen/json-variables/compare/v2.0.0...v3.0.0
[4.0.0]: https://github.com/codsen/json-variables/compare/v3.1.0...v4.0.0
[4.1.0]: https://github.com/codsen/json-variables/compare/v4.0.1...v4.1.0
[4.2.0]: https://github.com/codsen/json-variables/compare/v4.1.0...v4.2.0
[4.3.0]: https://github.com/codsen/json-variables/compare/v4.2.3...v4.3.0
[4.4.0]: https://github.com/codsen/json-variables/compare/v4.3.0...v4.4.0
[4.5.0]: https://github.com/codsen/json-variables/compare/v4.4.0...v4.5.0
[4.6.0]: https://github.com/codsen/json-variables/compare/v4.5.0...v4.6.0
[5.0.0]: https://github.com/codsen/json-variables/compare/v4.6.0...v5.0.0
[6.0.0]: https://github.com/codsen/json-variables/compare/v5.0.0...v6.0.0
[7.0.0]: https://github.com/codsen/json-variables/compare/v6.0.0...v7.0.0
[7.1.0]: https://github.com/codsen/json-variables/compare/v7.0.0...v7.1.0
[7.1.2]: https://github.com/codsen/json-variables/compare/v7.1.0...v7.1.2
