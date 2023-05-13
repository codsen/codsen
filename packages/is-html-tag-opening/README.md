<h1 align="center">is-html-tag-opening</h1>

<p align="center">Does an HTML tag start at given position?</p>

<p align="center">
  <a href="https://codsen.com/os/is-html-tag-opening" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/is-html-tag-opening" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/is-html-tag-opening" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/is-html-tag-opening?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/is-html-tag-opening.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/is-html-tag-opening/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i is-html-tag-opening@2.1.0`).

```bash
npm i is-html-tag-opening
```

## Quick Take

```js
import { strict as assert } from "assert";

import { isOpening } from "is-html-tag-opening";

const text = "<span>a < b<span>";

// opening span tag's opening
assert.equal(isOpening(text, 0), true);

// unencoded bracket between a and b
assert.equal(isOpening(text, 8), false);

// closing span tag's opening
assert.equal(isOpening(text, 11), true);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/is-html-tag-opening/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
