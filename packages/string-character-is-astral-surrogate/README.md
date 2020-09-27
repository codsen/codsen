# string-character-is-astral-surrogate

> Tells, is given character a part of astral character, specifically, a high and low surrogate

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-character-is-astral-surrogate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-character-is-astral-surrogate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-character-is-astral-surrogate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-character-is-astral-surrogate?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-character-is-astral-surrogate.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i string-character-is-astral-surrogate
```

## Quick Take

```js
import { strict as assert } from "assert";
import {
  isHighSurrogate,
  isLowSurrogate,
} from "string-character-is-astral-surrogate";

// 🧢 = \uD83E\uDDE2

assert.equal(isHighSurrogate("\uD83E"), true);
// the first character, high surrogate of the cap is indeed a high surrogate

assert.equal(isHighSurrogate("\uDDE2"), false);
// the second character, low surrogate of the cap is NOT a high surrogate

assert.equal(isLowSurrogate("\uD83E"), false);
// the first character, high surrogate of the cap is NOT a low surrogate
// it's a high surrogate

assert.equal(isLowSurrogate("\uDDE2"), true);
// the second character, low surrogate of the cap is indeed a low surrogate
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-character-is-astral-surrogate/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
