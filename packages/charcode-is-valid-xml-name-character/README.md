<h1 align="center">charcode-is-valid-xml-name-character</h1>

<p align="center">Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)</p>

<p align="center">
  <a href="https://codsen.com/os/charcode-is-valid-xml-name-character" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/charcode-is-valid-xml-name-character" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/charcode-is-valid-xml-name-character" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/charcode-is-valid-xml-name-character?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/charcode-is-valid-xml-name-character.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/charcode-is-valid-xml-name-character/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 1.13.0 (`npm i charcode-is-valid-xml-name-character@1.13.0`).

```bash
npm i charcode-is-valid-xml-name-character
```

## Quick Take

```js
import { strict as assert } from "assert";

import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "charcode-is-valid-xml-name-character";

// Spec: https://www.w3.org/TR/REC-xml/#NT-NameStartChar

assert.equal(isProduction4("Z"), true);
assert.equal(isProduction4("?"), false);

assert.equal(isProduction4a("?"), false);
assert.equal(isProduction4a("-"), true);

assert.equal(validFirstChar("a"), true);
assert.equal(validFirstChar("1"), false);

assert.equal(validSecondCharOnwards("a"), true);
assert.equal(validSecondCharOnwards("?"), false);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/charcode-is-valid-xml-name-character/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2024 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
