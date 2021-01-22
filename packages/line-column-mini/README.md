# line-column-mini

> Convert string index to line-column position

<div class="package-badges">
  <a href="https://www.npmjs.com/package/line-column-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/line-column-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/line-column-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/line-column-mini?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/line-column-mini.svg?style=flat-square" alt="Downloads per month">
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
npm i line-column-mini
```

## Quick Take

```js
import { strict as assert } from "assert";
import { lineCol, getLineStartIndexes } from "line-column-mini";

// index 14 is letter "k" on the fourth line:
assert.deepEqual(lineCol("abc\ndef\r\nghi\njkl", 14), {
  line: 4,
  col: 2,
});

// ---------------------------------------------------------

// if you know you might query multiple times, use caching
const lineIndexes = getLineStartIndexes("abc\ndef\r\nghi\njkl");
assert.deepEqual(lineCol(lineIndexes, 14), {
  line: 4,
  col: 2,
});
// other queries will be by magnitude faster:
assert.deepEqual(lineCol(lineIndexes, 15), {
  line: 4,
  col: 3,
});

// by the way...
assert.deepEqual(lineCol(lineIndexes, 99), null);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/line-column-mini/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

