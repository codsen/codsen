<h1 align="center">csv-split-easy</h1>

<p align="center">Splits the CSV string into array of arrays, each representing a row of columns</p>

<p align="center">
  <a href="https://codsen.com/os/csv-split-easy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/csv-split-easy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/csv-split-easy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/csv-split-easy?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/csv-split-easy.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/csv-split-easy/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.1.0 (`npm i csv-split-easy@5.1.0`).

```bash
npm i csv-split-easy
```

## Quick Take

```js
import { strict as assert } from "assert";

import { splitEasy } from "csv-split-easy";

assert.deepEqual(
  splitEasy(
    'Product Name,Main Price,Discounted Price\nTestarossa (Type F110),"100,000","90,000"\nF50,"2,500,000","1,800,000"'
  ),
  [
    ["Product Name", "Main Price", "Discounted Price"],
    ["Testarossa (Type F110)", "100000", "90000"],
    ["F50", "2500000", "1800000"],
  ]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/csv-split-easy/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
