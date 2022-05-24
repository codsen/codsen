# string-bionic-split

> Calculate a word string split position index for later highlighting

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-bionic-split" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-bionic-split" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-bionic-split" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-bionic-split?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-bionic-split.svg?style=flat-square" alt="Downloads per month">
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

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
npm i string-bionic-split
```

## Quick Take

```js
import { strict as assert } from "assert";

import { split } from "string-bionic-split";

const sources = [
  "the",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "a",
  "lazy",
  "dog",
];

const splitSources = sources.map(
  (str) => `${str.slice(0, split(str))} + ${str.slice(split(str))}`
);

assert.deepEqual(splitSources, [
  "t + he",
  "qui + ck",
  "bro + wn",
  "f + ox",
  "jum + ps",
  "ov + er",
  "a + ",
  "la + zy",
  "d + og",
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-bionic-split/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
