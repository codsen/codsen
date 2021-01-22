# ranges-process-outside

> Iterate string considering ranges, as if they were already applied

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ranges-process-outside" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ranges-process-outside" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/ranges-process-outside" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/ranges-process-outside?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-process-outside.svg?style=flat-square" alt="Downloads per month">
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
npm i ranges-process-outside
```

## Quick Take

```js
import { strict as assert } from "assert";
import { rProcessOutside } from "ranges-process-outside";

const gathered = [];

// a callback interface:
rProcessOutside(
  "abcdefghij",
  [
    [1, 5], // delete from "b" to "f"
  ],
  (fromIdx, toIdx, offsetValueCb) => {
    gathered.push(fromIdx);
  }
);

assert.deepEqual(gathered, [0, 5, 6, 7, 8, 9]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-process-outside/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

