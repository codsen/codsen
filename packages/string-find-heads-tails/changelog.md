# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.2.0] - 2018-01-03
### Added
- ✨ `opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder`

## [3.1.0] - 2018-01-02
No new features, only under-bonnet improvements.

- ✨ Pinned all unit tests' throws to exact errors. Practically, this means we test not only does it throw in particular case, but also does it raise the exact error that we intended to raise.

## [3.0.0] - 2017-12-28
### Breaking API changes
- ✨ Moved fourth argument, `fromIndex`, into `opts` because it stood in the way.

### New
- ✨ `opts.throwWhenSomethingWrongIsDetected` – When I tapped this API myself for the first time, I noticed errors with heads and tails should be `throw`n here, at this package, not at its consumers. For example, both heads and tails are found but they're in the opposite order. Now, the default settings will leads to `throw`n error. You can turn it off and make it behave like previous version by setting `opts.throwWhenSomethingWrongIsDetected` to `false`
- ✨ `opts.allowWholeValueToBeOnlyHeadsOrTails` — When processing JSON data structures, it's possible that they will contain their own config. For example, JSON will use heads and tails, but also, there will be fields that DEFINE those heads and tails as well. This is a peculiar case - whole string will be equal to heads or tails. These cases will be recognised and errors won't be `throw`n. Unless you set `opts.allowWholeValueToBeOnlyHeadsOrTails` to `false`.
- ✨ `optssource` - allows to `throw` errors in different name. Useful for parent libraries.

## [2.0.0] - 2017-12-27
### Changes
Complete rewrite of the API.

- ✨ When I tried to use it, I understood that I didn't like the `v.1` API at all. Reporting only first character indexes of heads and tails was a compromise, done only because the previous API's did the same. However, that is witholding the information - we can and we will give user more: where each heads and tails start and end. Also, we are going to abolish this separation of heads and tails into two arrays. Each heads/tails set will be sitting in a plain object. They are both pieces of a single set. That's why they belong together.

Example result of `v.1` API:

```js
[
  [3, 15],
  [9, 21],
]
```

now the same example in `v.2` API:

```js
[
  {
    headsStartAt: 3,
    headsEndAt: 6,
    tailsStartAt: 9,
    tailsEndAt: 12,
  },
  {
    headsStartAt: 15,
    headsEndAt: 18,
    tailsStartAt: 21,
    tailsEndAt: 24,
  },
]
```

## 1.0.0 - 2017-12-22
### New
- ✨ First public release

[3.2.0]: https://github.com/codsen/string-find-heads-tails/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/codsen/string-find-heads-tails/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/codsen/string-find-heads-tails/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/codsen/string-find-heads-tails/compare/v1.0.0...v2.0.0
