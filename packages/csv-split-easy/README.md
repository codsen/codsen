# csv-split-easy

> Splits the CSV string into array of arrays, each representing a row of columns

<div class="package-badges">
  <a href="https://www.npmjs.com/package/csv-split-easy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/csv-split-easy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/csv-split-easy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/csv-split-easy?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/csv-split-easy.svg?style=flat-square" alt="Downloads per month">
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

```bash
npm i csv-split-easy
```

## Quick Take

```js
import { strict as assert } from "assert";
import splitEasy from "csv-split-easy";

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

Please [visit codsen.com](https://codsen.com/os/csv-split-easy/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
