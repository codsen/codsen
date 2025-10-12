<h1 align="center">string-character-is-astral-surrogate</h1>

<p align="center">Tells, is given character a part of astral character, specifically, a high and low surrogate</p>

<p align="center">
  <a href="https://codsen.com/os/string-character-is-astral-surrogate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-character-is-astral-surrogate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-character-is-astral-surrogate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-character-is-astral-surrogate?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-character-is-astral-surrogate.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-character-is-astral-surrogate/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 1.13.0 (`npm i string-character-is-astral-surrogate@1.13.0`).

```bash
npm i string-character-is-astral-surrogate
```

## Quick Take

```js
import { strict as assert } from "assert";

import {
  isHighSurrogate,
  isLowSurrogate,
} from "string-character-is-astral-surrogate";

// 🧢 = \uD83E\uDDE2

assert.equal(isHighSurrogate("\uD83E"), true);
// the first character, high surrogate of the cap is indeed a high surrogate

assert.equal(isHighSurrogate("\uDDE2"), false);
// the second character, low surrogate of the cap is NOT a high surrogate

assert.equal(isLowSurrogate("\uD83E"), false);
// the first character, high surrogate of the cap is NOT a low surrogate
// it's a high surrogate

assert.equal(isLowSurrogate("\uDDE2"), true);
// the second character, low surrogate of the cap is indeed a low surrogate
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-character-is-astral-surrogate/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2025 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
