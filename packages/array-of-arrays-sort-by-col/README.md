# array-of-arrays-sort-by-col

> Sort array of arrays by column, rippling the sorting outwards from that column

<div class="package-badges">
  <a href="https://www.npmjs.com/package/array-of-arrays-sort-by-col" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/array-of-arrays-sort-by-col" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/array-of-arrays-sort-by-col" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/array-of-arrays-sort-by-col?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/array-of-arrays-sort-by-col.svg?style=flat-square" alt="Downloads per month">
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

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.1.0 (`npm i array-of-arrays-sort-by-col@3.1.0`).

```bash
npm i array-of-arrays-sort-by-col
```

## Quick Take

```js
import { strict as assert } from "assert";

import { sortByCol } from "array-of-arrays-sort-by-col";

// sort by second column, index number 1
assert.deepEqual(sortByCol([[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]], 1), [
  [1, 9, 2],
  [1, 9, 3],
  [1, 9, 4],
  [1],
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/array-of-arrays-sort-by-col/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
