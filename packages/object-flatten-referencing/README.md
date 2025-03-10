<h1 align="center">object-flatten-referencing</h1>

<p align="center">Flatten complex nested objects according to a reference objects</p>

<p align="center">
  <a href="https://codsen.com/os/object-flatten-referencing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/object-flatten-referencing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/object-flatten-referencing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/object-flatten-referencing?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/object-flatten-referencing.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/object-flatten-referencing/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.1.0 (`npm i object-flatten-referencing@5.1.0`).

```bash
npm i object-flatten-referencing
```

## Quick Take

```js
import { strict as assert } from "assert";

import { flattenReferencing } from "object-flatten-referencing";

assert.deepEqual(
  flattenReferencing(
    {
      key1: "val11.val12",
      key2: "val21.val22",
    },
    {
      key1: "Contact us",
      key2: "Tel. 0123456789",
    },
  ),
  {
    key1: "%%_val11.val12_%%",
    key2: "%%_val21.val22_%%",
  },
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/object-flatten-referencing/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
