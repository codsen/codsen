# string-trim-spaces-only

> Like String.trim() but you can choose granularly what to trim

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-trim-spaces-only" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-trim-spaces-only" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/string-trim-spaces-only" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/string-trim-spaces-only?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-trim-spaces-only.svg?style=flat-square" alt="Downloads per month">
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
npm i string-trim-spaces-only
```

## Quick Take

```js
import { strict as assert } from "assert";
import trimSpaces from "string-trim-spaces-only";

assert.deepEqual(trimSpaces("  aaa   "), {
  res: "aaa",
  ranges: [
    [0, 2],
    [5, 8],
  ],
});

assert.deepEqual(trimSpaces("   \t  zz   \n    "), {
  res: "\t  zz   \n",
  ranges: [
    [0, 3],
    [12, 16],
  ],
});
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-trim-spaces-only/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
