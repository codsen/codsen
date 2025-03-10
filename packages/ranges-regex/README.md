<h1 align="center">ranges-regex</h1>

<p align="center">Integrate regex operations into Ranges workflow</p>

<p align="center">
  <a href="https://codsen.com/os/ranges-regex" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/ranges-regex" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ranges-regex" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ranges-regex?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-regex.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/ranges-regex/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.1.0 (`npm i ranges-regex@4.1.0`).

```bash
npm i ranges-regex
```

## Quick Take

```js
import { strict as assert } from "assert";

import { rRegex } from "ranges-regex";

const oldString = "The quick brown fox jumps over the lazy dog.";
const result = rRegex(/the/gi, oldString);

// all regex matches, but in Ranges notation (see codsen.com/ranges/):
assert.deepEqual(result, [
  [0, 3],
  [31, 34],
]);

// if you slice the ranges, you'll get original regex caught values:
assert.deepEqual(
  result.map(([from, to]) => oldString.slice(from, to)),
  ["The", "the"],
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-regex/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
