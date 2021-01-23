# object-boolean-combinations

> Consumes a defaults object with booleans, generates all possible variations of it

<div class="package-badges">
  <a href="https://www.npmjs.com/package/object-boolean-combinations" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/object-boolean-combinations" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/object-boolean-combinations" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/object-boolean-combinations?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/object-boolean-combinations.svg?style=flat-square" alt="Downloads per month">
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
npm i object-boolean-combinations
```

## Quick Take

```js
import { strict as assert } from "assert";
import { combinations } from "object-boolean-combinations";

assert.deepEqual(
  combinations({
    a: true,
    b: false,
    c: true,
  }),
  [
    { a: false, b: false, c: false },
    { a: true, b: false, c: false },
    { a: false, b: true, c: false },
    { a: true, b: true, c: false },
    { a: false, b: false, c: true },
    { a: true, b: false, c: true },
    { a: false, b: true, c: true },
    { a: true, b: true, c: true },
  ]
);
// you get 2^n plain objects in an array
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/object-boolean-combinations/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
