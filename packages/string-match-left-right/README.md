# string-match-left-right

> Match substrings on the left or right of a given index, ignoring whitespace

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-match-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-match-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-match-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-match-left-right?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-match-left-right.svg?style=flat-square" alt="Downloads per month">
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

The latest version is **ESM only**: Node 12+ is needed to use it and it must be `import`ed instead of `require`d. If your project is not on ESM yet and you want to use `require`, use an older version of this program, `7.1.0`.

```bash
npm i string-match-left-right
```

## Quick Take

```js
import { strict as assert } from "assert";

import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "string-match-left-right";

// 3rd character is "d" because indexes start from zero.
// We're checking the string to the left of it, "bcd", inclusive of current character ("d").
// This means, "bcd" has to end with existing character and the other chars to the left
// must match exactly:
assert.equal(matchLeftIncl("abcdefghi", 3, ["bcd"]), "bcd");

// neither "ab" nor "zz" are to the left of 3rd index, "d":
assert.equal(matchLeft("abcdefghi", 3, ["ab", `zz`]), false);

// "def" is to the right of 3rd index (including it), "d":
assert.equal(matchRightIncl("abcdefghi", 3, ["def", `zzz`]), "def");

// One of values, "ef" is exactly to the right of 3rd index, "d":
assert.equal(matchRight("abcdefghi", 3, ["ef", `zz`]), "ef");
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-match-left-right/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
