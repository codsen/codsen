<h1 align="center">array-includes-with-glob</h1>

<p align="center">Like _.includes but with wildcards</p>

<p align="center">
  <a href="https://codsen.com/os/array-includes-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/array-includes-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/array-includes-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/array-includes-with-glob?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/array-includes-with-glob.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/array-includes-with-glob/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.1.0 (`npm i array-includes-with-glob@3.1.0`).

```bash
npm i array-includes-with-glob
```

## Quick Take

```js
import { strict as assert } from "assert";

import { includesWithGlob } from "array-includes-with-glob";

assert.equal(includesWithGlob(["xc", "yc", "zc"], "*c"), true);
// (all 3)

assert.equal(includesWithGlob(["xc", "yc", "zc"], "*a"), false);
// (none found)

assert.equal(includesWithGlob(["something", "anything", "zzz"], "some*"), true);
// (1 hit)
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/array-includes-with-glob/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2024 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
