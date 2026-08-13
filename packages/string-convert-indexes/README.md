<h1 align="center">string-convert-indexes</h1>

<p align="center">Convert between native JS string character indexes and grapheme-count-based indexes</p>

<p align="center">
  <a href="https://codsen.com/os/string-convert-indexes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-convert-indexes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-convert-indexes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-convert-indexes?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-convert-indexes.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-convert-indexes/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.1.0 (`npm i string-convert-indexes@4.1.0`).

```bash
npm i string-convert-indexes
```

## Quick Take

```js
import { strict as assert } from "node:assert";

import { nativeToUnicode } from "string-convert-indexes";

// CONVERTING NATIVE JS INDEXES TO UNICODE-CHAR-COUNT-BASED
// 𝌆 - \uD834\uDF06

// at index 1, we have low surrogate, that's still grapheme index zero
assert.equal(nativeToUnicode("\uD834\uDF06aa", "1"), "0");
// notice it's retained as string. The same type as input is retained!
```


## Documentation

Please [visit codsen.com](https://codsen.com/os/string-convert-indexes/) for a full description of the API. If you’re looking for the **Changelog**, it’s [here](https://github.com/codsen/codsen/blob/main/packages/string-convert-indexes/CHANGELOG.md).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2026 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
