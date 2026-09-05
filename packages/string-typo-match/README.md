<h1 align="center">string-typo-match</h1>

<p align="center">Match typing errors against candidate strings with weighted omissions, swaps, and explainable ambiguity</p>

<p align="center">
  <a href="https://codsen.com/os/string-typo-match" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-typo-match" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-typo-match" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-typo-match?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-typo-match.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-typo-match/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

**No dependencies whatsoever.** This package declares no dependencies or devDependencies.

## Features

A `leven` alternative for matching human typing errors against your own dictionary, with optional keyboard awareness and explained suggestions.

- Treat a missing chunk as one typo, with limits on how much can disappear.
- Recognise missed keys, extra characters, repeats, substitutions, and adjacent swaps.
- Enable QWERTY weighting or supply your own keyboard map.
- Tune error costs and allow one or two typo events.
- Keep exact matches, rank fuzzy suggestions, and flag ambiguity.
- Match Unicode code points; explain edits with original-string offsets.
- Prepare dictionaries once; track progress and completion statistics.
- Get TypeScript types, ESM, and a standalone browser script without dependencies.

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
npm i string-typo-match
```

## Quick Take

```js
import assert from "node:assert/strict";
import { matchTypos } from "string-typo-match";

const result = matchTypos("Lenstein", ["Levenstein", "Einstein"]);
assert.equal(result.bestMatch, "Levenstein");
assert.equal(result.matches[0].operations[0].kind, "omitted-block");
```


## Documentation

Please [visit codsen.com](https://codsen.com/os/string-typo-match/) for a full description of the API. If you’re looking for the **Changelog**, it’s [here](https://github.com/codsen/codsen/blob/main/packages/string-typo-match/CHANGELOG.md).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2026 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
