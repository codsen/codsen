# str-indexes-of-plus

> Like indexOf but returns array and counts per-grapheme

<div class="package-badges">
  <a href="https://www.npmjs.com/package/str-indexes-of-plus" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/str-indexes-of-plus" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/str-indexes-of-plus" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/str-indexes-of-plus?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/str-indexes-of-plus.svg?style=flat-square" alt="Downloads per month">
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
npm i str-indexes-of-plus
```

## Quick Take

```js
import { strict as assert } from "assert";
import { strIndexesOfPlus } from "str-indexes-of-plus";

// searches for string in a string, returns array:
assert.deepEqual(strIndexesOfPlus("abc-abc-abc-abc", "abc"), [0, 4, 8, 12]);

// all graphemes are counted as one, emoji too:
assert.deepEqual(
  strIndexesOfPlus("🐴-🦄", "🦄"),
  [2] // not [3] considering unicorn is 2-characters long
);

// you can offset the start of a search:
assert.deepEqual(strIndexesOfPlus("abczabc", "abc", 3), [4]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/str-indexes-of-plus/) for a full description of the API and examples.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
