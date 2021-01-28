# ranges-iterate

> Iterate a string and any changes within given string index ranges

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ranges-iterate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ranges-iterate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ranges-iterate" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ranges-iterate?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-iterate.svg?style=flat-square" alt="Downloads per month">
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
npm i ranges-iterate
```

## Quick Take

```js
import { strict as assert } from "assert";
import { rIterate } from "ranges-iterate";

// Ranges in the following example "punches out" a "hole" from `a` to `g`
// (included), replacing it with `xyz`. That's what gets iterated.

const gathered = [];

// a callback-based interface:
rIterate("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
  gathered.push(`i = ${i}; val = ${val}`);
});

assert.deepEqual(gathered, [
  "i = 0; val = x",
  "i = 1; val = y",
  "i = 2; val = z",
  "i = 3; val = h",
  "i = 4; val = i",
  "i = 5; val = j",
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-iterate/) for a full description of the API and examples.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
