# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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

[2.0.0]: https://github.com/codsen/string-find-heads-tails/compare/v1.0.0...v2.0.0
