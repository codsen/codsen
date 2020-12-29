# string-range-expander

> Expands string index ranges within whitespace boundaries until letters are met

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-range-expander" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-range-expander" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/string-range-expander" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/string-range-expander?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-range-expander.svg?style=flat-square" alt="Downloads per month">
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
npm i string-range-expander
```

## Quick Take

```js
import { strict as assert } from "assert";
import { expander } from "string-range-expander";

// let's say we have picked the "zzzz" index range - [16, 20]
// "something>\n\t    zzzz <here"
//                    |   |
//                  from  to
//
// PS. "\n" and "\t" take up a single character's length

assert.deepEqual(
  expander({
    str: "something>\n\t    zzzz <here",
    from: 16,
    to: 20,
    ifRightSideIncludesThisThenCropTightly: "<",
  }),
  [10, 21]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-range-expander/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
