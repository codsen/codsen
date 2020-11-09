# string-extract-class-names

> Extract class (or id) name from a string

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-extract-class-names" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-extract-class-names" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-class-names" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-extract-class-names?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-extract-class-names.svg?style=flat-square" alt="Downloads per month">
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
npm i string-extract-class-names
```

## Quick Take

```js
import { strict as assert } from "assert";
import extract from "string-extract-class-names";

// extracts classes
assert.deepEqual(extract("div.first-class.second-class"), [
  ".first-class",
  ".second-class",
]);

// and id's
assert.deepEqual(extract("div#brambles.gramples#croodles"), [
  "#brambles",
  ".gramples",
  "#croodles",
]);

// optionally, you can request ranges (see codsen.com/ranges/):
assert.deepEqual(extract("div.first-class.second-class", true), [
  [3, 15],
  [15, 28],
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-extract-class-names/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
