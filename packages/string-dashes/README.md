<h1 align="center">string-dashes</h1>

<p align="center">Comprehensive, HTML-entities-aware tool to typographically-correct the dashes and hyphens</p>

<p align="center">
  <a href="https://codsen.com/os/string-dashes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-dashes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-dashes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-dashes?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-dashes.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-dashes/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
npm i string-dashes
```

## Quick Take

```js
import { strict as assert } from "assert";

import { convertOne, convertAll } from "string-dashes";

assert.deepEqual(
  convertAll(`Dashes come in two sizes - the en dash and the em dash.`, {
    convertDashes: true,
    convertEntities: true,
  }),
  {
    result: "Dashes come in two sizes &mdash; the en dash and the em dash.",
    ranges: [[25, 26, "&mdash;"]],
  }
);

assert.deepEqual(
  convertOne(`Dashes come in two sizes - the en dash and the em dash.`, {
    from: 25,
    convertDashes: true,
    convertEntities: true,
  }),
  [[25, 26, "&mdash;"]]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-dashes/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
