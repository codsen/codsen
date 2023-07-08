<h1 align="center">string-split-by-whitespace</h1>

<p align="center">Split string into array by chunks of whitespace</p>

<p align="center">
  <a href="https://codsen.com/os/string-split-by-whitespace" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-split-by-whitespace" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-split-by-whitespace" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-split-by-whitespace?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-split-by-whitespace.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-split-by-whitespace/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i string-split-by-whitespace@2.1.0`).

```bash
npm i string-split-by-whitespace
```

## Quick Take

```js
import { strict as assert } from "assert";

import { splitByW } from "string-split-by-whitespace";

// Split by whitespace is easy - use native String.prototype.split()
assert.deepEqual("abc  def ghi".split(/\s+/), ["abc", "def", "ghi"]);

const source = "\n     \n    a\t \nb    \n      \t";

// this program is nearly equivalent to regex-based split:
assert.deepEqual(source.split(/\s+/), ["", "a", "b", ""]);
assert.deepEqual(splitByW(source), ["a", "b"]);
// regex-based split needs more filtration but it's native solution

// ADDITIONALLY...

// this program allows to exclude certain index ranges:
assert.deepEqual(
  splitByW("a b c d e", {
    ignoreRanges: [[0, 2]], // that's "a" and space after it
  }),
  ["b", "c", "d", "e"],
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-split-by-whitespace/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
