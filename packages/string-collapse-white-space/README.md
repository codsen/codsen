# string-collapse-white-space

> Replace chunks of whitespace with a single spaces

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-collapse-white-space" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-collapse-white-space" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-white-space" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-collapse-white-space?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-collapse-white-space.svg?style=flat-square" alt="Downloads per month">
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
npm i string-collapse-white-space
```

## Quick Take

```js
import { strict as assert } from "assert";
import collapse from "string-collapse-white-space";

assert.equal(
  collapse("  aaa     bbb    ccc   dddd  ").result,
  "aaa bbb ccc dddd"
);

assert.equal(collapse("   \t\t\t   aaa   \t\t\t   ").result, "aaa");

assert.equal(
  collapse("   aaa   bbb  \n    ccc   ddd   ", { trimLines: false }).result,
  "aaa bbb \n ccc ddd"
);

assert.equal(
  collapse("   aaa   bbb  \n    ccc   ddd   ", { trimLines: true }).result,
  "aaa bbb\nccc ddd"
);

// \xa0 is an unencoded non-breaking space:
assert.equal(
  collapse(
    "     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ",
    { trimLines: true, trimnbsp: true }
  ).result,
  "aaa bbb\nccc ddd"
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-collapse-white-space/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
