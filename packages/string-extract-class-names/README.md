# string-extract-class-names

> Extracts CSS class/id names from a string

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-extract-class-names" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-extract-class-names" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-extract-class-names" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
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
import { extract } from "string-extract-class-names";

// extracts classes and/or id's
const str = "div#brambles.nushes#croodles";
const { res, ranges } = extract(str);
assert.deepEqual(res, ["#brambles", ".nushes", "#croodles"]);
assert.deepEqual(ranges, [
  [3, 12],
  [12, 19],
  [19, 28],
]);

// `res` can be produced by slicing `ranges`:
assert.deepEqual(
  res,
  ranges.map(([from, to]) => str.slice(from, to))
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-extract-class-names/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
