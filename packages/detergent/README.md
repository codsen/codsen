<h1 align="center">detergent</h1>

<p align="center">Extract, clean, encode text and fix English style</p>

<p align="center">
  <a href="https://codsen.com/os/detergent" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/detergent" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/detergent" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/detergent?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/detergent.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/detergent/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
  <a href="https://codsen.com/os/detergent/play"><img src="https://img.shields.io/badge/playground-here-brightgreen?style=flat-square" alt="playground"></a>
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 7.1.0 (`npm i detergent@7.1.0`).

```bash
npm i detergent
```

## Quick Take

```js
import { strict as assert } from "assert";

import { det, opts, version } from "detergent";

// on default setting, widow removal and encoding are enabled:
assert.equal(det("clean this text £").res, "clean this text&nbsp;&pound;");
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/detergent/) for a full description of the API. Also, try the [GUI playground](https://codsen.com/os/detergent/play).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

Passes unit tests from https://github.com/kemitchell/straight-to-curly-quotes.json, licenced under CC0-1.0

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
