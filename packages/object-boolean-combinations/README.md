# object-boolean-combinations

> Consumes a defaults object with booleans, generates all possible variations of it

<div class="package-badges">
  <a href="https://www.npmjs.com/package/object-boolean-combinations" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/object-boolean-combinations" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/object-boolean-combinations" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/object-boolean-combinations?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/object-boolean-combinations.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i object-boolean-combinations
```

## Quick Take

```js
import { strict as assert } from "assert";
import combinations from "object-boolean-combinations";

assert.deepEqual(
  combinations({
    a: true, // values don't matter as long as they're boolean
    b: false,
    c: true,
  }),
  [
    { a: 0, b: 0, c: 0 },
    { a: 1, b: 0, c: 0 },
    { a: 0, b: 1, c: 0 },
    { a: 1, b: 1, c: 0 },
    { a: 0, b: 0, c: 1 },
    { a: 1, b: 0, c: 1 },
    { a: 0, b: 1, c: 1 },
    { a: 1, b: 1, c: 1 },
  ]
);
// you get 2^n plain objects in an array
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/object-boolean-combinations/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
