# is-html-tag-opening

> Does an HTML tag start at given position?

<div class="package-badges">
  <a href="https://www.npmjs.com/package/is-html-tag-opening" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/is-html-tag-opening" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/is-html-tag-opening" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/is-html-tag-opening?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/is-html-tag-opening.svg?style=flat-square" alt="Downloads per month">
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
npm i is-html-tag-opening
```

## Quick Take

```js
import { strict as assert } from "assert";
import { isOpening } from "dist/is-html-tag-opening.esm";

const text = `<span>a < b<span>`;

// opening span tag's opening
assert.equal(isOpening(text, 0), true);

// unencoded bracket between a and b
assert.equal(isOpening(text, 8), false);

// closing span tag's opening
assert.equal(isOpening(text, 11), true);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/is-html-tag-opening/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

