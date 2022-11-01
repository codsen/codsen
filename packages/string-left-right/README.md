<h1 align="center">string-left-right</h1>

<p align="center">Looks up the first non-whitespace character to the left/right of a given index</p>

<p align="center">
  <a href="https://codsen.com/os/string-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-left-right" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-left-right?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-left-right.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-left-right/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.1.0 (`npm i string-left-right@4.1.0`).

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

Please [visit codsen.com](https://codsen.com/os/string-left-right/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
