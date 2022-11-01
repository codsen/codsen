<h1 align="center">arrayiffy-if-string</h1>

<p align="center">Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.</p>

<p align="center">
  <a href="https://codsen.com/os/arrayiffy-if-string" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/arrayiffy-if-string" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/arrayiffy-if-string" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/arrayiffy-if-string?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/arrayiffy-if-string.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/arrayiffy-if-string/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.14.0 (`npm i arrayiffy-if-string@3.14.0`).

```bash
npm i arrayiffy-if-string
```

## Quick Take

```js
import { strict as assert } from "assert";

import { arrayiffy } from "arrayiffy-if-string";

assert.deepEqual(arrayiffy("aaa"), ["aaa"]);

assert.deepEqual(arrayiffy(""), []);

assert.equal(arrayiffy(true), true);

assert.equal(arrayiffy(), undefined);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/arrayiffy-if-string/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

Thanks to KRyan for types https://stackoverflow.com/a/71834598/3943954

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
