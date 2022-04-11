# email-all-chars-within-ascii

> Scans all characters within a string and checks are they within ASCII range

<div class="package-badges">
  <a href="https://www.npmjs.com/package/email-all-chars-within-ascii" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/email-all-chars-within-ascii" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/email-all-chars-within-ascii" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/email-all-chars-within-ascii?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/email-all-chars-within-ascii.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
  <a href="https://liberamanifesto.com" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/libera-manifesto-lightgrey.svg?style=flat-square" alt="libera manifesto">
  </a>
</div>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.1.0 (`npm i email-all-chars-within-ascii@3.1.0`).

```bash
npm i email-all-chars-within-ascii
```

## Quick Take

```js
import { strict as assert } from "assert";

import { within } from "email-all-chars-within-ascii";

// enforces all characters to be within ASCII:
assert.deepEqual(within(`<div>Motörhead</div>`), [
  {
    type: "character",
    line: 1,
    column: 9,
    positionIdx: 8,
    value: "ö",
    codePoint: 246,
    UTF32Hex: "00f6",
  },
]);

// enforces line lengths (500 is best for email):
assert.deepEqual(within(`abcde`, { lineLength: 3 }), [
  {
    type: "line length",
    line: 1,
    column: 5,
    positionIdx: 5,
    value: 5,
  },
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/email-all-chars-within-ascii/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
