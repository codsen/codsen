# ranges-ent-decode

> Recursive HTML entity decoding for Ranges workflow

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ranges-ent-decode" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ranges-ent-decode" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/ranges-ent-decode" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/ranges-ent-decode?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-ent-decode.svg?style=flat-square" alt="Downloads per month">
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
npm i ranges-ent-decode
```

## Quick Take

```js
import { strict as assert } from "assert";
import decode from "ranges-ent-decode";

// see codsen.com/ranges/
assert.deepEqual(decode("a &#x26; b &amp; c"), [
  [2, 8, "&"], // <--- that's Ranges notation, instructing to replace
  [11, 16, "&"],
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-ent-decode/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

Some tests and some regexes adapted from he.js
MIT Licence - Copyright © 2013-2018 Mathias Bynens <https://mathiasbynens.be/>
https://github.com/mathiasbynens/he

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
