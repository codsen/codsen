# charcode-is-valid-xml-name-character

> Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)

<div class="package-badges">
  <a href="https://www.npmjs.com/package/charcode-is-valid-xml-name-character" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/charcode-is-valid-xml-name-character" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/charcode-is-valid-xml-name-character" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/charcode-is-valid-xml-name-character?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/charcode-is-valid-xml-name-character.svg?style=flat-square" alt="Downloads per month">
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

The latest version is **ESM only**: Node 12+ is needed to use it and it must be `import`ed instead of `require`d. If your project is not on ESM yet and you want to use `require`, use an older version of this program, `1.13.0`.

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

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

