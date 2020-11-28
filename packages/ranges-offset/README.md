# ranges-offset

> Increment or decrement each index in every range

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ranges-offset" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ranges-offset" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/ranges-offset" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/ranges-offset?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-offset.svg?style=flat-square" alt="Downloads per month">
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
npm i ranges-offset
```

## Quick Take

```js
import { strict as assert } from "assert";
import offset from "ranges-offset";

assert.deepEqual(
  offset(
    [
      [3, 5],
      [8, 7],
    ],
    10
  ),
  [
    [13, 15],
    [18, 17],
  ]
);

// ranges are empty, nothing happens:
assert.deepEqual(offset(null, 10), null);

// if input does not resemble ranges, nothing happens:
assert.deepEqual(offset(true, 10), true);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-offset/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
