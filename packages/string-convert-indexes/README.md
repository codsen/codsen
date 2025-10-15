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
import { strict as assert } from "assert";

import { nativeToUnicode, unicodeToNative } from "string-convert-indexes";

// CONVERTING NATIVE JS INDEXES TO UNICODE-CHAR-COUNT-BASED
// 𝌆 - \uD834\uDF06

// at index 1, we have low surrogate, that's still grapheme index zero
assert.equal(nativeToUnicode("\uD834\uDF06aa", "1"), "0");
// notice it's retained as string. The same type as input is retained!

// at index 2, we have first letter a - that's second index, counting graphemes
assert.equal(nativeToUnicode("\uD834\uDF06aa", 3), 2);

// convert many indexes at once - any nested data structure is fine:
assert.deepEqual(nativeToUnicode("\uD834\uDF06aa", [1, 0, 2, 3]), [0, 0, 1, 2]);

// numbers from an AST-like complex structure are still picked out and converted:
assert.deepEqual(nativeToUnicode("\uD834\uDF06aa", [1, "0", [[[2]]], 3]), [
  0, // notice matching type is retained
  "0", // notice matching type is retained
  [[[1]]],
  2,
]);

// CONVERTING UNICODE-CHAR-COUNT-BASED TO NATIVE JS INDEXES
// 𝌆 - \uD834\uDF06

assert.deepEqual(unicodeToNative("\uD834\uDF06aa", [0, 1, 2]), [0, 2, 3]);

assert.deepEqual(unicodeToNative("\uD834\uDF06aa", [1, 0, 2]), [2, 0, 3]);

assert.throws(() => unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3]));
// throws an error!
// that's because there's no character (counting Unicode characters) with index 3
// we have only three Unicode characters, so indexes go only up until 2
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-convert-indexes/) for a full description of the API. If you’re looking for the **Changelog**, it’s [here](https://github.com/codsen/codsen/blob/main/packages/string-convert-indexes/CHANGELOG.md).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2025 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
