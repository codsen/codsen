# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.2.0] - 2017-05-05
### Added
- `opts.resolveToFalseIfAnyValuesContainBool` (on by default)
- `opts.throwWhenNonStringInsertedInString` (off by default)
- Now allowing to query deeper-level values. For example:

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
- Variables are not correctly resolved from linking to the same (deeper) level. If not found, search continues in that level's data store key (default key name for data stores is `<same-key-name>_data`). If not found there, search jumps to root level, and looks for key there. If not found, search continues for data store at the root. If failed, error is thrown.
- Some rebasing done to clean things up 🚿.

## [4.0.0] - 2017-04-30

Breaking changes in the API, or rather output. When Boolean values are encountered and written as values (and no other string characters are present on the original placeholder), we output empty string, not `false` or `true`. Nobody needs Booleans converted to String. I need this for my email templating projects. 🦄

### Changed
- JSON specs allow various kinds of types to be placed as key values: Booleans, arrays, plain objects and even `null`. In this release we loosen the restrictions and allow these different types to be resolved as values, particularly, `null` and Booleans.

### Added
- `opts.resolveToBoolIfAnyValuesContainBool` - if `true` (default), if any variable's value is Boolean, upon resolving it will set the whole value to itself. For example, `aaaa %%_var_%% bbbbb` and `var=true` would resolve to `true`. If setting is `false`, it will resolve to empty string, in this example's case, `aaaa  bbbbb`. I don't see why anybody would set it to other value than `default`, but hey, the more freedom the better.
- `opts.resolveToFalseIfAnyValuesContainBool` - if Boolean variable is enountered, the whole thing always resolves to `false`. Even if the first encountered variable's value was `true`. This is needed for email templating, so that when Booleans are encountered, we bail setting the whole thing to `false`.

## [3.0.0] - 2017-04-27
### Added
- `opts.headsNoWrap` (default `%%-`) & `opts.tailsNoWrap` (default `-%%`). When the same string has multiple occasions of a variable and we want some variables to be wrapped but some not it was previously impossible. Wrapping ignores were global. Now not. I came with an idea to allow different (customiseable) `heads` and `tails` which prevent wrapping on the variable it marks.
### Changed
- `opts.wrapHeads` is now `opts.wrapHeadsWith`
- `opts.wrapTails` is now `opts.wrapTailsWith`

## [2.0.0] - 2017-04-25
### Changed
- Breaking changes & major semver version bump: `opts.dontWrapVarsStartingWith` and `opts.dontWrapVarsEndingWith` merged into one and allow wildcards now. It's way more powerful since you can _glob_ not only the starting/ending pieces of string but _anything within it_. You can put a wildcard in the middle now or even multiple wildcards!

## [1.2.0] - 2017-04-20
### New
- If any key's value contains only a heads or tails marker and nothing else, it will not throw. You can force throwing (that's previous version's behaviour) setting `opts.noSingleMarkers` to `true`. But the default is `false`.
### Improved
- Did some code rebasing.

## [1.1.0] - 2017-04-06
### Improved
- Fixed one edge case where the source was array, it was querying variable from `_data` key store, which was in turn querying variable from its key data store.
- More tests to keep coverage at 100%

## 1.0.0 - 2017-03-28
### New
- First public release

[1.1.0]: https://github.com/code-and-send/json-variables/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/code-and-send/json-variables/compare/v1.1.0...v1.2.0
[2.0.0]: https://github.com/code-and-send/json-variables/compare/v1.2.0...v2.0.0
[3.0.0]: https://github.com/code-and-send/json-variables/compare/v2.0.0...v3.0.0
[3.1.0]: https://github.com/code-and-send/json-variables/compare/v3.0.0...v3.1.0
[4.0.0]: https://github.com/code-and-send/json-variables/compare/v3.1.0...v4.0.0
[4.1.0]: https://github.com/code-and-send/json-variables/compare/v4.0.1...v4.1.0
[4.2.0]: https://github.com/code-and-send/json-variables/compare/v4.1.0...v4.2.0
