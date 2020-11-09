# string-left-right

> Looks up the first non-whitespace character to the left/right of a given index

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-left-right?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-left-right.svg?style=flat-square" alt="Downloads per month">
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
npm i string-left-right
```

## Quick Take

```js
import { strict as assert } from "assert";
import {
  left,
  right,
  leftSeq,
  rightSeq,
  chompLeft,
  chompRight,
  leftStopAtNewLines,
  rightStopAtNewLines,
} from "string-left-right";

// get the closest non-whitespace character to the left of "d" (which itself
// is at string index 6)
const str = "abc   def";
//             |   |
//           012345678

assert.equal(
  `next non-whitespace character to the left of ${str[6]} (index 6) is ${
    str[left(str, 6)]
  } (index ${left(str, 6)})`,
  "next non-whitespace character to the left of d (index 6) is c (index 2)"
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-left-right/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
