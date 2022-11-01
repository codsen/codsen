<h1 align="center">string-trim-spaces-only</h1>

<p align="center">Like String.trim() but you can choose granularly what to trim</p>

<p align="center">
  <a href="https://codsen.com/os/string-trim-spaces-only" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-trim-spaces-only" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-trim-spaces-only" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-trim-spaces-only?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-trim-spaces-only.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-trim-spaces-only/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.1.0 (`npm i string-trim-spaces-only@3.1.0`).

```bash
npm i string-trim-spaces-only
```

## Quick Take

```js
import { strict as assert } from "assert";

import { trimSpaces } from "string-trim-spaces-only";

assert.deepEqual(trimSpaces("  aaa   "), {
  res: "aaa",
  ranges: [
    [0, 2],
    [5, 8],
  ],
});

assert.deepEqual(trimSpaces("   \t  zz   \n    "), {
  res: "\t  zz   \n",
  ranges: [
    [0, 3],
    [12, 16],
  ],
});
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-trim-spaces-only/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
